from pydantic import BaseModel
from typing import Literal
from sqlalchemy import Column, Integer, String, Float, Date, JSON, ForeignKey, Text, Boolean, DateTime
from sqlalchemy.orm import relationship, declarative_base
from db import Base
from datetime import datetime

Base = declarative_base()

class RecommendationRequest(BaseModel):
    emp_id: int
    goal: Literal["roadmap", "courses"]


# ---------- Tables ----------
class Role(Base):
    __tablename__ = "m_roles"

    role_id = Column(Integer, primary_key=True, index=True)
    role = Column(String(100))
    dept = Column(String(100))
    job_level = Column(String(50))
    skills_required = Column(JSON)
    avg_promotion_time = Column(Integer)

    employees = relationship("Employee", back_populates="role_details")


class Course(Base):
    __tablename__ = "m_courses"

    course_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    category = Column(String(100))
    desc = Column(Text)
    skills = Column(JSON)
    format = Column(String(50))
    level = Column(String(50))
    prerequisite_skills = Column(JSON)
    duration = Column(Float)

    completions = relationship("CourseCompletion", back_populates="course")
    ongoing = relationship("OngoingCourse", back_populates="course")


class Employee(Base):
    __tablename__ = "m_emp"

    emp_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    role_id = Column(Integer, ForeignKey("m_roles.role_id"))
    role = Column(String(100))
    dept = Column(String(100))
    skills = Column(JSON)
    learning_preferences = Column(String(100))
    interests = Column(String(100))
    career_goal = Column(String(100))
    join_date = Column(Date)
    last_promotion_date = Column(Date)
    experience = Column(Integer)  # months
    languages = Column(String(100))
    manager_ids = Column(JSON, nullable=True)

    role_details = relationship("Role", back_populates="employees")
    kpis = relationship("KPI", back_populates="employee")
    projects = relationship("EmployeeProject", back_populates="employee")
    completions = relationship("CourseCompletion", back_populates="employee")
    ongoing_courses = relationship("OngoingCourse", back_populates="employee")
    recommendations = relationship("Recommendation", back_populates="employee")


class KPI(Base):
    __tablename__ = "t_emp_kpi"
    
    emp_id = Column(Integer, ForeignKey("m_emp.emp_id"), primary_key=True)
    month = Column(Date, primary_key=True)
    kpi_metric = Column(String(100))
    kpi_score = Column(Float)
    review = Column(Text)

    employee = relationship("Employee", back_populates="kpis")


class CourseCompletion(Base):
    __tablename__ = "t_course_completion"

    emp_id = Column(Integer, ForeignKey("m_emp.emp_id"), primary_key=True)
    course_id = Column(Integer, ForeignKey("m_courses.course_id"), primary_key=True)
    start_date = Column(Date)
    end_date = Column(Date)
    duration = Column(Float)
    expected_duration = Column(Float)
    score = Column(Float)

    employee = relationship("Employee", back_populates="completions")
    course = relationship("Course", back_populates="completions")


class OngoingCourse(Base):
    __tablename__ = "t_ongoing_courses"

    emp_id = Column(Integer, ForeignKey("m_emp.emp_id"), primary_key=True)
    course_id = Column(Integer, ForeignKey("m_courses.course_id"), primary_key=True)
    course_name = Column(String(100))
    start_date = Column(Date)
    current_progress = Column(Integer)

    employee = relationship("Employee", back_populates="ongoing_courses")
    course = relationship("Course", back_populates="ongoing")


class Project(Base):
    __tablename__ = "m_projects"

    project_id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String(100))
    client = Column(String(100))
    duration = Column(Float)
    start_date = Column(Date)
    skills = Column(JSON)
    status = Column(String(50))
    manager_ids = Column(JSON)

    employee_projects = relationship("EmployeeProject", back_populates="project")


class EmployeeProject(Base):
    __tablename__ = "t_emp_projects"

    tep_id = Column(Integer, primary_key=True, index=True)
    emp_id = Column(Integer, ForeignKey("m_emp.emp_id"))
    project_id = Column(Integer, ForeignKey("m_projects.project_id"))
    role = Column(String(100))
    skills = Column(JSON)

    employee = relationship("Employee", back_populates="projects")
    project = relationship("Project", back_populates="employee_projects")


class Recommendation(Base):
    __tablename__ = "t_recommendation"

    recommendation_id = Column(Integer, primary_key=True, index=True)
    emp_id = Column(Integer, ForeignKey("m_emp.emp_id"))
    goal = Column(String(255))
    output = Column(JSON)
    analysis = Column(JSON)
    valid = Column(Boolean)
    validation_summary = Column(JSON)
    last_updated_time = Column(DateTime)

    employee = relationship("Employee", back_populates="recommendations")