#!/usr/bin/python3
"""Models test cases for lecturer module."""
from models.course import Course
from models.base_model import Base
from models.lecturer import Lecturer
from models.school import School
from models import Storage
import unittest


class TestLecturer(unittest.TestCase):
    """Define test cases for Lecturer class."""

    def setUp(self):
        """Set up test environment."""
        self.storage = Storage()
        self.attr = {"first_name": "John", "last_name": "Bush",
                     "email": "example@gmail.com", "password": "12345"}
        self.user = Lecturer(**self.attr)
        self.session = self.storage.get_session()
        self.session.add(self.user)
        self.session.commit()

    def tearDown(self):
        """Teardown test environment for every test."""
        try:
            obj = self.session.query(Lecturer).filter_by(
                    email="example@gmail.com").first()
            if obj:
                self.session.delete(obj)
                self.session.commit()
        except Exception as e:
            self.session.rollback()
            print(f"Error during teardown: {e}")
        finally:
            self.session.rollback()
            self.session.close()

    def test_lecturer_creation(self):
        """Test that the lecturer object was saved and can be retrieved."""
        self.assertIsInstance(self.user, Lecturer)
        obj = self.session.query(Lecturer).filter_by(
                email="example@gmail.com").one()
        self.assertIsNotNone(obj)
        self.assertEqual("John", obj.first_name)
        self.assertEqual("Bush", obj.last_name)
        self.assertEqual("example@gmail.com", obj.email)
        self.assertEqual("12345", obj.password)

    def test_hash_password(self):
        """Test that password is correctly hashed."""
        self.user.hash_password(self.attr["password"])
        self.assertNotEqual(self.user.password, self.attr["password"])

    def test_check_password(self):
        """Test that password is correctly verified."""
        self.user.hash_password(self.attr["password"])
        self.assertTrue(self.user.check_password(self.attr["password"]))
        self.assertFalse(self.user.check_password("wrong password"))

    def test_lecturer_course_relationship(self):
        """"Test the one-to-many relationship between Lecturer and Course."""
        course1 = Course(course_title="Physics", course_code="ENG212",
                         credit_load=3, semester="second",
                         lecturer_id=self.user.id)
        course2 = Course(course_title="Mathematics", course_code="MTH101",
                         credit_load=3, semester="First",
                         lecturer_id=self.user.id)
        self.session.add_all([course1, course2])
        self.session.commit()

        # Refresh the lecturer object to get the latest data from the DB
        self.session.refresh(self.user)
        self.assertEqual(len(self.user.courses), 2)

    def test_cascade_delete_courses(self):
        """Test that deleting a lecturer deletes associated courses."""
        course = Course(course_title="Physics", course_code="ENG212",
                         credit_load=3, semester="second",
                         lecturer_id=self.user.id)
        self.session.add(course)
        self.session.commit()

        # Verify course exists
        self.assertEqual(self.session.query(Course).count(), 1)

        # Delete the lecturer
        self.session.delete(self.user)
        self.session.commit()

        # Verify that the course was also deleted
        self.assertEqual(self.session.query(Course).count(), 0)

    def test_lecturer_school_relationship(self):
        """"Test the one-to-many relationship between Lecturer and School."""
        school = School(school_name="AKSU", lecturer_id=self.user.id)
        self.session.add(school)
        self.session.commit()

        # Refresh the lecturer object to get the latest data from the DB
        self.assertEqual(len(self.user.schools), 1)


if __name__ == "__main__":
    unittest.main()

