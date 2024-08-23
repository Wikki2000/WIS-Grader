#!/usr/bin/python3
"""<base_module>: Models the base class of the App."""
from sqlalchemy.orm import declarative_base
from sqlalchemy import String, Column
from uuid import uuid4


Base = declarative_base()

class BaseModel:
    """Define the Base class of the app."""
    id = Column(String(30), nullable=False, unique=True,
            primary_key=True, default=lambda: str(uuid4()))

    def __str__(self):
        """Define the string reps. of an object."""
        return f"[{self.__class__.__name__}] ({self.id}) {self.__dict__}"
