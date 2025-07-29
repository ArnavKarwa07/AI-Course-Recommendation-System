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

    role_id             = Column(Integer, primary_key=True, index=True)
    role                = Column(String(100))
    dept                = Column(String(100))
    job_level           = Column(String(50))
    skills_required     = Column(JSON)           # {"Python": 4}
    avg_promotion_time  = Column(Integer)        # months

    employees = relationship("Employee", back_populates="role_details")


class Course(Base):
    __tablename__ = "m_courses"

    course_id           = Column(Integer, primary_key=True, index=True)
    name                = Column(String(100))
    category            = Column(String(100))
    desc                = Column(String(255))
    skills              = Column(JSON)           # {"ML": 3}
    format              = Column(String(50))
    level               = Column(String(50))
    prerequisite_skills = Column(JSON)
    duration            = Column(Float)          # months

    completions = relationship("CourseCompletion", back_populates="course")


class Employee(Base):
    __tablename__ = "m_emp"

    emp_id               = Column(Integer, primary_key=True, index=True)
    name                 = Column(String(100))
    role_id              = Column(Integer, ForeignKey("m_roles.role_id"))
    role                 = Column(String(100))
    dept                 = Column(String(100))
    skills               = Column(JSON)          # {"Python": 4}
    learning_preferences = Column(String(100))
    interests            = Column(String(100))
    career_goal          = Column(String(100))
    join_date            = Column(Date)
    last_promotion_date  = Column(Date)
    experience           = Column(Integer)       # months
    languages            = Column(String(100))
    manager_ids          = Column(JSON, nullable=True)  

    role_details = relationship("Role", back_populates="employees")
    kpis         = relationship("KPI", back_populates="employee")
    projects     = relationship("Project", back_populates="employee")
    completions  = relationship("CourseCompletion", back_populates="employee")
    recommendations = relationship("Recommendation", back_populates="employee")
    # chat_history = relationship("ChatHistory", back_populates="employee")


class KPI(Base):
    __tablename__ = "t_emp_kpi"
    
    # Use composite primary key since there's no id column
    emp_id = Column(Integer, ForeignKey("m_emp.emp_id"), primary_key=True)
    month = Column(String(20))
    kpi_metric = Column(String(100), primary_key=True)
    kpi_score = Column(Float)
    review = Column(Text)

    employee = relationship("Employee", back_populates="kpis")


class Project(Base):
    __tablename__ = "t_emp_projects"

    project_id   = Column(Integer, primary_key=True, index=True)
    project_name = Column(String(100))
    emp_id       = Column(Integer, ForeignKey("m_emp.emp_id"))
    project_role = Column(String(100))
    duration     = Column(Float)                 # months
    date         = Column(Date)
    tech_stack   = Column(String(100))
    skills_used  = Column(JSON)

    employee = relationship("Employee", back_populates="projects")


class CourseCompletion(Base):
    __tablename__ = "t_course_completion"
    __table_args__ = {'extend_existing': True}

    # Create a composite primary key that should work with most schemas
    emp_id             = Column(Integer, ForeignKey("m_emp.emp_id"), primary_key=True)
    course_id          = Column(Integer, ForeignKey("m_courses.course_id"), primary_key=True) 
    start_date         = Column(Date)
    end_date           = Column(Date)
    duration           = Column(Float)           # months (actual)
    expected_duration  = Column(Float)           # months
    score              = Column(Float)

    employee = relationship("Employee", back_populates="completions")
    course   = relationship("Course", back_populates="completions")

class Recommendation(Base):
    __tablename__ = "t_recommendation"

    recommendation_id  = Column(Integer, primary_key=True, index=True)
    emp_id             = Column(Integer, ForeignKey("m_emp.emp_id"))
    goal               = Column(String(255))
    output             = Column(JSON)
    analysis           = Column(JSON)
    valid              = Column(Boolean)
    validation_summary = Column(JSON)
    last_updated_time  = Column(DateTime)

    employee = relationship("Employee", back_populates="recommendations")

class OngoingCourse(Base):
    __tablename__ = "t_ongoing_courses"
    
    emp_id = Column(Integer, primary_key=True)
    course_id = Column(Integer, primary_key=True)
    course_name = Column(String(100))
    start_date = Column(Date)
    current_progress = Column(Integer)