import os
import json
import mysql.connector
import decimal
import datetime
from typing import List, TypedDict, Dict, Any, Optional
from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
import httpx
from extract_json import extract_json_block

# Load environment variables
load_dotenv()

# GPT LLM
llm = ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv("GPT_API_KEY"), http_client=httpx.Client(verify=False))

# Database connection
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

# LangGraph State
class AgentState(TypedDict):
    """State for the agent"""
    user_id: int
    project_id: int
    project_name: str
    project_details: Dict[str, Any]
    team_members: List[int]
    team_members_details: Dict[str, Any]
    required_skills: Dict[str, Any]
    readiness_score: Optional[float]
    readiness_score_reasoning: Optional[str]
    suggestions: Optional[Dict[str, Any]]

# Collect data
def collect_data(state: AgentState) -> AgentState:
    """Collect project data"""
    connection, cursor = get_db_cursor()
    try:
        cursor.execute("SELECT * FROM m_projects WHERE project_id = %s", (state['project_id'],))
        project = cursor.fetchone()
        if project:
            state['project_name'] = project.get('project_name', '')
            state['project_details'] = {
                'client': project.get('client'),
                'duration': project.get('duration'),
                'start_date': str(project.get('start_date', '')),
                'status': project.get('status'),
            }
            manager_ids = json.loads(project['manager_ids']) if project.get('manager_ids') else []
            state['team_members'] = manager_ids
            state['required_skills'] = json.loads(project['skills']) if project.get('skills') else []
        else:
            state['team_members'] = []
            state['team_members_details'] = {}
            state['required_skills'] = []
        
        # Initialize team_members_details if not exists
        if 'team_members_details' not in state:
            state['team_members_details'] = {}
        
        # Fetch remaining team member ids
        cursor.execute("SELECT emp_id FROM t_emp_projects WHERE project_id = %s", (state['project_id'],))
        team_member_ids = cursor.fetchall()
        # Add team member ids, ensuring uniqueness
        state['team_members'].extend([member['emp_id'] for member in team_member_ids])
        state['team_members'] = list(set(state['team_members']))

        # Fetch team member details
        for member_id in state['team_members']:
            cursor.execute("""
                SELECT e.emp_id, e.name, e.skills as current_skills, p.role,
                       p.skills as skills_for_project, r.analysis
                FROM m_emp AS e
                JOIN t_emp_projects AS p ON e.emp_id = p.emp_id
                JOIN t_recommendation AS r ON e.emp_id = r.emp_id
                WHERE e.emp_id = %s AND p.project_id = %s AND r.goal = 'roadmap'
            """, (member_id, state['project_id']))
            member_details = cursor.fetchone()
            if member_details:
                state['team_members_details'][member_id] = member_details
        
        return state
    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return state
    except Exception as e:
        print(f"Error collecting data: {e}")
        return state
    finally:
        cursor.close()
        connection.close()

# Get readiness score
def get_readiness_score(state: AgentState) -> AgentState:
    """Calculate readiness score using LLM"""
    try:
        prompt = f"""
Role: You are an expert project readiness assessor for software teams.

Action: Assess the overall readiness of the team to execute the project based on the provided data.

Guardrails/Guidelines:
- Only use the provided data for your assessment
- Be objective and concise
- Provide readiness score between 0.0 and 1.0

Output format: Return JSON with:
{{
  "readiness_score": 0.0,
  "readiness_score_reasoning": "string"
}}

Project Data:
Project Details: {json.dumps(state['project_details'], default=str, indent=2)}
Required Skills: {json.dumps(state['required_skills'], default=str, indent=2)}
Team Members Details: {json.dumps(state['team_members_details'], default=str, indent=2)}
"""
        response = llm.invoke([HumanMessage(content=prompt)])
        result_json = extract_json_block(response.content)
        if result_json:
            state['readiness_score'] = result_json.get('readiness_score')
            state['readiness_score_reasoning'] = result_json.get('readiness_score_reasoning')
        else:
            state['readiness_score'] = 0.0
            state['readiness_score_reasoning'] = "Could not extract readiness score"
        return state
    except Exception as e:
        print(f"Error calculating readiness score: {e}")
        state['readiness_score'] = 0.0
        state['readiness_score_reasoning'] = f"Error: {str(e)}"
        return state

