#!/usr/bin/env python3
"""Test cases for the Lecturer and Course models."""
from faker import Faker
from models.lecturer import Lecturer
from models.course import Course
from models.student import Student
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

        # Remove test data after each test.
        self.session.query(Course).delete()
        self.session.query(Student).delete()
        self.session.query(Lecturer).delete()
        self.session.commit()  # Commit the changes
        self.session.close()   # Close the session

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

    def test_add_student_to_course(self):
        """Test that a student can be assign to a course."""
        lecturer = Lecturer(
                first_name="John",
                last_name="Doe",
                email="johndoe@gnail.com",
                password="12345"
        )

        # Added student instance to database
        student1 = Student(
                first_name="Thomas",
                last_name="Moses",
                reg_number="AK/4001",
        )
        student2 = Student(
                first_name="James",
                last_name="Mata",
                reg_number="AK/4002"
        )

        # Added course instance to db for test
        course = Course(
                course_title="FINANCIAL ACCOUNTING",
                course_code="BUS 3301",
                credit_load=4,
                semester="Spring 2025",
                lecturer_id=lecturer.id
        )
        course.students.extend([student1, student2])
        self.session.commit()
        self.assertEqual(len(course.students), 2)
        self.assertEqual(course.students[0].first_name, "Thomas")
        self.assertEqual(course.students[1].first_name, "James")

    def test_add_course_to_student(self):
        """Test that course can be assign to a student."""
        lecturer = Lecturer(
                first_name="John",
                last_name="Doe",
                email="johndoe@gnail.com",
                password="12345"
        )
        student = Student(
                first_name="Thomas",
                last_name="Moses",
                reg_number="AK/4001",
        )
        course1 = Course(
                course_title="FINANCIAL ACCOUNTING",
                course_code="BUS 3301",
                credit_load=4,
                semester="Spring 2025",
                lecturer_id=lecturer.id
        )
        course2 = Course(
                course_title="Pysics",
                course_code="PHY101",
                credit_load=4,
                semester="Fall",
                lecturer_id=lecturer.id
        )
        student.courses.extend([course1, course2])
        self.session.commit()
        self.assertEqual(len(student.courses), 2)
        self.assertEqual(student.courses[0].course_code, "BUS 3301")
        self.assertEqual(student.courses[1].course_code, "PHY101")


if __name__ == "__main__":
    unittest.main()
