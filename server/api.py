from fastapi import APIRouter, Depends, HTTPException, Request
from recommendation import run_recommendation, refresh_recommendation
from models import RecommendationRequest, Employee, Course, Role, KPI, Project, CourseCompletion
from sqlalchemy.orm import Session
from db import get_db
import json
from chatbot import process_chat_message  # Add this import
from fastapi.responses import JSONResponse, StreamingResponse
from datetime import datetime

router = APIRouter()

@router.post("/recommend")
def recommend(data: RecommendationRequest):
    return run_recommendation(data.emp_id, data.goal)

@router.post("/refresh_recommendation")
def refresh(data: RecommendationRequest):
    return refresh_recommendation(data.emp_id, data.goal)

@router.get("/employee/{emp_id}")
def get_employee(emp_id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.emp_id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {
        "data": emp,
    }

@router.get("/courses")
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).all()
    if not courses:
        raise HTTPException(status_code=404, detail="No courses found")
    return {
        "data": courses,
    }

@router.get("/roles")
def get_roles(db: Session = Depends(get_db)):
    roles = db.query(Role).all()
    if not roles:
        raise HTTPException(status_code=404, detail="No roles found")
    return {
        "data": roles,
    }

@router.get("/completion/{emp_id}")
def get_course_completion(emp_id: int, db: Session = Depends(get_db)):
    completions = (
        db.query(CourseCompletion, Course)
        .join(Course, CourseCompletion.course_id == Course.course_id)
        .filter(CourseCompletion.emp_id == emp_id)
        .all()
    )
    if not completions:
        raise HTTPException(status_code=404, detail="No course completions found for this employee")
    
    # Format the data properly for JSON serialization
    formatted_data = []
    for completion, course in completions:
        formatted_data.append({
            "emp_id": completion.emp_id,
            "course_id": completion.course_id,
            "start_date": completion.start_date.isoformat() if completion.start_date else None,
            "end_date": completion.end_date.isoformat() if completion.end_date else None,
            "duration": completion.duration,
            "expected_duration": completion.expected_duration,
            "score": completion.score,
            "course_name": course.name,
            "course_category": course.category,
            "course_description": course.desc,
            "course_skills": course.skills,
            "course_format": course.format,
            "course_level": course.level,
        })
    
    return {
        "data": formatted_data,
    }

@router.get("/kpi/{emp_id}")
def get_kpi(emp_id: int, db: Session = Depends(get_db)):
    kpi = db.query(KPI).filter(KPI.emp_id == emp_id).all()
    if not kpi:
        raise HTTPException(status_code=404, detail="KPI not found for this employee")
    return {
        "data": kpi,
    }

@router.get("/projects/{emp_id}")
def get_projects(emp_id: int, db: Session = Depends(get_db)):
    projects = db.query(Project).filter(Project.emp_id == emp_id).all()
    if not projects:
        raise HTTPException(status_code=404, detail="Projects not found for this employee")
    return {
        "data": projects,
    }


@router.post('/chat')
async def chat(request: Request):
    try:
        data = await request.json()
        emp_id = data.get('emp_id')
        message = data.get('message')
        
        if not emp_id or not message:
            return JSONResponse(content={"error": "emp_id and message are required"}, status_code=400)
        
        # Return streaming response
        return StreamingResponse(
            stream_chat_response(emp_id, message),
            media_type="text/plain"
        )
        
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

def stream_chat_response(emp_id: int, message: str):
    """Generator function for streaming chat responses"""
    try:
        for chunk in process_chat_message(emp_id, message):
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\n\n"
    finally:
        yield f"data: {json.dumps({'done': True})}\n\n"

@router.get("/team/{manager_id}")
def get_team_members(manager_id: int, db: Session = Depends(get_db)):
    # Query employees where manager_id JSON array contains the given manager_id
    team_members = db.query(Employee).filter(
        Employee.manager_ids.like(f'%{manager_id}%')
    ).all()
    
    if not team_members:
        return {"data": [], "message": "No team members found"}
    return {"data": team_members}
