#!/usr/bin/env python3
"""Student model representing learners in the system."""
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from models.base_model import Base, BaseModel

class Student(BaseModel, Base):
    """Represents students and their personal details."""

    __tablename__ = 'students'

    first_name = Column(String(100), nullable=False)
    middle_name = Column(String(100))
    last_name = Column(String(100), nullable=False)
    reg_number = Column(String(50), nullable=False, unique=True)

