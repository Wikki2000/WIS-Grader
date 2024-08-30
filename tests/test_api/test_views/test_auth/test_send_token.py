#!/usr/bin/python3
"""Model test case for api/v1/views/auth/send_token module."""
from api.v1.views.auth import send_token
from api.v1.app import app
import unittest


class TestSendToken(unittest.TestCase):
    """Define test case for send_token module."""

    def setUp(self):
        """Setup environment for testing."""
        app.config["TESTING"] = True
        self.app = app.test_client()
        self.url = "http://localhost:5001/api/v1/auth/send-token"

    def tearDown(self):
        """Remove test data to run each test in isolation."""
        pass

    def test_generate_token(self):
        """Handle test case for generate_token."""
        rand_no = send_token.generate_token()
        self.assertIsNotNone(rand_no)
        self.assertEqual(6, len(rand_no))

    def test_fwd_token(self):
        """Handle test case for send_token."""
        token = "2345"
        recipient = {"name": "John Bush", "email": "example@gmail.com"}
        mail = f"<h1>This is your token {token}"
        response = send_token.fwd_token(token, mail, recipient)
        self.assertTrue(response, "Check Network Connection")

    def test_send_token_successful(self):
        """Test for successful response"""
        body = {"name": "John Bush", "email": "example@gmail.com"}
        response = self.app.post(self.url, json=body)
        self.assertEqual(response.status, "200 OK")
        self.assertEqual(response.status_code, 200)

    def test_send_token_empty_request_body(self):
        """Test empty request body."""
        body = {}
        response = self.app.post(self.url, json=body)
        expected_str = {"error": "Bad Request"}
        self.assertEqual(expected_str, response.json)

    def test_send_token_missing_field(self):
        """Test for missing field"""
        body = {"name": "John Bush"}
        response = self.app.post(self.url, json=body)
        expected_str = {"error": "Bad Request"}
        self.assertEqual(expected_str, response.json)


if __name__ == "__main__":
    unittest.main()
