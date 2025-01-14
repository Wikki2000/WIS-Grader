#!/usr/bin/python3
"""Association table b/w students and courses."""
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from models.base_model import Base, BaseModel


class Enrollment(Base, BaseModel):
    """Models enrollment class."""
    __tablename__ = "enrollments"
    student_id = Column(
        String(60), ForeignKey("students.id"),
        primary_key=True, nullable=False
    )
    course_id = Column(
        String(60), ForeignKey("courses.id"),
        primary_key=True, nullable=False
    )
