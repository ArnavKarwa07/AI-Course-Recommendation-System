import os
import json
from typing import Dict, List, TypedDict
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, AIMessage
from langchain_openai import ChatOpenAI
import httpx
from datetime import datetime
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from sqlalchemy.orm import sessionmaker
from sqlalchemy import desc
from db import get_db
from models import Employee, Course, CourseCompletion, Recommendation

# Load environment variables
load_dotenv()

# Initialize LLM
llm = ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv("GPT_API_KEY"), http_client=httpx.Client(verify=False))

# Define state
class ChatState(TypedDict):
    messages: List[HumanMessage | AIMessage]
    emp_id: int
    employee_data: Dict

# Simple chat memory storage
chat_memory: Dict[int, List[Dict]] = {}

def get_employee_data(emp_id: int) -> Dict:
    """Get employee data from database using SQLAlchemy"""
    db = next(get_db())
    try:
        # Get employee data
        employee = db.query(Employee).filter(Employee.emp_id == emp_id).first()
        
        if not employee:
            return {}
        
        # Get completed courses with course details
        completed_courses = db.query(
            Course.name,
            Course.category,
            CourseCompletion.score
        ).join(
            CourseCompletion, Course.course_id == CourseCompletion.course_id
        ).filter(
            CourseCompletion.emp_id == emp_id
        ).all()
        
        # Get latest recommendations
        recommendations = db.query(Recommendation).filter(
            Recommendation.emp_id == emp_id
        ).order_by(
            desc(Recommendation.last_updated_time)
        ).all()

        return {
            'employee': {
                'name': employee.name,
                'role': employee.role,
                'dept': employee.dept,
                'skills': employee.skills,
                'career_goal': employee.career_goal
            },
            'completed_courses': [
                {
                    'name': course.name,
                    'category': course.category,
                    'score': course.score
                } for course in completed_courses
            ],
            'recommendations': [
                {
                    'goal': rec.goal,
                    'output': rec.output,
                    'analysis': rec.analysis if rec.analysis else {}
                } for rec in recommendations
            ]
        }
    finally:
        db.close()

def load_employee_context(state: ChatState) -> ChatState:
    """Load employee data and context"""
    employee_data = get_employee_data(state["emp_id"])
    state["employee_data"] = employee_data
    return state

def build_system_prompt(state: ChatState) -> str:
    """Build system prompt with employee context"""
    employee_data = state["employee_data"]
    
    if not employee_data:
        return """You are SkillSense AI, a friendly learning assistant. 
Please inform the user that they need to log in to access personalized recommendations."""
    
    employee = employee_data.get('employee', {})
    completed_courses = employee_data.get('completed_courses', [])
    recommendations = employee_data.get('recommendations', [])
    
    # Build courses summary with proper error handling
    courses_summary = ""
    if completed_courses:
        valid_scores = []
        for course in completed_courses:
            score = course.get('score')
            if isinstance(score, (int, float)) and score is not None:
                valid_scores.append(score)
        
        avg_score = sum(valid_scores) / len(valid_scores) if valid_scores else 0
        categories = list(set(str(course.get('category', 'Unknown')) for course in completed_courses if course.get('category')))
        course_names = [str(course.get('name', 'Unknown')) for course in completed_courses[:3] if course.get('name')]
        
        courses_summary = f"""
Completed {len(completed_courses)} courses (avg score: {avg_score:.1f}/100)
Categories: {', '.join(categories)}
Recent courses: {', '.join(course_names)}"""
    else:
        courses_summary = "No completed courses yet"
    
    # Build recommendations summary with proper error handling
    rec_summary = ""
    if recommendations:
        latest_rec = recommendations[0]
        analysis = latest_rec.get('analysis', {})
        
        # Handle both dict and string analysis data
        if isinstance(analysis, dict):
            skill_gaps = analysis.get('skill_gaps', [])
            learning_prefs = analysis.get('learning_preferences', {})
        else:
            skill_gaps = []
            learning_prefs = {}
        
        # Safely handle skill gaps
        if isinstance(skill_gaps, list):
            skill_gaps_str = ', '.join(str(gap) for gap in skill_gaps)
        else:
            skill_gaps_str = 'None identified'
        
        # Safely handle learning preferences
        if isinstance(learning_prefs, dict):
            preferred_style = str(learning_prefs.get('preferred_style', 'Not specified'))
        else:
            preferred_style = 'Not specified'
        
        # Safely truncate recommendation output
        output = latest_rec.get('output', '')
        if isinstance(output, str) and len(output) > 200:
            output_preview = output[:200] + "..."
        elif isinstance(output, dict):
            output_preview = str(output)[:200] + "..."
        else:
            output_preview = str(output)[:200] + "..."
        
        rec_summary = f"""
Latest Career Goal: {str(latest_rec.get('goal', 'Not set'))}
Identified Skill Gaps: {skill_gaps_str}
Learning Style: {preferred_style}
Recommendation: {output_preview}"""
    else:
        rec_summary = "No recommendations generated yet"
    
    # Safely handle employee data with proper string conversion
    employee_name = str(employee.get('name', 'the employee'))
    employee_role = str(employee.get('role', 'Not specified'))
    employee_dept = str(employee.get('dept', 'Not specified'))
    
    # Handle skills - can be dict, list, or string
    skills = employee.get('skills', 'Not specified')
    if isinstance(skills, dict):
        skills_str = ', '.join(f"{k}: {v}" for k, v in skills.items())
    elif isinstance(skills, list):
        skills_str = ', '.join(str(skill) for skill in skills)
    else:
        skills_str = str(skills)
    
    career_goal = str(employee.get('career_goal', 'Not specified'))
    
    return f"""
You are SkillSense AI, a friendly and helpful learning assistant for {employee_name}. 

Your responses should be:
- Conversational and natural, like talking to a colleague
- Simple and easy to understand
- Free of technical jargon, symbols, and excessive formatting
- Structured as plain text without markdown symbols like ###, **, -, or bullet points
- Actionable and specific to their needs

IMPORTANT FORMATTING RULES:
- Do NOT use hashtags, asterisks, dashes, or other symbols for formatting
- Write in paragraph form or use simple numbered lists without symbols
- Avoid terms like "Action Plan", "Duration", "Course ID", "Focus"
- Use natural language instead of structured technical formats

EMPLOYEE CONTEXT:
Name: {employee_name}
Role: {employee_role} in {employee_dept} department
Current Skills: {skills_str}
Career Goal: {career_goal}

LEARNING PROGRESS:
{courses_summary}

INSIGHTS:
{rec_summary}

When suggesting courses or next steps, present them in bullet points, mentioning course names and explaining why they would be helpful based on the employee's goals and current progress.
"""

