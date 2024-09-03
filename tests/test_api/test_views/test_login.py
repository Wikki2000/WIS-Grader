from flask import Flask
from flask_jwt_extended import JWTManager
from models.storage import Storage
from models.lecturer import Lecturer
from api.v1.views import app_views
from api.v1.app import app
import unittest


class TestLoginRoute(unittest.TestCase):
    """Test cases for the login route."""

    def setUp(self):
        """Set up a new session and create a test lecturer before each test."""

        app.config['TESTING'] = True
        self.client = app.test_client()
        self.storage = Storage()
        self.session = self.storage.get_session()

        # Create a test lecturer
        self.lecturer = Lecturer(
            first_name="John",
            last_name="Doe",
            email="johndoe@example.com",
            password="password123"
        )
        self.lecturer.hash_password("password123")
        self.session.add(self.lecturer)
        self.session.commit()

    def tearDown(self):
        """Clean up after each test."""
        self.session.query(Lecturer).delete()
        self.session.commit()
        self.session.close()

    def test_login_success(self):
        """Test login with valid credentials."""
        response = self.client.post('/api/v1/auth/login', json={
            'email': 'johndoe@example.com',
            'password': 'password123'
        })

        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', response.get_json())

    def test_login_failure(self):
        """Test login with invalid credentials."""
        response = self.client.post('/api/v1/auth/login', json={
            'email': 'johndoe@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 401)
        self.assertIn('error', response.get_json())
        self.assertEqual(response.get_json()['error'],
                         'Invalid email or password')

    def test_login_empty_request_body(self):
        """Handle test case for empty request body."""
        body = {}
        expected_json_response = {"error": "No input data provided"}
        response = self.client.post('/api/v1/auth/login', json=body)
        self.assertEqual(response.json, expected_json_response)
        self.assertEqual(response.status_code, 400)

    def test_login_missing_field(self):
        """Handle test case for missing input field."""
        body = {"email": "example@gmail.com"}
        response = self.client.post('/api/v1/auth/login', json=body)
        expected_json_response = {"error": "Missing fields: password"}
        self.assertEqual(response.json, expected_json_response)
        self.assertEqual(response.status_code, 400)


if __name__ == '__main__':
    unittest.main()
