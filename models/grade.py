#!/usr/bin/env python3

"""Grade model for student course results."""

from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from models.base_model import Base, BaseModel


class Grade(BaseModel, Base):
    """Represents grades for student courses."""

    __tablename__ = 'grades'

    id = Column(Integer, primary_key=True, autoincrement=True)
    test_score = Column(Float, nullable=False)
    exam_score = Column(Float, nullable=False)
    grade = Column(String(10), nullable=False)
    mark = Column(Float, nullable=False)
    course_id = Column(Integer, ForeignKey('courses.id', ondelete='CASCADE'))
    student_id = Column(Integer, ForeignKey('students.id', ondelete='CASCADE'))

    course = relationship('Course', back_populates='grades')
    student = relationship('Student', back_populates='grades')
