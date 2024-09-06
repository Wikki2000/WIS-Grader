#!/usr/bin/python3
""" Model for handling user registration, email verification, and login routes. """
from app.routes import app
from flask import render_template, request, redirect, url_for, jsonify
from flask import flash, session
import requests
from uuid import uuid4


@app.route('/account/signin', methods=['GET', 'POST'])
def signin():
    """Handle user login."""
    if request.method == 'GET':
        return render_template('login.html')

    # For POST request, process the login form data
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
    response = requests.post(
        url,
        json={'email': email, 'password': password}
    )

    if response.status_code == 200:
        # Successful login
        res_json = response.json()
        access_token = res_json.get('access_token')

        # Set token in cookies
        response = jsonify(
            {
                'status': 'Success',
                'msg': 'Login Successful'
            }
        )
        response.set_cookie('access_token_cookie',
                            access_token, httponly=True, secure=True)

        # Clear the registration data from session
        session.pop('registration_data', None)

        return response, 200

    elif response.status_code == 401:
        # Invalid credentials
        return jsonify(
            {
                "error": "Invalid Email or Password"
            }
        ), 401

    else:
        # Handle any other errors (e.g., bad request)
        return jsonify(
            {
                "error": "Invalid Email or Password"
            }
        ), response.status_code
