#!/usr/bin/env python3
"""Test cases for the Lecturer and Course models."""

from faker import Faker
from models.lecturer import Lecturer
from models.course import Course
from models.storage import Storage
import unittest


class TestModels(unittest.TestCase):
    """Test class for the Lecturer and Course models."""

    def setUp(self):
        """Set up test environment."""
        self.storage = Storage()
        self.session = self.storage.get_session()
        self.fake = Faker()  # Initialize Faker instance

    def tearDown(self):
        """Tear down test environment by closing the session."""
        self.session.close()  # Close the session

    def test_create_lecturers(self):
        """Test creating multiple lecturers."""

        # Create 3 lecturers
        lecturers = []
        for _ in range(3):
            lecturer = Lecturer(
                first_name=self.fake.first_name(),
                last_name=self.fake.last_name(),
                email=self.fake.email(),
                password=self.fake.password()
            )
            lecturer.hash_password(lecturer.password)
            self.session.add(lecturer)
            lecturers.append(lecturer)

        self.session.commit()

        # Query the lecturers to check if they were added
        for lecturer in lecturers:
            obj = self.session.query(Lecturer).filter_by(email=lecturer.email).first()
            self.assertIsNotNone(obj)
            self.assertEqual(obj.first_name, lecturer.first_name)
            self.assertEqual(obj.last_name, lecturer.last_name)
            self.assertEqual(obj.email, lecturer.email)

        # Clean up - delete the created lecturers
        for lecturer in lecturers:
            self.session.delete(lecturer)
        self.session.commit()

    def test_create_course(self):
        """Test creating a new course and assigning it to a lecturer."""

        # Ensure lecturer exists for the test
        lecturer = Lecturer(
            first_name=self.fake.first_name(),
            last_name=self.fake.last_name(),
            email=self.fake.email(),
            password=self.fake.password()
        )
        lecturer.hash_password(lecturer.password)
        self.session.add(lecturer)
        self.session.commit()

        # Create a course for the lecturer
        course = Course(
            course_title="Operating Systems - II",
            course_code="CS 3307",
            credit_load=3,
            semester="Fall 2023",
            lecturer_id=lecturer.id
        )
        self.session.add(course)
        self.session.commit()

        # Query the course to check if it was added
        obj = self.session.query(Course).filter_by(course_code="CS 3307").first()
        self.assertIsNotNone(obj)
        self.assertEqual(obj.course_title, "Operating Systems - II")
        self.assertEqual(obj.lecturer_id, lecturer.id)

        # Clean up - delete the created course and lecturer
        self.session.delete(course)
        self.session.delete(lecturer)
        self.session.commit()

    def test_create_multiple_courses(self):
        """Test creating multiple courses and assigning them to different lecturers."""

        # Create two lecturers
        lecturer1 = Lecturer(
            first_name=self.fake.first_name(),
            last_name=self.fake.last_name(),
            email=self.fake.email(),
            password=self.fake.password()
        )
        lecturer2 = Lecturer(
            first_name=self.fake.first_name(),
            last_name=self.fake.last_name(),
            email=self.fake.email(),
            password=self.fake.password()
        )
        lecturer1.hash_password(lecturer1.password)
        lecturer2.hash_password(lecturer2.password)
        self.session.add(lecturer1)
        self.session.add(lecturer2)
        self.session.commit()

        # Create two courses, each assigned to a different lecturer
        course1 = Course(
            course_title="Biochemistry",
            course_code="CHEM 3212",
            credit_load=6,
            semester="Fall 2024",
            lecturer_id=lecturer1.id
        )
        course2 = Course(
            course_title="FINANCIAL ACCOUNTING",
            course_code="BUS 3301",
            credit_load=4,
            semester="Spring 2025",
            lecturer_id=lecturer2.id
        )
        self.session.add(course1)
        self.session.add(course2)
        self.session.commit()

        # Query the courses to check if they were added
        obj1 = self.session.query(Course).filter_by(course_code="CHEM 3212").first()
        obj2 = self.session.query(Course).filter_by(course_code="BUS 3301").first()
        self.assertIsNotNone(obj1)
        self.assertIsNotNone(obj2)
        self.assertEqual(obj1.course_title, "Biochemistry")
        self.assertEqual(obj2.course_title, "FINANCIAL ACCOUNTING")
        self.assertEqual(obj1.lecturer_id, lecturer1.id)
        self.assertEqual(obj2.lecturer_id, lecturer2.id)

        # Clean up - delete the created courses and lecturers
        self.session.delete(course1)
        self.session.delete(course2)
        self.session.delete(lecturer1)
        self.session.delete(lecturer2)
        self.session.commit()


if __name__ == "__main__":
    unittest.main()
