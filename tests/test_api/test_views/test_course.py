#!/usr/bin/python3
"""Unittests for course view."""
import unittest
from api.v1.app import app
from models.course import Course
from models.lecturer import Lecturer
from models.storage import Storage
from faker import Faker

class TestCourseAPI(unittest.TestCase):

    def setUp(self):
        """Set up a new session and configure the test client."""
        app.config['TESTING'] = True
        self.client = app.test_client()
        self.storage = Storage()
        self.session = self.storage.get_session()
        self.fake = Faker()

    def tearDown(self):
        """Clean up after each test."""
        self.session.query(Course).delete()
        self.session.query(Lecturer).delete()
        self.session.commit()

    def create_lecturer(self):
        """Helper function to create and return a test lecturer."""
        lecturer = Lecturer(
            first_name=self.fake.first_name(),
            last_name=self.fake.last_name(),
            email=self.fake.email(),
            password=self.fake.password()
        )
        lecturer.hash_password(lecturer.password)
        self.session.add(lecturer)
        self.session.commit()
        return lecturer

    def test_create_course(self):
        """Test creating a new course under a lecturer's profile."""
        lecturer = self.create_lecturer()

        response = self.client.post(
            '/api/v1/lecturer/{}/courses'.format(lecturer.id),
            json={
                'course_title': 'Test Course_1',
                'course_code': 'CS101',
                'credit_load': 3,
                'semester': 'Fall'
            }
        )

        self.assertEqual(response.status_code, 201)
        self.assertIn('course_code', response.json)
        self.assertEqual(response.json['course_code'], 'CS101')

    def test_get_courses(self):
        """Test retrieving all courses created by a lecturer."""
        lecturer = self.create_lecturer()

        course = Course(
            course_title='Test Course_2',
            course_code='CS102',
            credit_load=3,
            semester='Fall',
            lecturer_id=lecturer.id
        )
        self.session.add(course)
        self.session.commit()

        response = self.client.get('/api/v1/lecturer/{}/courses'.format(lecturer.id))

        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json, list)
        self.assertEqual(response.json[0]['course_code'], 'CS102')

    def test_update_course(self):
        """Test updating details of a specific course by its ID."""
        lecturer = self.create_lecturer()

        course = Course(
            course_title='Old Course Title',
            course_code='CS103',
            credit_load=3,
            semester='Fall',
            lecturer_id=lecturer.id
        )
        self.session.add(course)
        self.session.commit()

        response = self.client.put(
            '/api/v1/courses/{}'.format(course.id),
            json={
                'course_title': 'Updated Course Title',
                'credit_load': 4
            }
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['course_title'], 'Updated Course Title')
        self.assertEqual(response.json['credit_load'], 4)

    def test_delete_course(self):
        """Test deleting a specific course by its ID."""
        lecturer = self.create_lecturer()

        course = Course(
            course_title='Test Course_4',
            course_code='CS104',
            credit_load=3,
            semester='Fall',
            lecturer_id=lecturer.id
        )
        self.session.add(course)
        self.session.commit()

        response = self.client.delete('/api/v1/courses/{}'.format(course.id))

        self.assertEqual(response.status_code, 200)
        self.assertIn('message', response.json)

        deleted_course = self.session.get(Course, course.id)
        self.assertIsNone(deleted_course)


if __name__ == '__main__':
    unittest.main()

