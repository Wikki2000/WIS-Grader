#!/usr/bin/python3
"""This module models the storage of the authentication API"""
from sqlalchemy import create_engine, func, or_, update, cast, Date, and_
from sqlalchemy.orm import sessionmaker, scoped_session

from models.user import User
from models.base_model import Base

from dotenv import load_dotenv
from os import getenv
from typing import Type, Any, List

load_dotenv()


class Storage:
    """ Defines storage model using SQLAlchemy. """
    __session = None
    __engine = None

    def __init__(self):
        """ Create session engine to interact with database. """
        username = getenv('WIS_USER')
        password = getenv('WIS_PASSWORD')
        database = getenv('WIS_DATABASE')

        if not username or not password:
            error = "Environment variables must be set for database URL"
            raise ValueError(error)

        url = f'mysql+mysqldb://{username}:{password}@localhost:5432/{database}'
        self.__engine = create_engine(url, pool_pre_ping=True)
        Base.metadata.create_all(self.__engine)
        session_factory = sessionmaker(bind=self.__engine)
        self.__session = scoped_session(session_factory)
        """
        if not self.__session:
            session_factory = sessionmaker(bind=self.__engine)
            self.__session = scoped_session(session_factory)
        """

    def refresh(self, obj: object) -> object:
        """Refresh to get current state
        """
        return self.__session.refresh(obj)

    def all(self, cls=None):
        """Retrieve data from database."""
        new_dict = {}

        rows = self.__session.query(cls).all()
        for row in rows:
            key = f"{row.__class__.__name__}.{row.id}"
            new_dict.update({key: row})
        return new_dict

    def new(self, obj):
        """ Add user object to session.new """
        self.__session.add(obj)

    def add_many(self, obj_list):
        """Add multiples object."""
        self.__session.add_all(obj_list)

    def rollback(self):
        """ Rollback a session on error. """
        self.__session.rollback()

    def get_by(self, cls, **kwargs):
        """Retrieve an instance with an arbituary fields/values.

        Args:
            cls (class) - The class to filter for an object.
            kwargs (dict) - Dict of fields and value to filter for object.

        Return: The object filter from database
        """
        obj = self.__session.query(cls).filter_by(**kwargs).first()
        return obj

    def all_get_by(self, cls, **kwargs):
        """Retrieve an instance with an arbituary fields/values.

        Args:
            cls (class) - The class to filter for an object.
            kwargs (dict) - Dict of fields and value to filter for object.

        Return: The object filter from database
        """
        obj = self.__session.query(cls).filter_by(**kwargs).all()
        return obj

    def count_by(self, cls, **kwargs):
        """Count an instance with an arbituary fields/values.
        Args:
            cls (class) - The class to filter for an object.
            wargs (dict) - Dict of fields and value to count

        Return: The total count of object in class
        """
        total_count = self.__session.query(
                func.count(cls.id)
                ).filter_by(**kwargs).scalar()
        return total_count

    def get_by_date(self, cls, start_date, end_date, date_field):
        """
        Retrieve records from the database filtered by a specified date field.

        Args:
            cls: The model class to query.
            start_date: The start date for filtering.
            end_date: The end date for filtering.
            date_field: The name of the date field to filter by.

        Returns:
            List of filtered records.
        """
        try:
            # Get the column dynamically from the model class
            date_column = getattr(cls, date_field)
            obj = self.__session.query(cls).filter(
                and_(
                    cast(date_column, Date) >= start_date,
                    cast(date_column, Date) <= end_date
                    )
                ).all()
            return obj

        except AttributeError:
            cls = cls.__name__
            print(f"Error: '{date_field}' is not a valid field for {cls}.")
            return []

        except Exception as e:
            print(f"Database query failed: {e}")
            return []

    def save(self):
        """ Commit change to database """
        self.__session.commit()

    def delete(self, obj):
        """ Delete an instance of a class. """
        self.__session.delete(obj)

    def close(self):
        """ Close database session. """
        self.__session.close()

    def get_by_double_field(
            self, model: Type, attr_val1: List, attr_val2: List
            ) -> List:
        """
        Filter a model using two field.

        :attr_val1 - List of attribute and value of 1st field.
        :attr_val2 - List of attribute and value of 2nd field.

        :rtype - List of the search result.
        """
        sender_id = getattr(model, attr_val1[0])
        receiver_id = getattr(model, attr_val2[0])
        result = (
                self.__session.query(model)
                .filter(
                    or_(
                        (sender_id == attr_val1[1]) & (receiver_id == attr_val2[1]),
                        (receiver_id == attr_val1[1]) & (sender_id == attr_val2[1])
                        )
                    )
                .all()
                )
        return result
