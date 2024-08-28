#!/usr/bin/python3
"""Test the views/index.py module."""
import unittest
from api.v1.app import app

class TestIndexViews(unittest.TestCase):
    """This class represents the test case for the index view."""

    def setUp(self):
        """Set up the test environment before each test."""
        app.config['TESTING'] = True
        self.client = app.test_client()

    def test_status(self):
        """Test the /status endpoint."""
        response = self.client.get('/api/v1/status')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"status": "OK"})

    def test_not_found_error_handler(self):
        """Test the global 404 error handler."""
        response = self.client.get('/api/v1/nonexistent-url')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(
            response.get_json(),
            {
                "error": "Not Found",
                "message": "The requested URL was not found on the server."
            }
        )

if __name__ == "__main__":
    unittest.main()
