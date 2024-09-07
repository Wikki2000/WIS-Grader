#!/usr/bin/python3
"""
    Model for handling user registration,
    email verification, and login routes.
"""
from app.routes import app
from flask import render_template, request, redirect, url_for, jsonify, session
from flask_jwt_extended import set_access_cookies
import requests
from uuid import uuid4
from models.storage import Storage
from models.lecturer import Lecturer


storage = Storage()


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
        return response, 200

    elif response.status_code == 401:
        return jsonify({"error": "Invalid Email or Password"}), 401

    return jsonify({"error": "Something went wrong"})


@app.route('/account/signup', methods=['GET', 'POST'])
def signup():
    """Handle user registration."""
    if request.method == 'GET':
        return render_template('register.html', cache_id=uuid4())

    data = request.get_json()

    # This handle missing field that may be sent from curl
    required_fields = ["firstname", "lastname", "email", "password"]
    for field in required_fields:
        if field not in data:
            abort(400, "Bad Request")

    firstname = data.get('firstname')
    lastname = data.get('lastname')
    email = data.get('email')
    password = data.get('password')

    sess = storage.get_session()
    user = sess.query(Lecturer).filter_by(email=email).first()
    sess.close()
    if user:
        return jsonify({"error": "User Exist Already"}), 422

    # Save data in the session
    session['registration_data'] = {
        'firstname': firstname,
        'lastname': lastname,
        'email': email,
        'password': password
    }

    # Send verification token
    url = 'http://127.0.0.1:5001/api/v1/auth/send-token'
    res = requests.post(
        url,
        json={'email': email, 'name': f'{firstname} {lastname}'}
    )
    json_res = res.json()
    token = json_res.get('token')

    if token:
        return jsonify({'status': 'Success'}), 200
    return jsonify({'error': 'Internal Error Occured'}), 500


@app.route('/account/verify-email', methods=['GET', 'POST'])
def verify_email():
    """Verify the email using a token."""
    if request.method == 'GET':
        email = session.get('registration_data').get('email')
        data = {'email': email, 'cache_id': uuid4()}
        return render_template('verify_email.html', **data)

    data = request.get_json()
    if not data.get("token"):
        abort(400, "Bad Request")

    token = data.get("token")
    # Retrieve registration data from session
    registration_data = session.get('registration_data')
    if not registration_data:
        abort(404, "Registration Data Not Found in Session")

    email = registration_data['email']
    firstname = registration_data['firstname']
    lastname = registration_data['lastname']
    password = registration_data['password']

    # Send token and registration data to the API
    url = 'http://127.0.0.1:5001/api/v1/auth/register'
    response = requests.post(
            url,
            json={
                'email': email,
                'first_name': firstname,
                'last_name': lastname,
                'password': password,
                'token': token
                }
            )

    if response.status_code == 200:
        access_token = response.json().get("access_token")
        session.clear() # Clear session
        response = jsonify(
                {
                    "msg": "Login successful",
                    "status": "Success"
                }
        )
        set_access_cookies(response, access_token)
        return response, 200
    else:
        return jsonify({"error": "Registration Failed"}), 422


@app.route('/account/verify-success', methods=['GET'])
def verify_success():
    """Render template for successfull email registration."""
    return render_template("confirm_email.html", cache_id=uuid4())
