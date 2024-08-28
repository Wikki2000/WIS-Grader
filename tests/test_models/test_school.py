#!/usr/bin/env python3
"""Test cases for the School model."""

from faker import Faker
from models.school import School
from models.lecturer import Lecturer
from models.storage import Storage
import unittest


class TestSchoolModel(unittest.TestCase):
    """Test class for the School model."""

    def setUp(self):
        """Set up the test environment."""
        self.storage = Storage()
        self.session = self.storage.get_session()
        self.fake = Faker()  # Initialize Faker instance

    def tearDown(self):
        """Tear down the test environment."""
        # Delete any remaining schools
        self.session.query(School).delete()
        # Delete any remaining lecturers
        self.session.query(Lecturer).delete()
        self.session.commit()  # Commit the changes
        self.session.close()  # Close the session

    def test_create_school(self):
        """Test creating a new school and assigning it to a lecturer."""

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

        # Create a school for the lecturer
        school = School(
            school_name="Springfield High",
            logo=b"logo_data",  # Binary data for the logo
            dean_name=self.fake.name(),
            lecturer_id = lecturer.id
        )
        self.session.add(school)
        self.session.commit()

        # Query the school to check if it was added
        obj = self.session.query(School).filter_by(school_name="Springfield High").first()
        self.assertIsNotNone(obj)
        self.assertEqual(obj.school_name, "Springfield High")
        self.assertEqual(obj.dean_name, school.dean_name)
        self.assertEqual(obj.lecturer_id, lecturer.id)

    def test_create_school_without_logo(self):
        """Test creating a school without a logo."""

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

        # Create a school for the lecturer without a logo
        school = School(
            school_name="Riverside Academy",
            dean_name=self.fake.name(),
            lecturer_id=lecturer.id
        )
        self.session.add(school)
        self.session.commit()

        # Query the school to check if it was added
        obj = self.session.query(School).filter_by(school_name="Riverside Academy").first()
        self.assertIsNotNone(obj)
        self.assertEqual(obj.school_name, "Riverside Academy")
        self.assertEqual(obj.dean_name, school.dean_name)
        self.assertEqual(obj.lecturer_id, lecturer.id)
        self.assertIsNone(obj.logo)  # Ensure logo is None

    def test_create_multiple_schools(self):
        """Test creating multiple schools and assigning them to different lecturers."""

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

        # Create two schools, each assigned to a different lecturer
        school1 = School(
            school_name="Greenwood School",
            logo=b"logo1_data",  # Binary data for the logo
            dean_name=self.fake.name(),
            lecturer_id=lecturer1.id
        )
        school2 = School(
            school_name="Lincoln School",
            logo=b"logo2_data",  # Binary data for the logo
            dean_name=self.fake.name(),
            lecturer_id=lecturer2.id
        )
        self.session.add(school1)
        self.session.add(school2)
        self.session.commit()

        # Query the schools to check if they were added
        obj1 = self.session.query(School).filter_by(school_name="Greenwood School").first()
        obj2 = self.session.query(School).filter_by(school_name="Lincoln School").first()
        self.assertIsNotNone(obj1)
        self.assertIsNotNone(obj2)
        self.assertEqual(obj1.school_name, "Greenwood School")
        self.assertEqual(obj2.school_name, "Lincoln School")
        self.assertEqual(obj1.lecturer_id, lecturer1.id)
        self.assertEqual(obj2.lecturer_id, lecturer2.id)


if __name__ == "__main__":
    unittest.main()
