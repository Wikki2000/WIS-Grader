#!/usr/bin/python3
"""Models the base class of the application."""
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, String
from uuid import uuid4

Base = declarative_base()

class BaseModel:
<<<<<<< Updated upstream
    """Defines common attributes/methods for other class.
    """
    id = Column(String(60), nullable=False, primary_key=True,
                default=lambda: str(uuid4()))
=======
    """Defines common attributes/methods for other classes."""
    __tablename__ = 'base_model'  # You should define a table name for BaseModel if it's to be used directly
    id = Column(String(60), nullable=False, primary_key=True, default=lambda: str(uuid4()))
>>>>>>> Stashed changes

    def __init__(self, *args, **kwargs):
        """Define the constructor of the class."""
        for key, value in kwargs.items():
            setattr(self, key, value)

    def __str__(self):
        """Return a string representation of the object."""
        return f"[{self.__class__.__name__}] ({self.id}) {self.__dict__}"

    def to_dict(self):
        """Return the dictionary representation of a class instance."""
        new_dict = self.__dict__.copy()
        if "_sa_instance_state" in new_dict:
            del new_dict["_sa_instance_state"]
        new_dict["__class__"] = self.__class__.__name__
        return new_dict
