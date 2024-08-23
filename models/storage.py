#!/usr/bin/python3
"""Models the storage system using sqlalchemy."""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from os import getenv
from models.base_model import Base


classes = ["Lecturer", "Student", "Result", "School", "Course"]


class Storage:
    """Models class for CRUD operation."""
    __session = None
    __engine = None

    def __init__(self):
        """Create the session to connect with db."""
        username = getenv("WIS_USER")
        password = getenv("WIS_PASSWORWD")
        database = getenv("WIS_DATABASE")

        url = f"mysql://{username}:{password}@localhost:5432/{database}"
        self.__engine = create_engine(url)
        Base.metadata.create_all(self.__engine)
        session = sessionmaker(bind=self.__engine)
        self.__session = session()

    def all(self, cls=None):
        """
        Retrieve an instance from a particular if given.
        Else retrieve instance of all the classes.
        """
        obj_dict = {}

        if not cls:
            for item in classes:
                rows = self.__session.query(eval(item)).all()
                for row in rows:
                    key = item + "."  + row.id
                    obj_dict.update({key: row})
        else:
            rows = self.__session.query(cls).all()
            for row in rows:
                key = cls.__name__ + "."  + row.id
                obj_dict.update({key: row})

        return obj_dict

    def get_by_id(self, cls, obj_id):
        """Retrieve an instance with it's ID."""
        obj = self.__session.query(cls).filter_by(id=obj_id).one()
        return obj

    def new(self, obj):
        """Temporarily save an instance to database."""
        self.__session.add(obj)

    def save(self):
        """Permanently save an instance to database."""
        self.__session.commit()

    def delete(self, obj):
        """Delete an instance from database."""
        self.__session.delete(obj)

    def get_session(self):
        """Retrieve session engine to connect with database."""
        return self.__session
