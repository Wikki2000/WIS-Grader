#!/usr/bin/env python3

"""School model representing educational institutions."""

from sqlalchemy import Column, Integer, String, ForeignKey, LargeBinary
from sqlalchemy.orm import relationship
from models.base_model import Base, BaseModel


class School(BaseModel, Base):
    """Represents educational institutions and their details."""

    __tablename__ = 'schools'

    school_name = Column(String(100), nullable=False)
    logo = Column(LargeBinary)
    dean_name = Column(String(100))
    lecturer_id = Column(
            String(60),
            ForeignKey('lecturers.id', ondelete='CASCADE')
    )
