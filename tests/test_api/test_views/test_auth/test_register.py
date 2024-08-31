#!/user/bin/python3
"""Models test case for register api."""
from api.v1.app import app
from models import storage
from models.lecturer import Lecturer
import unittest
from api.v1.views.auth.register import r


class TestRegisterRoute(unittest.TestCase):
    """Define class for user registration."""

    def setUp(self):
        """Setup environment for test."""
        self.url = "http://127.0.0.1:5001/api/v1/auth/register"
        r.setex("123456", 120, "valid")
        self.attr = {
                "first_name": "John",
                 "last_name": "Doe",
                 "token": "123456",
                 "email": "example@gmail.com",
                 "password": "12345"
        }
        app.config["TESTING"] = True
        self.client = app.test_client()
        self.session = storage.get_session()


    def tearDown(self):
        """Tear down test data in every test."""
        self.session.query(Lecturer).delete()
        self.session.commit()
        self.session.close()

    def test_register_successfull(self):
        """Test successfull registtration of User."""
        response = self.client.post(self.url, json=self.attr)
        expected_json_response = {
                'msg': 'Registration Successful',
                'status': 'Success'
        }
        self.assertEqual(expected_json_response, response.json)
        self.assertEqual(response.status, "200 OK")
        self.assertEqual(response.status_code, 200)

    def test_register_user_exist_already(self):
        """Handle test case for existed user."""

        # Store a user in a database (token not require)
        attr = {"first_name": "John", "last_name": "Doe",
                "email": "example@gmail.com", "password": "12345"}
        user1 = self.session.add(Lecturer(**attr))
        self.session.commit()
        self.session.close()

        # Attempt registering same user
        response = self.client.post(self.url, json=self.attr)
        expected_json_response = {"error": "User Exists Already"}
        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.json, expected_json_response)

    def test_register_empty_request_body(self):
        """Handle test case for empty request body."""
        body = {}
        response = self.client.post(self.url, json=body)
        expected_json_response = {"error": "Bad Request"}
        self.assertEqual(expected_json_response, response.json)
        self.assertEqual(response.status_code, 400)

    def test_register_missing_field(self):
        """Handle test case for missing field."""
        body = {"first_name": "John", "last_name": "Doe",
                "password": "12345", "token": "12345"}
        response = self.client.post(self.url, json=body)
        expected_json_response = {"error": "email Field Missing"}
        self.assertEqual(expected_json_response, response.json)
        self.assertEqual(response.status_code, 400)


if __name__ == "__main__":
    unittest.main()
