#ssuss$/bin/env python3
"""Course model implementation using SQLAlchemy."""
from sqlalchemy import (
    Column, String, Integer, Boolean, Date, ForeignKey, UniqueConstraint
)
from models.enrollment import Enrollment
from sqlalchemy.orm import relationship
from models.base_model import Base, BaseModel
from models.student import Student
from models.result import Result


class Course(BaseModel, Base):
    """Course class represents a course in the grading system."""

    __tablename__ = "courses"
    name = Column(String(225), nullable=False)
    code = Column(String(20), nullable=False, unique=True)
    load = Column(Integer, nullable=False)
    semester = Column(String(20))
    description = Column(String(500))
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    level = Column(String(225), nullable=False)
    user_id = Column(String(60), ForeignKey('users.id'))
    #course_link = Column(String(60))

    students = relationship("Student", secondary="enrollments",
                            backref="courses")

    # Enforce uniqueness of course code per lecturer (composite)
    __table_args__ = (
        UniqueConstraint(
            "user_id", "code", name="unique_user_course_code"
        ),
    )
