#!/usr/bin/env python3
"""Student model representing learners in the system."""
from sqlalchemy import Column, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from models.base_model import Base, BaseModel

class Student(BaseModel, Base):
    """Represents students and their personal details."""

    __tablename__ = 'students'

    first_name = Column(String(100), nullable=False)
    middle_name = Column(String(100))
    last_name = Column(String(100), nullable=False)
    reg_number = Column(String(50), nullable=False)
    department = Column(String(100), nullable=False)
    level = Column(String(100), nullable=False)
    lecturer_id = Column(
        String(100), ForeignKey("lecturers.id"), nullable=False
    )

    results = relationship('Result', backref='student',
                            cascade='all, delete-orphan')

    # Enforce uniqueness of reg_number per lecturer (composite)
    __table_args__ = (
        # Create a tuple of lecturer per student reg_number
        UniqueConstraint(
            "reg_number", "lecturer_id", name="lecturer_per_student"
        ),
    )
