#!/usr/bin/env python3
"""Grade model implementation using SQLAlchemy."""

from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from models.base_model import Base, BaseModel


class Grade(BaseModel, Base):
    """Grade class represents a student's grades in a course."""

    __tablename__ = 'grades'

    test_score = Column(Float, nullable=False)
    exam_score = Column(Float, nullable=False)
    grade = Column(String(10), nullable=False)
    mark = Column(Float, nullable=False)
    course_id = Column(String, ForeignKey('courses.id', ondelete='CASCADE'))
    student_id = Column(String, ForeignKey('students.id', ondelete='CASCADE'))
