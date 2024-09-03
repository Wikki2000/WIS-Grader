#!/usr/bin/env python3
"""Grade model implementation using SQLAlchemy."""

from sqlalchemy import Column, Integer, String, ForeignKey
from models.base_model import Base, BaseModel

class Result(BaseModel, Base):
    """Grade class represents a grade for a student in a course."""

    __tablename__ = 'results'

    test_score = Column(Integer)
    exam_score = Column(Integer)
    total_score = Column(Integer)
    grade = Column(String(10))
    remark = Column(Integer)
    course_id = Column(String(60), ForeignKey('courses.id', ondelete='CASCADE'), nullable=False)
    student_id = Column(String(60), ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
