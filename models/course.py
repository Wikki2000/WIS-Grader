#!/usr/bin/env python3
"""Course model implementation using SQLAlchemy."""
from sqlalchemy import Column, String, Integer, ForeignKey
from models.enrollment import Enrollment
from sqlalchemy.orm import relationship
from models.base_model import Base, BaseModel
from models.student import Student
from models.result import Result


class Course(BaseModel, Base):
    """Course class represents a course in the grading system."""

    __tablename__ = 'courses'

    course_title = Column(String(100), nullable=False)
    course_code = Column(String(20), nullable=False, unique=True)
    credit_load = Column(Integer, nullable=False)
    semester = Column(String(20), nullable=False)
    lecturer_id = Column(String(60), ForeignKey('lecturers.id'))

    students = relationship("Student", secondary="enrollments",
                            backref="course")
