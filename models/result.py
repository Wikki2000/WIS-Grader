#!/usr/bin/env python3
"""Grade model implementation using SQLAlchemy."""

from sqlalchemy import Column, Integer, String, ForeignKey
from models.base_model import Base, BaseModel

class Result(BaseModel, Base):
    """Grade class represents a grade for a student in a course."""

    __tablename__ = 'results'

    test_score = Column(Integer, nullable=False)
    exam_score = Column(Integer, nullable=False)
    grade = Column(String(10), nullable=False)
    mark = Column(Integer, nullable=False)
    course_id = Column(String(60), ForeignKey('courses.id'))
    #student_id = Column(String(60), ForeignKey('students.id'))