# Generate suggestions
def generate_suggestions(state: AgentState) -> AgentState:
    """Generate suggestions for improving project readiness"""
    connection, cursor = get_db_cursor()
    try:
        # Get available courses
        cursor.execute("SELECT * FROM m_courses")
        courses = cursor.fetchall()
        
        # Get potential team members where current user is manager
        cursor.execute("""
            SELECT emp_id, name, skills, role 
            FROM m_emp 
            WHERE JSON_CONTAINS(manager_ids, %s)
        """, (json.dumps(state['user_id']),))
        potential_team_members = cursor.fetchall()

        # from potential_team_members, remove those already in team_members
        potential_team_members = [
            member for member in potential_team_members 
            if member['emp_id'] not in state['team_members']
        ]
        
        prompt = f"""
Role: You are an expert project readiness consultant specializing in team optimization and skill development.

Action: Generate actionable suggestions to improve project readiness based on the team's current state and available resources.

Guardrails/Guidelines:
- Base suggestions on the provided project data and team analysis
- Focus on practical, implementable recommendations
- Consider available courses for skill development
- Address both technical and non-technical gaps
- Prioritize suggestions by impact and feasibility
- Make sure the suggested team members are not already part of the current team and it is okay if suggested team members are not available
- The suggestions other than the suggested team members should only be related to current team not to the potential team members

Output format: Return JSON with:
{{
  "suggestions": {{
    "immediate_actions": ["action1", "action2", ...],
    "team_courses": {{
      "emp_name1": ["course1", "course2"],
      "emp_name2": ["course3", "course4"]
    }},
    "suggested_team_members": [
      {{
        "emp_id": 123,
        "name": "Employee Name",
        "reason": "Why this person is recommended"
      }}
    ]
  }}
}}

Project Data:
Project Details: {json.dumps(state['project_details'], default=str, indent=2)}
Required Skills: {json.dumps(state['required_skills'], default=str, indent=2)}
Team Members Details: {json.dumps(state['team_members_details'], default=str, indent=2)}
Readiness Score: {state['readiness_score']}
Available Courses: {json.dumps(courses, default=str, indent=2)}
Potential Team Members: {json.dumps(potential_team_members, default=str, indent=2)}
"""
        
        response = llm.invoke([HumanMessage(content=prompt)])
        result_json = extract_json_block(response.content)
        if result_json:
            state['suggestions'] = result_json.get('suggestions', {})
        else:
            state['suggestions'] = {"error": "Could not extract suggestions"}
        
        return state
    except Exception as e:
        print(f"Error generating suggestions: {e}")
        state['suggestions'] = {"error": str(e)}
        return state
    finally:
        cursor.close()
        connection.close()

# Create the workflow
def create_workflow():
    """Create the LangGraph workflow"""
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("collect_data", collect_data)
    workflow.add_node("get_readiness_score", get_readiness_score)
    workflow.add_node("generate_suggestions", generate_suggestions)
    
    # Add edges
    workflow.set_entry_point("collect_data")
    workflow.add_edge("collect_data", "get_readiness_score")
    workflow.add_edge("get_readiness_score", "generate_suggestions")
    workflow.add_edge("generate_suggestions", END)
    
    return workflow.compile()

# Main function with only 2 inputs as requested
def assess_project_readiness(emp_id: int, project_id: int) -> Dict[str, Any]:
    """
    Main function to assess project readiness
    
    Args:
        emp_id: Current user employee ID
        project_id: Project ID to assess
        
    Returns:
        Dict containing the entire state with all collected data
    """
    try:
        # Initialize state
        initial_state = AgentState(
            user_id=emp_id,
            project_id=project_id,
            project_name="",
            project_details={},
            team_members=[],
            team_members_details={},
            required_skills={},
            readiness_score=None,
            readiness_score_reasoning=None,
            suggestions=None
        )
        
        # Create and run workflow
        app = create_workflow()
        final_state = app.invoke(initial_state)
        
        # Return entire state with status
        return {
            **final_state,  # Spread entire state
            "status": "success"
        }
        
    except Exception as e:
        return {
            "user_id": emp_id,
            "project_id": project_id,
            "project_name": "",
            "project_details": {},
            "team_members": [],
            "team_members_details": {},
            "required_skills": {},
            "readiness_score": 0.0,
            "readiness_score_reasoning": f"Error: {str(e)}",
            "suggestions": {},
            "status": "error",
            "error_message": str(e)
        }

# Example usage
# if __name__ == "__main__":
#     result = assess_project_readiness(emp_id=120, project_id=1032)
#     print(json.dumps(result, indent=2, default=str))

