from fastapi import APIRouter, Depends, HTTPException, Request
from recommendation import run_recommendation, refresh_recommendation
from models import *
from sqlalchemy.orm import Session
from db import get_db
import json
from chatbot import process_chat_message
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
    try:
        # Get projects with project details
        projects = (
            db.query(EmployeeProject, Project)
            .join(Project, EmployeeProject.project_id == Project.project_id)
            .filter(EmployeeProject.emp_id == emp_id)
            .all()
        )
        
        project_data = []
        for emp_project, project in projects:
            project_data.append({
                "emp_id": emp_project.emp_id,
                "project_id": emp_project.project_id,
                "project_name": project.project_name,
                "client": project.client,
                "project_role": emp_project.role,
                "duration": float(project.duration) if project.duration else 0,
                "date": project.start_date.isoformat() if project.start_date else None,
                "tech_stack": project.skills if project.skills else {},
                "skills_used": emp_project.skills if emp_project.skills else {},
                "status": project.status
            })
        
        return {"data": project_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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

@router.get("/ongoing_courses/{emp_id}")
def get_ongoing_courses(emp_id: int, db: Session = Depends(get_db)):
    # Join OngoingCourse with Course to get all required fields
    ongoing_courses = (
        db.query(OngoingCourse, Course)
        .join(Course, OngoingCourse.course_id == Course.course_id)
        .filter(OngoingCourse.emp_id == emp_id)
        .all()
    )
    if not ongoing_courses:
        raise HTTPException(status_code=404, detail="No ongoing courses found for this employee")
    
    formatted_courses = []
    for ongoing, course in ongoing_courses:
        formatted_courses.append({
            "title": ongoing.course_name,
            "progress": ongoing.current_progress,
            "description": "",  # Let frontend handle formatting
            "courseId": ongoing.course_id,
            "level": course.level,
            "format": course.format,
            "duration": float(course.duration) if course.duration else 0,
            "category": course.category,
            "startDate": ongoing.start_date.isoformat() if ongoing.start_date else None,
            "skills": course.skills,
        })
    return {"data": formatted_courses}

@router.get("/team/{manager_id}")
def get_team_members(manager_id: int, db: Session = Depends(get_db)):
    try:
        # Query employees where manager_ids JSON array contains the given manager_id
        team_members = db.query(Employee).filter(
            Employee.manager_ids.contains([manager_id])
        ).all()
        
        if not team_members:
            return {"data": [], "message": "No team members found"}
        
        # Format team member data
        formatted_members = []
        for member in team_members:
            formatted_members.append({
                "emp_id": member.emp_id,
                "name": member.name,
                "role": member.role,
                "dept": member.dept,
                "join_date": member.join_date.isoformat() if member.join_date else None,
                "experience": member.experience,
                "career_goal": member.career_goal,
                "last_promotion_date": member.last_promotion_date.isoformat() if member.last_promotion_date else None
            })
        
        return {"data": formatted_members}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/team-analytics/{manager_id}")
def get_team_analytics(manager_id: int, db: Session = Depends(get_db)):
    try:
        # Get team members
        team_members = db.query(Employee).filter(
            Employee.manager_ids.contains([manager_id])
        ).all()
        
        if not team_members:
            return {"data": {}, "message": "No team members found"}
        
        team_emp_ids = [member.emp_id for member in team_members]
        
        # Get aggregate KPI data
        team_kpis = db.query(KPI).filter(KPI.emp_id.in_(team_emp_ids)).all()
        
        # Get aggregate course completion data
        team_completions = (
            db.query(CourseCompletion, Course)
            .join(Course, CourseCompletion.course_id == Course.course_id)
            .filter(CourseCompletion.emp_id.in_(team_emp_ids))
            .all()
        )
        
        # Get aggregate project data
        team_projects = (
            db.query(EmployeeProject, Project)
            .join(Project, EmployeeProject.project_id == Project.project_id)
            .filter(EmployeeProject.emp_id.in_(team_emp_ids))
            .all()
        )
        
        # Calculate analytics
        analytics = {
            "team_size": len(team_members),
            "avg_kpi": sum(kpi.kpi_score for kpi in team_kpis) / len(team_kpis) if team_kpis else 0,
            "total_courses_completed": len(team_completions),
            "active_projects": len([p for emp_proj, proj in team_projects if proj.status == "active"]),
            "skill_distribution": {},
            "performance_distribution": {
                "excellent": 0,
                "good": 0,
                "needs_improvement": 0
            }
        }
        
        # Calculate skill distribution
        for member in team_members:
            if member.skills:
                for skill, level in member.skills.items():
                    if skill not in analytics["skill_distribution"]:
                        analytics["skill_distribution"][skill] = []
                    analytics["skill_distribution"][skill].append(level)
        
        # Calculate performance distribution
        member_kpi_avg = {}
        for kpi in team_kpis:
            if kpi.emp_id not in member_kpi_avg:
                member_kpi_avg[kpi.emp_id] = []
            member_kpi_avg[kpi.emp_id].append(kpi.kpi_score)
        
        for emp_id, scores in member_kpi_avg.items():
            avg_score = sum(scores) / len(scores)
            if avg_score >= 4.0:
                analytics["performance_distribution"]["excellent"] += 1
            elif avg_score >= 3.0:
                analytics["performance_distribution"]["good"] += 1
            else:
                analytics["performance_distribution"]["needs_improvement"] += 1
        
        return {"data": analytics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/bulk-employee-data")
def get_bulk_employee_data(emp_ids: str, db: Session = Depends(get_db)):
    try:
        # Parse comma-separated emp_ids
        emp_id_list = [int(id.strip()) for id in emp_ids.split(',') if id.strip()]
        
        if not emp_id_list:
            return {"data": {}}
        
        # Get all employee data
        employees = db.query(Employee).filter(Employee.emp_id.in_(emp_id_list)).all()
        
        # Get all KPI data
        kpis = db.query(KPI).filter(KPI.emp_id.in_(emp_id_list)).all()
        
        # Get all course completion data
        completions = (
            db.query(CourseCompletion, Course)
            .join(Course, CourseCompletion.course_id == Course.course_id)
            .filter(CourseCompletion.emp_id.in_(emp_id_list))
            .all()
        )
        
        # Get all project data
        projects = (
            db.query(EmployeeProject, Project)
            .join(Project, EmployeeProject.project_id == Project.project_id)
            .filter(EmployeeProject.emp_id.in_(emp_id_list))
            .all()
        )
        
        # Get ongoing courses
        ongoing = (
            db.query(OngoingCourse, Course)
            .join(Course, OngoingCourse.course_id == Course.course_id)
            .filter(OngoingCourse.emp_id.in_(emp_id_list))
            .all()
        )
        
        # Get recommendation data - THIS IS THE MISSING PART
        recommendations = db.query(Recommendation).filter(Recommendation.emp_id.in_(emp_id_list)).all()
        
        # Organize data by employee
        employee_data = {}
        
        for emp in employees:
            employee_data[emp.emp_id] = {
                "employee": {
                    "emp_id": emp.emp_id,
                    "name": emp.name,
                    "role": emp.role,
                    "dept": emp.dept,
                    "skills": emp.skills if emp.skills else {},
                    "learning_preferences": emp.learning_preferences,
                    "interests": emp.interests,
                    "career_goal": emp.career_goal,
                    "join_date": emp.join_date.isoformat() if emp.join_date else None,
                    "last_promotion_date": emp.last_promotion_date.isoformat() if emp.last_promotion_date else None,
                    "experience": emp.experience,
                    "languages": emp.languages
                },
                "kpi": [],
                "courses": [],
                "projects": [],
                "ongoing_courses": [],
                "recommendations": None  # Add recommendations field
            }
        
        # Add KPI data
        for kpi in kpis:
            if kpi.emp_id in employee_data:
                employee_data[kpi.emp_id]["kpi"].append({
                    "emp_id": kpi.emp_id,
                    "month": kpi.month.isoformat() if kpi.month else None,
                    "kpi_metric": kpi.kpi_metric,
                    "kpi_score": float(kpi.kpi_score) if kpi.kpi_score else 0,
                    "review": kpi.review
                })
        
        # Add course completion data
        for completion, course in completions:
            if completion.emp_id in employee_data:
                employee_data[completion.emp_id]["courses"].append({
                    "emp_id": completion.emp_id,
                    "course_id": completion.course_id,
                    "course_name": course.name,
                    "start_date": completion.start_date.isoformat() if completion.start_date else None,
                    "end_date": completion.end_date.isoformat() if completion.end_date else None,
                    "duration": float(completion.duration) if completion.duration else 0,
                    "expected_duration": float(completion.expected_duration) if completion.expected_duration else 0,
                    "score": float(completion.score) if completion.score else 0,
                    "category": course.category,
                    "desc": course.desc,
                    "skills": course.skills if course.skills else {}
                })
        
        # Add project data
        for emp_project, project in projects:
            if emp_project.emp_id in employee_data:
                employee_data[emp_project.emp_id]["projects"].append({
                    "emp_id": emp_project.emp_id,
                    "project_id": emp_project.project_id,
                    "project_name": project.project_name,
                    "client": project.client,
                    "project_role": emp_project.role,
                    "duration": float(project.duration) if project.duration else 0,
                    "date": project.start_date.isoformat() if project.start_date else None,
                    "tech_stack": project.skills if project.skills else {},
                    "skills_used": emp_project.skills if emp_project.skills else {},
                    "status": project.status
                })
        
        # Add ongoing courses
        for ongoing_course, course in ongoing:
            if ongoing_course.emp_id in employee_data:
                employee_data[ongoing_course.emp_id]["ongoing_courses"].append({
                    "emp_id": ongoing_course.emp_id,
                    "course_id": ongoing_course.course_id,
                    "course_name": ongoing_course.course_name,
                    "start_date": ongoing_course.start_date.isoformat() if ongoing_course.start_date else None,
                    "current_progress": ongoing_course.current_progress,
                    "course_category": course.category,
                    "course_description": course.desc,
                    "course_skills": course.skills,
                    "course_format": course.format,
                    "course_level": course.level,
                    "course_duration": float(course.duration) if course.duration else 0
                })
        
        # Add recommendation data
        for rec in recommendations:
            if rec.emp_id in employee_data:
                # Get the most recent recommendation for each goal type
                if employee_data[rec.emp_id]["recommendations"] is None:
                    employee_data[rec.emp_id]["recommendations"] = {}
                
                employee_data[rec.emp_id]["recommendations"][rec.goal] = {
                    "goal": rec.goal,
                    "output": rec.output,
                    "analysis": rec.analysis,
                    "valid": rec.valid,
                    "validation_summary": rec.validation_summary,
                    "last_updated_time": rec.last_updated_time.isoformat() if rec.last_updated_time else None
                }
        
        return {"data": employee_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/projects/manager/{emp_id}")
def get_manager_projects(emp_id: int, db: Session = Depends(get_db)):
    """
    Get all projects where the given employee is a manager (by manager_ids JSON field).
    """
    projects = db.query(Project).filter(Project.manager_ids.contains([emp_id])).all()
    if not projects:
        return {"data": [], "message": "No managed projects found"}
    result = []
    for project in projects:
        result.append({
            "project_id": project.project_id,
            "project_name": project.project_name,
            "start_date": project.start_date.isoformat() if project.start_date else None,
            "status": project.status,
            "manager_ids": project.manager_ids,
        })
    return {"data": result}

@router.get("/projects/{project_id}/assignments")
def get_project_assignments(project_id: int, db: Session = Depends(get_db)):
    """
    Get all team members assigned to a specific project.
    """
    assignments = (
        db.query(EmployeeProject, Employee)
        .join(Employee, EmployeeProject.emp_id == Employee.emp_id)
        .filter(EmployeeProject.project_id == project_id)
        .all()
    )
    if not assignments:
        return {"data": [], "message": "No assignments found"}
    result = []
    for emp_proj, emp in assignments:
        result.append({
            "emp_id": emp.emp_id,
            "name": emp.name,
            "role": emp.role,
            "assignment_role": emp_proj.role,
            "assignment_date": getattr(emp_proj, "start_date", None),
            "skills": emp.skills,
        })
    return {"data": result}

@router.get("/projects/{project_id}/skills")
def get_project_skill_requirements(project_id: int, db: Session = Depends(get_db)):
    """
    Get skill requirements for a specific project (from the project.skills field).
    """
    project = db.query(Project).filter(Project.project_id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"data": project.skills or []}

