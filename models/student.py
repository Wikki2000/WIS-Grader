#!/usr/bin/env python3

"""Student model representing learners in the system."""

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from models.base_model import Base, BaseModel


class Student(BaseModel, Base):
    """Represents students and their personal details."""

    __tablename__ = 'students'

    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(100), nullable=False)
    middle_name = Column(String(100))
    last_name = Column(String(100), nullable=False)
    reg_number = Column(String(50), nullable=False, unique=True)

    enrollments = relationship(
                                'Enrollment',
                                back_populates='student',
                                cascade='all, delete-orphan'
                            )
    grades = relationship(
                                'Grade',
                                back_populates='student',
                                cascade='all, delete-orphan'
                            )
