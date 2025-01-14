#!/usr/bin/python3
"""This module models the storage of user details."""
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import declarative_base
from uuid import uuid4
import base64

Base = declarative_base()

class BaseModel:
    """Define the class models for related method and attribute."""
    id = Column(String(60), primary_key=True, default=lambda: str(uuid4()))
    created_at = Column(DateTime(6), default=datetime.utcnow)
    updated_at = Column(DateTime(6), default=datetime.utcnow)

    def __str__(self):
        """String representation of objrct."""
        return f"[{self.__class__.__name__}] ({self.id}) {self.__dict__}"

    def to_dict(self):
        """Return the dict representation of a class instance."""
        new_dict = self.__dict__.copy()

        # Remove SQLAlchemy internal state
        if "_sa_instance_state" in new_dict:
            del new_dict["_sa_instance_state"]

        # Serialize the class name
        new_dict["__class__"] = self.__class__.__name__

        # Handle datetime fields
        for field in ['created_at', 'updated_at']:
            if isinstance(new_dict.get(field), datetime):
                new_dict[field] = new_dict[field].isoformat()

        # Serialize related objects
        for key, value in new_dict.items():
            if hasattr(value, 'to_dict'):
                new_dict[key] = value.to_dict()
            elif isinstance(value, (bytes, bytearray)):
                new_dict[key] = base64.b64encode(value).decode('utf-8')
            elif isinstance(value, list):
                new_dict[key] = [
                    item.to_dict() if hasattr(item, 'to_dict')
                    else item for item in value
                ]
        return new_dict
