#!/usr/bin/python3
"""Test the app/app.py module."""
import unittest
from flask import Flask
from app.app import app

class TestFlaskApp(unittest.TestCase):
    """This class represents the test case for the Flask application."""

    def setUp(self):
        """Set up the test environment before each test."""
        app.config['TESTING'] = True
        self.app = app.test_client()

    def test_404_error(self):
        """Test for 404 error handling."""
        response = self.app.get('/nonexistent-url')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json(), {"error": "Not Found"})


if __name__ == "__main__":
    unittest.main()
