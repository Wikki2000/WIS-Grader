#!/usr/bin/env python3
"""School model implementation using SQLAlchemy."""

from sqlalchemy import Column, Integer, String, ForeignKey, LargeBinary
from sqlalchemy.orm import relationship
from models.base_model import Base, BaseModel


class School(BaseModel, Base):
    """School class represents a school in the grading system."""

    __tablename__ = 'schools'

    school_name = Column(String(100), nullable=False)
    logo = Column(LargeBinary)
    dean_name = Column(String(100), nullable=False)
    lecturer_id = Column(String, ForeignKey('lecturers.id'))

