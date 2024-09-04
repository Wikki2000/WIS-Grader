#!/usr/bin/python3
"""Models test case for storage class."""
from models.storage import Storage
from sqlalchemy import String, Column
from sqlalchemy.orm import Session, declarative_base
from models.base_model import Base
from uuid import uuid4
import unittest


class MockClass(Base):
    """Create mock table for storing mock data to test Storage class."""
    __tablename__ = "test"
    id = Column(String(50), primary_key=True, default=uuid4())
    mock_data = Column(String(20))


class TestStorage(unittest.TestCase):
    """Define test case for storage module."""

    def setUp(self):
        """Set up test environments."""
        self.storage = Storage()
        self.session = self.storage.get_session()
        self.mock_obj = MockClass(mock_data="John Doe")

    def tearDown(self):
        """Destroy test data after each test cases."""
        obj = self.session.query(MockClass).filter_by(
                id=self.mock_obj.id).first()
        if obj:
            self.session.delete(obj)
            self.session.commit()
        self.session.close()

    def test_init(self):
        """Test that session engine creation was successfull."""
        self.assertIsInstance(self.storage, Storage)

    def test_get_session(self):
        """Test that the session engine is correctly return."""
        session = self.storage.get_session()
        self.assertIsNotNone(session)
        self.assertIsInstance(session, Session)

    def test_new(self):
        """Test that an instance is temporarily store in session."""
        self.storage.new(self.mock_obj)
        self.assertIn(self.mock_obj, self.session.new)

    def test_save(self):
        """Test that the instance is save permanently in db."""
        self.storage.new(self.mock_obj)
        self.storage.save()
        self.assertNotIn(self.mock_obj, self.session.new)

    def test_get_by_id(self):
        """Test that an object is retrieved  by it ID."""
        self.session.add(self.mock_obj)
        self.session.commit()
        obj = self.storage.get_by_id(MockClass, self.mock_obj.id)
        self.assertIsInstance(obj, MockClass)

    def test_all(self):
        """Test that records in a class is correctly retrieved."""
        self.session.add(self.mock_obj)
        self.session.commit()
        obj = self.storage.all(MockClass)
        self.assertIsNotNone(obj)
        self.assertIsInstance(obj, dict)


if __name__ == "__main__":
    unittest.main()
