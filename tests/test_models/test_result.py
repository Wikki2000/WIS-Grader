#!/usr/bin/env python3
"""Test cases for the Result model."""

from faker import Faker
from models.result import Result
from models.student import Student
from models.course import Course
from models.storage import Storage
from models.lecturer import Lecturer
import unittest


class TestResultModel(unittest.TestCase):
    """Test class for the Result model."""

    def setUp(self):
        """Set up the test environment."""

        self.storage = Storage()
        self.session = self.storage.get_session()
        self.fake = Faker()  # Initialize Faker instance

    def tearDown(self):
        """Tear down the test environment."""

        # Delete any remaining results
        self.session.query(Result).delete()
        # Delete any remaining students
        self.session.query(Student).delete()
        # Delete any remaining courses
        self.session.query(Course).delete()
        self.session.commit()  # Commit the changes
        self.session.close()  # Close the session

    def test_create_result(self):
        """Test creating a new result."""

        # Ensure student and course exist for the test
        student = Student(
            first_name=self.fake.first_name(),
            last_name=self.fake.last_name(),
            # Generate unique registration number
            reg_number=self.fake.unique.lexify(text="REG-?????")
        )
        self.session.add(student)
        self.session.commit()

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

        # Ensure course exists for the test
        course = Course(
            course_title="Operating Systems - II",
            course_code="CS 3307",
            credit_load=3,
            semester="Fall 2023",
            lecturer_id=lecturer.id
        )
        self.session.add(course)
        self.session.commit()

        # Create a result for the student in the course
        result = Result(
            test_score=85,
            exam_score=90,
            grade="A",
            mark=95,
            course_id=course.id,
            student_id=student.id
        )
        self.session.add(result)
        self.session.commit()

        # Query the result to check if it was added
        obj = self.session.query(Result).filter_by(
                course_id=course.id, student_id=student.id).first()
        self.assertIsNotNone(obj)
        self.assertEqual(obj.test_score, 85)
        self.assertEqual(obj.exam_score, 90)
        self.assertEqual(obj.grade, "A")
        self.assertIsNotNone(obj.mark)
        self.assertEqual(obj.mark, 95)
        self.assertEqual(obj.course_id, course.id)
        self.assertEqual(obj.student_id, student.id)


if __name__ == "__main__":
    unittest.main()
