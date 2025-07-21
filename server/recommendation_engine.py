import os
import json
import mysql.connector
import decimal
import datetime
from typing import TypedDict, Dict, Any, Optional
from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage
from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI
import time
import httpx
import re
from IPython.display import display, Image
from extract_json import extract_json_block

# Load environment variables
load_dotenv()

# Groq LLM
# llm = ChatGroq(model="gemma2-9b-it", api_key=os.getenv("GROQ_API_KEY"), http_client=httpx.Client(verify=False))

# GPT LLM
llm = ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv("GPT_API_KEY"), http_client=httpx.Client(verify=False))

# Database connection management
def get_db_connection():
    """Get a fresh database connection"""
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),
            port=int(os.getenv("DB_PORT", "3306")),
            autocommit=True,
            connection_timeout=30,
            pool_reset_session=True
        )
        return connection
    except Exception as e:
        print(f"Database connection error: {e}")
        raise

def get_db_cursor():
    """Get a fresh database cursor"""
    connection = get_db_connection()
    return connection, connection.cursor(dictionary=True)

# LangGraph state
class AgentState(TypedDict):
    emp_id: int
    goal: str
    retry_count: int = 0
    user_data: Dict[str, Any]
    llm_analysis: str
    output: str
    is_valid: bool
    validation_summary: str

