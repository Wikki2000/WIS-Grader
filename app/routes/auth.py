#!/usr/bin/python3
""" Model for handling user registration, email verification, and login routes. """
from app.routes import app
from flask import render_template, request, redirect, url_for, jsonify
from flask import flash, session, make_response
import requests
from uuid import uuid4
from flask_jwt_extended import jwt_required, get_jwt_identity, set_access_cookies

@app.route('/account/signin', methods=['GET', 'POST'])
def signin():
    """Handle user login."""
    if request.method == 'GET':
        return render_template('login.html')

    data = request.get_json()

    # Check if required fields are present
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"message": "Empty request body", "status": "Bad Request"}), 400

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
        #response.set_cookie('access_token', access_token, httponly=True)
        session.pop('registration_data', None)
        return response, 200

    elif response.status_code == 401:
        return jsonify({"error": "Invalid Email or Password"}), 401

    return jsonify({"error": "Something went wrong"})

@app.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    # Retrieve user identity from the JWT token
    current_user = get_jwt_identity()
    full_name = current_user.get('first_name')

    # Render or return the dashboard content with the user's full name
    return jsonify(message=f"Welcome to the dashboard, {full_name}!"), 200
