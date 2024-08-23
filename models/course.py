#!/usr/bin/env python3

"""Course model representing academic courses."""

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from models.base_model import Base, BaseModel


class Course(BaseModel, Base):
    """Represents academic courses and their details."""

    __tablename__ = 'courses'

    id = Column(Integer, primary_key=True, autoincrement=True)
    course_title = Column(String(100), nullable=False)
    course_code = Column(String(20), nullable=False, unique=True)
    credit_load = Column(Integer, nullable=False)
    semester = Column(String(20), nullable=False)
    lecturer_id = Column(
                            Integer,
                            ForeignKey(
                                        'lecturers.id',
                                        ondelete='SET NULL'
                                    )
                        )
    lecturer = relationship('Lecturer', back_populates='courses')
    enrollments = relationship(
                            'Enrollment',
                            back_populates='course',
                            cascade='all, delete-orphan'
                        )
    grades = relationship(
                            'Grade',
                            back_populates='course',
                            cascade='all, delete-orphan'
                        )
