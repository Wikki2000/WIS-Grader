#!/usr/bin/python3
"""Test the app/app.py module."""
import unittest
from api.v1.app import app

class TestFlaskApp(unittest.TestCase):
    """This class represents the test case for the Flask application."""

    def setUp(self):
        """Set up the test environment before each test."""
        app.config['TESTING'] = True
        self.client = app.test_client()

    def test_app_initialization(self):
        """Test that the Flask app initializes correctly."""
        self.assertIsNotNone(app)

    def test_index_route(self):
        """Test the root route '/'."""
        response = self.client.get('/api/v1/')
        self.assertEqual(response.status_code, 404)

    def test_cors_configuration(self):
        """Test that CORS headers are properly set."""
        response = self.client.get('/api/v1/status')
        self.assertEqual(response.headers.get('Access-Control-Allow-Origin'), 'http://localhost:5000')

if __name__ == "__main__":
    unittest.main()
