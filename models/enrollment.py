#!/usr/bin/env python3

"""Enrollment model for student course registrations."""

from sqlalchemy import Column, Integer, ForeignKey, PrimaryKeyConstraint
from sqlalchemy.orm import relationship
from models.base_model import Base, BaseModel


class Enrollment(Base):
    """Represents student enrollments in courses."""

    __tablename__ = 'enrollments'

    student_id = Column(
                            Integer,
                            ForeignKey(
                                        'students.id',
                                        ondelete='CASCADE'
                                    ),
                            primary_key=True
                        )
    course_id = Column(
                            Integer,
                            ForeignKey(
                                        'courses.id',
                                        ondelete='CASCADE'
                                    ),
                            primary_key=True
                        )

    student = relationship('Student', back_populates='enrollments')
    course = relationship('Course', back_populates='enrollments')

    __table_args__ = (
        PrimaryKeyConstraint(
                            'student_id',
                            'course_id',
                            name='pk_enrollments'),
    )
