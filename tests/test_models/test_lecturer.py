#!/usr/bin/python3
"""Models test cases for lecturer module."""
from models.lecturer import Lecturer
from models import Storage
import unittest


class TestLecturer(unittest.TestCase):
    """Define test cases for Lecturer class."""

    def setUp(self):
        """Set up test environment."""
        self.storage = Storage()
        self.attr = {"first_name": "John", "last_name": "Bush",
                "email": "example@gmail.com", "password": "12345"}
        self.user = Lecturer(**self.attr)
        self.session = self.storage.get_session()
        self.session.add(self.user)
        self.session.commit()

    def tearDown(self):
        """Teardown test environment for every test."""
        obj = self.session.query(Lecturer).filter_by(
                email="example@gmail.com").one()
        if obj:
            self.session.delete(obj)
            self.session.commit()
        self.session.close()

    def test_object_creation_successful(self):
        """Test that the object was save and canbe retrieved."""
        self.assertIsInstance(self.user, Lecturer)

        # Test that the user obj was successful and can be retrieved.
        obj = self.session.query(Lecturer).filter_by(
                email="example@gmail.com").one()
        self.assertIsNotNone(obj)
        self.assertEqual("John", obj.first_name)
        self.assertEqual("Bush", obj.last_name)
        self.assertEqual("example@gmail.com", obj.email)
        self.assertEqual("12345", obj.password)

    def test_hash_password(self):
        """Test that password is correctly hash."""
        hash_pwd = self.user.hash_password(self.attr["password"])
        self.assertNotEqual(hash_pwd, self.attr["password"])

    def test_check_password(self):
        """Test that password is correctly verified."""
        hash_pwd = self.user.hash_password(self.attr["password"])
        self.assertTrue(self.user.check_password(self.attr["password"]))

        # Test for wrong password
        self.assertFalse(self.user.check_password("wrong password"))


if __name__ == "__main__":
    unittest.main()
