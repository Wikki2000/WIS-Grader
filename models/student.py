#!/usr/bin/env python3
"""Student model implementation using SQLAlchemy."""

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from models.base_model import Base, BaseModel


class Student(BaseModel, Base):
    """Student class represents a student in the grading system."""

    __tablename__ = 'students'

    first_name = Column(String(100), nullable=False)
    middle_name = Column(String(100))
    last_name = Column(String(100), nullable=False)
    reg_number = Column(String(50), nullable=False, unique=True)

    enrollments = relationship('Enrollment', backref='student', cascade='all, delete-orphan')
    grades = relationship('Grade', backref='student', cascade='all, delete-orphan')

