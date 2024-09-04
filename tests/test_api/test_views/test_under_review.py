#!/usr/bin/python3
"""Script to test course API endpoints using requests."""

import requests
from faker import Faker
from models.storage import Storage
from models.lecturer import Lecturer
from models.course import Course
import random

# Base URL of Flask API
BASE_URL = "http://127.0.0.1:5001/api/v1"


def create_lecturer(token, first_name, last_name, email, password):
    """Create a new lecturer using the API and return the lecturer data."""

    url = f"{BASE_URL}/auth/register"

    lecturer_data = {
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'password': password,
        'token': token
    }

    response = requests.post(url, json=lecturer_data)

    if response.status_code == 200:
        lecturer = response.json()
        print(f"Lecturer created: {lecturer}")
        return lecturer
    else:
        print(f"""Failed to create lecturer:
                    {response.status_code} - {response.text}""")
        return None


def create_course(lecturer_id):
    """Create a new course for a given lecturer."""

    url = f"{BASE_URL}/lecturer/{lecturer_id}/courses"

    courses = [
        ['Introduction to Computer Science', 'CS 1101'],
        ['Principles of Management', 'MGMT 1301'],
        ['College Algebra', 'MATH 1101'],
        ['Introduction to Business', 'BUS 1201'],
        ['Human Resource Management', 'HRM 2101']
    ]

    course = random.choice(courses)
    course_data = {
        'course_title': course[0],
        'course_code': course[1],
        'credit_load': random.randint(3, 6),
        'semester': str(random.choice(['Sprint', 'Fall'])) + ' ' +
        str(random.randint(2020, 2027))
    }

    response = requests.post(url, json=course_data)

    if response.status_code == 201:
        course = response.json()
        print(f"Course created: {course}")
        return course
    else:
        print(f"""Failed to create course:
                {response.status_code} - {response.text}""")
        return None


def get_courses(lecturer_id):
    """Retrieve all courses created by a lecturer."""

    url = f"{BASE_URL}/lecturer/{lecturer_id}/courses"

    response = requests.get(url)

    if response.status_code == 200:
        courses = response.json()
        print(f"Courses retrieved: {courses}")
        return courses
    else:
        print(f"""Failed to get courses:
                {response.status_code} - {response.text}""")
        return None


def update_course(course_id):
    """Update details of a specific course."""

    url = f"{BASE_URL}/courses/{course_id}"

    update_data = {
        'course_title': 'Updated Course Title',
        'credit_load': 4
    }

    response = requests.put(url, json=update_data)

    if response.status_code == 200:
        updated_course = response.json()
        print(f"Course updated: {updated_course}")
        return updated_course
    else:
        print(f"""Failed to update course:
                {response.status_code} - {response.text}""")
        return None


def delete_course(course_id):
    """Delete a specific course by its ID."""

    url = f"{BASE_URL}/courses/{course_id}"

    response = requests.delete(url)

    if response.status_code == 200:
        print(f"Course deleted: {response.json()}")
        return True
    else:
        print(f"""Failed to delete course:
                {response.status_code} - {response.text}""")
        return False


def main():
    """Main function to test the API endpoints."""

    # Create a lecturer
    url = 'http://127.0.0.1:5001/api/v1/auth/send-token'

    storage = Storage()
    session = storage.get_session()
    fake = Faker()

    first_name = fake.first_name()
    last_name = fake.last_name()
    email = fake.email()
    password = fake.password()

    res = requests.post(url,
                        json={
                                'email': email,
                                'name': first_name + ' ' + last_name})
    token = res.json()['token']

    lecturer = create_lecturer(token, first_name, last_name, email, password)
    if not lecturer:
        return

    lecturerObj = session.query(Lecturer).filter_by(email=email).first()
    lecturer_id = lecturerObj.id

    # Create a course under the lecturer's profile
    course = create_course(lecturer_id)
    if not course:
        return

    course_id = course['id']

    # Retrieve all courses created by the lecturer
    get_courses(lecturer_id)

    # Update the course
    update_course(course_id)

    # Delete the course
    delete_course(course_id)

    # Clean Up
    session.query(Course).delete()
    session.query(Lecturer).delete()
    session.commit()


if __name__ == "__main__":
    main()
