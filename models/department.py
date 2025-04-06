#!/usr/bin/env python3
"""Department model implementation using SQLAlchemy."""
from sqlalchemy import Column, String, ForeignKey
from models.base_model import Base, BaseModel

class Department(BaseModel, Base):
    """Departments offering a course."""
    __tablename__ = 'departments'

    name = Column(String(225), nullable=False)
    course_id = Column(String(60), ForeignKey("courses.id"))
