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
        # Rollback any changes to the session
        #self.session.rollback()

        self.session.query(Lecturer).delete()
        self.session.commit()  # Commit the changes
        self.session.close()   # Close the session

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
        self.assertEqual(response.get_json()['error'], 'Invalid email or password')


if __name__ == '__main__':
    unittest.main()