def chat_node(state: ChatState):
    """Main chat processing node with streaming"""
    try:
        # Get the last human message
        human_message = state["messages"][-1]
        
        # Build system prompt
        system_prompt = build_system_prompt(state)
        
        # Create full prompt
        full_prompt = f"{system_prompt}\n\nUSER QUESTION: \"{human_message.content}\""
        
        # Stream the response and accumulate for state
        full_response = ""
        for chunk in llm.stream([HumanMessage(content=full_prompt)]):
            if hasattr(chunk, 'content') and chunk.content:
                full_response += chunk.content
                yield chunk.content
        
        # Add complete AI response to messages for context
        state["messages"] = state["messages"] + [AIMessage(content=full_response)]
        
    except Exception as e:
        print(f"Chat error: {e}")
        yield "I'm experiencing technical difficulties. Please try again."

# Create the graph
def create_chat_graph():
    """Create LangGraph workflow"""
    workflow = StateGraph(ChatState)
    
    # Add nodes
    workflow.add_node("load_context", load_employee_context)
    workflow.add_node("chat", chat_node)
    
    # Add edges
    workflow.set_entry_point("load_context")
    workflow.add_edge("load_context", "chat")
    workflow.add_edge("chat", END)
    
    return workflow.compile()

# Initialize graph
chat_graph = create_chat_graph()

MAX_CHAT_HISTORY = 10

def process_chat_message(emp_id: int, message: str):
    """Main chat processing function using LangGraph with streaming"""
    try:
        # Get chat history for context
        history = chat_memory.get(emp_id, [])
        messages = []
        
        # Add recent history to context (last 4 messages)
        for msg in history[-4:]:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            else:
                messages.append(AIMessage(content=msg["content"]))
        
        # Add current message
        messages.append(HumanMessage(content=message))
        
        # Create initial state
        initial_state = {
            "messages": messages,
            "emp_id": emp_id,
            "employee_data": {}
        }
        
        # Load context first
        state = load_employee_context(initial_state)
        
        # Stream the response
        full_response = ""
        for chunk in chat_node(state):
            full_response += chunk
            yield chunk
        
        # Store in memory (keep last MAX_CHAT_HISTORY exchanges)
        if emp_id not in chat_memory:
            chat_memory[emp_id] = []
        timestamp = datetime.now().isoformat()
        chat_memory[emp_id].extend([
            {"role": "user", "content": message, "timestamp": timestamp},
            {"role": "assistant", "content": full_response, "timestamp": timestamp}
        ])
        
        # Trim history to the maximum allowed length
        if len(chat_memory[emp_id]) > MAX_CHAT_HISTORY:
            chat_memory[emp_id] = chat_memory[emp_id][-MAX_CHAT_HISTORY:]
        
    except Exception as e:
        import traceback
        print(f"Chat error: {e}")
        traceback.print_exc()
        yield "Sorry, something went wrong while processing your request. Please try again later or contact support if the issue persists."

def clear_chat_history(emp_id: int):
    """Clear chat history"""
    if emp_id in chat_memory:
        del chat_memory[emp_id]

def reset_conversation(emp_id: int) -> str:
    """Reset conversation"""
    clear_chat_history(emp_id)
    return "Conversation cleared. How can I help you today?"