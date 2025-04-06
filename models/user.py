#!/usr/bin/env python3
"""Lecturer model representing our end user."""
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from models.base_model import Base, BaseModel
from models.course import Course, Student
from models.school import School
import bcrypt


class User(BaseModel, Base):
    """User class."""

    __tablename__ = "users"

    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    password = Column(String(100), nullable=False)

    courses = relationship("Course", backref="lecturer",
                            cascade="all, delete-orphan")
    """
    schools = relationship("School", backref="lecturer",
                           cascade="all, delete-orphan")
    students = relationship("Student", backref="lecturer",
                            cascade="all, delete-orphan")
    """

    def hash_password(self) -> None:
        """Hash the password and store it."""
        hashed = bcrypt.hashpw(self.password.encode('utf-8'), bcrypt.gensalt())
        self.password = hashed.decode('utf-8')

    def check_password(self, password: str) -> bool:
        """Check if the provided password matches the stored hash."""
        return bcrypt.checkpw(password.encode('utf-8'),
                              self.password.encode('utf-8'))
