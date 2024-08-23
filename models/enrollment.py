#!/usr/bin/env python3
"""Enrollment model implementation using SQLAlchemy."""

from sqlalchemy import Column, Integer, ForeignKey, PrimaryKeyConstraint
from sqlalchemy.orm import relationship
from models.base_model import Base


class Enrollment(Base):
    """Enrollment class represents the association between a student and a course."""

    __tablename__ = 'enrollments'

    student_id = Column(String, ForeignKey('students.id', ondelete='CASCADE'), primary_key=True)
    course_id = Column(String, ForeignKey('courses.id', ondelete='CASCADE'), primary_key=True)

    __table_args__ = (
        PrimaryKeyConstraint('student_id', 'course_id', name='pk_enrollments'),
    )
