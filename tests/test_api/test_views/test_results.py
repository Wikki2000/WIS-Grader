#!/usr/bin/python3
"""Handle test case for api/v1/views/results modeules."""
from api.v1.app import app
from models.lecturer import Lecturer
from models.course import Course
from models.student import Student
from models import storage
import unittest


class TestResultsApi(unittest.TestCase):
    """Handle test case for API request in results.py"""

    def setUp(self):
        """Setup test environment."""
        self.session = storage.get_session()

        # Create lecturer object
        
        self.lec_attr = {
               "first_name": "John",
               "last_name": "Doe",
               "email": "example@gmail.co",
               "password": "12345"
        }
        self.lecturer = Lecturer(**self.lec_attr)
        self.session.add(self.lecturer)
        self.session.commit()

        # Create course object
        self.cs_attr = {
                "course_title": "Engineering Math",
                "course_code": "ENG212",
                "credit_load": 3,
                "semester": "First",
                "lecturer_id": self.lecturer.id
        }
                
        self.course = Course(**self.cs_attr)
        self.session.add(self.course)
        self.session.commit()

        # Create student object
        self.st_attr = {
                "first_name": "John",
                "last_name": "Doe",
                "reg_number": "AK24"
        }
        self.student = Student(**self.st_attr)
        self.session.add(self.student)
        self.session.commit()

        # Create result object
        self.rs_attr = {
                "test_score": 20,
                "exam_score": 50,
                "total_score": 70,
                "grade": "A",
                "remark": "Excellent",
                "course_id": self.course.id,
                "student_id": self.student.id
        }
        self.result = Result(**self.rs_attr)
        self.session.add(self.result)
        self.session.commit()

        self.post_url = f"api/v1/courses/{self.course.id}" + \
                        f"students/{self.student.id}/results"

        app.config["TESTING"] = True
        self.client = app.test_client()

    def tearDown(self):
        """Remove test data after each test."""
        self.session.query(Lecturer).delete()
        self.session.query(Course).delete()
        self.session.query(Student).delete()
        self.session.query(Result).delete()
        self.session.commit()
        self.session.close()

    def test_handle_error_400_empty_body(self):
        """Test that the error handle missing field."""
        body = {}
        response = self.results.handle_error_400(body)
        expected_json_response = {"error": "Empty Request Body"}
        self.assertEqual(response, expected_json_response)

if __name__ == "__main__":
    unittest.main()
