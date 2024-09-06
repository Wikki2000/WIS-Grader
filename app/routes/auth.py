#!/usr/bin/python3
""" Model for handling user registration, email verification, and login routes. """
from app.routes import app
from flask import render_template, request, redirect, url_for, jsonify
from flask import flash, session, make_response
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
        # Forward the access token to the frontend
        res_json = response.json()
        access_token = res_json.get('access_token')

        # Create a response object
        resp = make_response(jsonify({'message': 'Login Successful'}), 200)

        # Set the access token as a secure, HTTP-only cookie
        resp.set_cookie('access_token_cookie', access_token, httponly=True, secure=True)

        # Clear registration data from session
        session.pop('registration_data', None)

        return resp

    elif response.status_code == 401:
        return jsonify({"error": "Invalid Email or Password"}), 401

    else:
        return jsonify({"error": "Invalid Email or Password"}), response.status_code

@app.route('/dashboard', methods=['GET'])
def dashboard():
    """Render the dummy dashboard."""
    # This is a dummy dashboard route
    return render_template('dashboard.html')
