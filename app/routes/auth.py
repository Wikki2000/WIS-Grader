#!/usr/bin/python3
"""
    Model for handling user registration,
    email verification, and login routes.
"""
from app.routes import app
from flask import render_template, request, redirect, url_for, jsonify
from flask import flash, session, make_response
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    set_access_cookies
)
from models.course import Course
from models.lecturer import Lecturer
from models.storage import Storage
import requests
from uuid import uuid4


@app.route('/account/signin', methods=['GET', 'POST'])
def signin():
    """Handle user login."""
    if request.method == 'GET':
        return render_template('login.html')

    data = request.get_json()

    # Check if required fields are present
    if not data or 'email' not in data or 'password' not in data:
        return jsonify(
            {
                "message": "Empty request body",
                "status": "Bad Request"
            }
        ), 400

    email = data.get('email')
    password = data.get('password')

    # Make a request to the API to login the user
    url = 'http://127.0.0.1:5001/api/v1/auth/login'
    response = requests.post(url, json={'email': email, 'password': password})

    if response.status_code == 200:
        res_json = response.json()
        access_token = res_json.get('access_token')

        # Set cookie for access token
        response = jsonify({"message": "Login Successful"})
        set_access_cookies(response, access_token)  # Set JWT in cookie
        session.pop('registration_data', None)
        return response, 200

    elif response.status_code == 401:
        return jsonify({"error": "Invalid Email or Password"}), 401

    return jsonify({"error": "Something went wrong"})


@app.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    """ Lecturer Dashboard. """
    # Retrieve lecturer's ID from the JWT token
    lecturer_id = get_jwt_identity()

    storage = Storage()
    session = storage.get_session()

    # Query the lecturer's information from the database using the lecturer ID
    lecturer = session.get(Lecturer, lecturer_id)

    if not lecturer:
        return jsonify({"error": "Lecturer not found"}), 404

    # Retrieve lecturer's full name
    full_name = f"{lecturer.first_name} {lecturer.last_name}"

    # Query courses associated with the lecturer
    courses = lecturer.courses

    # Create a list of course names with course codes
    course_names = [
        {course.course_code: course.course_title} for course in courses
    ]

    # Render the dashboard template.
    return render_template(
        'dashboard.html',
        full_name=full_name,
        courses=course_names
    )
