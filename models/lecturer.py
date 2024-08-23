#!/usr/bin/env python3

"""Lecturer model representing faculty members."""

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from models.base_model import Base, BaseModel


class Lecturer(BaseModel, Base):
    """Represents faculty members and their details."""

    __tablename__ = 'lecturers'

    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    password = Column(String(100), nullable=False)

    courses = relationship(
                            'Course',
                            back_populates='lecturer',
                            cascade='all, delete-orphan'
                        )
    schools = relationship(
                            'School',
                            back_populates='lecturer',
                            cascade='all, delete-orphan'
                        )
