#!/usr/bin/env python3

"""Lecturer model representing faculty members."""

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from models.base_model import Base, BaseModel
import bcrypt


class Lecturer(BaseModel, Base):
    """Lecturer class represents a lecturer in the grading system."""

    __tablename__ = 'lecturers'

    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    password = Column(String(100), nullable=False)

    school = relationship('School', backref='lecturer', uselist=False, cascade='all, delete-orphan')
    courses = relationship('Course', backref='lecturer', cascade='all, delete-orphan')

    def hash_password(self, password: str) -> None:
        """Hash the password and store it."""

        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        self.password = hashed.decode('utf-8')

    def check_password(self, password: str) -> bool:
        """Check if the provided password matches the stored hash."""

        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))