# Serialize data for JSON (handles date and decimal)
def serialize(obj):
    if isinstance(obj, dict):
        return {k: serialize(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [serialize(v) for v in obj]
    elif isinstance(obj, (datetime.date, datetime.datetime)):
        return obj.isoformat()
    elif isinstance(obj, decimal.Decimal):
        return float(obj)
    else:
        return obj


# Step 1: Collect user data
def collect_user_data(state: AgentState) -> AgentState:
    emp_id = state["emp_id"]
    
    # Get fresh database connection
    db, cursor = get_db_cursor()
    
    try:
        cursor.execute("SELECT * FROM m_emp WHERE emp_id = %s", (emp_id,))
        emp = cursor.fetchone()

        cursor.execute("SELECT * FROM m_roles WHERE role_id = %s", (emp["role_id"],))
        emp["role_details"] = cursor.fetchone()

        cursor.execute("SELECT * FROM t_emp_kpi WHERE emp_id = %s", (emp_id,))
        emp["kpis"] = cursor.fetchall()

        cursor.execute("SELECT * FROM t_emp_projects WHERE emp_id = %s", (emp_id,))
        emp["projects"] = cursor.fetchall()

        cursor.execute("SELECT * FROM t_course_completion WHERE emp_id = %s", (emp_id,))
        emp["courses"] = cursor.fetchall()

        state["user_data"] = emp
        # print("User data collected:", emp)
        return state
    finally:
        cursor.close()
        db.close()

# Step 2: Analyze user
def analyze_user_data(state: AgentState) -> AgentState:
    emp = serialize(state["user_data"])

    prompt = f"""
Role: You are an employee performance and skill analyst specializing in professional development assessment.

Action: Analyze the provided employee data to understand their professional profile, identify behavioral patterns, learning preferences, and skill gaps.

Guardrails/Guidelines:
- Base analysis strictly on the provided employee data
- Focus on objective assessment rather than assumptions
- Consider both technical and soft skills
- Align skill gap identification with role expectations
- Ensure behavioral traits are evidence-based from the data
- Skill gaps should just have the name of the skill nothing else

Output format: Return JSON with:
{{
  "behavior_traits": ["trait1", "trait2", "trait3", ...],
  "learning_preferences": ["preference1", "preference2", "preference3", ...],
  "skill_gaps": ["gap1", "gap2", "gap3", ...]
}}

Employee Data:
{json.dumps(emp, indent=2)}
"""
    result = llm.invoke([HumanMessage(content=prompt)])
    state["llm_analysis"] = result.content
    # print("LLM Analysis:", state["llm_analysis"])
    return state

# Step 3: Generate output
def generate_output(state: AgentState) -> AgentState:
    emp = serialize(state["user_data"])
    analysis = state["llm_analysis"]
    goal = state["goal"]
    
    # Check if this is a retry with validation feedback
    validation_feedback = ""
    if state.get("retry_count", 0) > 0 and "validation_summary" in state:
        validation_feedback = f"\n\nPrevious attempt failed validation. Please address these issues:\n{state['validation_summary']}\n"

    # Get fresh database connection
    db, cursor = get_db_cursor()
    
    try:
        cursor.execute("SELECT * FROM m_courses")
        courses = cursor.fetchall()

        if goal == "roadmap":
            prompt = f"""
Role: You are a learning and development specialist who creates personalized skill development roadmaps for employees.

Action: Generate a comprehensive skill development roadmap using available courses that addresses the employee's skill gaps and aligns with their career progression.

Guardrails/Guidelines:
- Use only courses from the provided course catalog
- Recommend 2-4 courses
- Ensure logical progression from foundational to advanced topics
- Consider realistic timelines and employee workload
- Prioritize courses that address critical skill gaps first
- The "reason" field must be exactly 2-4 words explaining the selection
- Include both technical and soft skill development where applicable
- Ensure course sequence supports career advancement
- The reason should make sense to the end user for example: "Identified skill gap" should be "Identified skill gap in X via Y" 


Output format: Return JSON array:
[
  {{
    "c_name": "Course Name",
    "course_id": "...",
    "desc": "Course Description",
    "order": 1, # Order in roadmap
    "duration": number_of_months,
    "reason": "4-8 word reason for selection",
  }}
]

{validation_feedback}

Analysis:
{analysis}

Employee Data:
{json.dumps(emp, indent=2)}

Available Courses:
{courses}
"""
        else:
            prompt = f"""
Role: You are a learning recommendation specialist focused on targeted skill gap remediation.

Action: Recommend at least 2-4 best-fit courses from the available catalog that directly address the employee's most critical skill gaps.

Guardrails/Guidelines:
- Select only from the provided course catalog
- Recommend minimum 2 courses that address different skill areas, ideally 4-5
- Focus on courses that bridge the most critical skill gaps
- The "reason" field must be exactly 2-4 words explaining the selection
- Ensure recommendations are achievable within reasonable timeframe
- The reason should make sense to the end user for example: "Identified skill gap" should also mention the skill gap

Output format: Return JSON array:
[
  {{
    "course_id": "...",
    "name": "Course Name",
    "reason": "4-8 word reason for selection"
  }}
]

{validation_feedback}

Analysis:
{analysis}

Employee Data:
{json.dumps(emp, indent=2)}

Available Courses:
{json.dumps(serialize(courses), indent=2)}
"""

        result = llm.invoke([HumanMessage(content=prompt)])
        state["output"] = result.content
        # print("Generated Output:", state["output"])
        return state
    finally:
        cursor.close()
        db.close()

# Step 4: Validate output
def validate_output(state: AgentState) -> AgentState:
    emp = serialize(state["user_data"])
    analysis = state["llm_analysis"]
    output = state["output"]
    goal = state["goal"]
    
    # Get fresh database connection
    db, cursor = get_db_cursor()
    
    try:
        cursor.execute("SELECT * FROM m_courses")
        courses = cursor.fetchall()

        prompt = f"""
Role: You are a quality assurance validator for learning and development recommendations.

Action: Validate the {goal} output to ensure it meets all requirements, is appropriate for the employee, and follows the specified format.

Guardrails/Guidelines:
- All recommended courses must exist in the provided course catalog
- JSON format must be valid and complete
- Reasoning must be 2-4 words and meaningful
- Course progression must be logical and realistic
- Validate against employee's current role and career level
- Set valid to false only if there are critical issues

Output format: Return JSON:
{{
  "valid": true or false,
  "reason": "Detailed explanation of validation result"
}}

Available Courses:
{courses}

Employee Analysis:
{analysis}

Employee Data:
{json.dumps(emp, indent=2)}

Output to Validate:
{output}
"""
        result = llm.invoke([HumanMessage(content=prompt)])
        try:
            check = extract_json_block(result.content)
            # print("Validation Check:", check)
            state["is_valid"] = check["valid"]
        except:
            state["is_valid"] = True  # Assume valid if parsing fails

        state["validation_summary"] = result.content
        # print("Validation Summary:", state["validation_summary"])
        # print("Validation Result:", state["is_valid"])
        return state
    finally:
        cursor.close()
        db.close()

# Step 5: Final output
def final_output(state: AgentState) -> AgentState:
    # extracted_json = extract_json_block(state["output"])
    # print(f"\n✅ FINAL {state['goal'].upper()}")
    # if extracted_json:
    #     print(extracted_json)
    # else:
    #     print("❌ Failed to extract JSON from output.")
    #     print(state["output"])
    return state

def fallback_output(state: AgentState) -> AgentState:
    # print("\n❌ Output failed validation even after retry.")
    # print("🔁 Please review manually:")
    # extracted_json = extract_json_block(state["output"])
    # if extracted_json:
    #     print(extracted_json)
    # else:
    #     print("❌ Failed to extract JSON from output.")
    #     print(state["output"])
    return state

# Add a new retry node
def retry_analysis(state: AgentState) -> AgentState:
    state["retry_count"] = 1
    return state

# LangGraph setup
def build_graph():
    builder = StateGraph(AgentState)

    builder.add_node("Collect", collect_user_data)
    builder.add_node("Analyze", analyze_user_data)
    builder.add_node("Generate", generate_output)
    builder.add_node("Validate", validate_output)
    builder.add_node("Retry", retry_analysis)  # Add the retry node
    builder.add_node("FinalOutput", final_output)
    builder.add_node("FallbackOutput", fallback_output)

    builder.set_entry_point("Collect")
    builder.add_edge("Collect", "Analyze")
    builder.add_edge("Analyze", "Generate")
    builder.add_edge("Generate", "Validate")
    builder.add_edge("Retry", "Analyze")  # Add edge from Retry to Analyze

    def output_selector(state: AgentState) -> str:
        if state["is_valid"]:
            return "FinalOutput"
        elif state.get("retry_count", 0) == 0:
            return "Retry"  # Go to Retry node instead of Analyze
        else:
            return "FallbackOutput"

    builder.add_conditional_edges("Validate", output_selector, {
        "FinalOutput": "FinalOutput",
        "Retry": "Retry",  # Update conditional edge
        "FallbackOutput": "FallbackOutput"
    })
    builder.add_edge("FinalOutput", END)
    builder.add_edge("FallbackOutput", END)

    return builder.compile()

# emp_id = 120            # Change as needed
# goal = "roadmap"        # Use "roadmap" or "courses"

# graph = build_graph()

# result = graph.invoke({
#     "emp_id": emp_id,
#     "goal": goal,
# })
