#!/usr/bin/python3
"""
    Model for handling user registration,
    email verification, and login routes.
"""
from app.routes import app
from app.routes.utils import safe_api_request
from flask import (
    render_template, request, redirect, 
    url_for, jsonify, session, make_response
)
from flask_jwt_extended import set_access_cookies, unset_jwt_cookies
import requests
from uuid import uuid4
from models.storage import Storage
from models.lecturer import Lecturer


storage = Storage()

API_BASE_URL = 'http://127.0.0.1:5001/api/v1/auth'
URL_PREFIX = '/wisgrader'
template_directory = 'auth/'

@app.route(f'{URL_PREFIX}/account/signin', methods=['GET', 'POST'])
def signin():
    """Handle user login."""
    if request.method == 'GET':
        return render_template(f'{template_directory}login.html')

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
    url = f'{API_BASE_URL}/login'
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


@app.route(f'{URL_PREFIX}/account/signup', methods=['GET', 'POST'])
def signup():
    """Handle user registration."""
    if request.method == 'GET':
        return render_template(
            f'{template_directory}register.html', cache_id=uuid4()
        )

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

    user = storage.get_by_field(Lecturer, "email", email)
    storage.close()
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
    url = f'{API_BASE_URL}/send-token'
    res = requests.post(
        url,
        json={'email': email, 'name': f'{firstname} {lastname}'}
    )
    json_res = res.json()
    token = json_res.get('token')

    if token:
        return jsonify({'status': 'Success'}), 200
    return jsonify({'error': 'Internal Error Occured'}), 500


@app.route(f'{URL_PREFIX}/account/verify', methods=['GET', 'POST'])
def verify():
    """Verify the email using a token."""
    if request.method == 'GET':
        email = session.get('registration_data').get('email')
        data = {'email': email, 'cache_id': uuid4()}
        return render_template(f'{template_directory}verify_email.html', **data)

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
    url = f'{API_BASE_URL}/register'
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


@app.route(f'{URL_PREFIX}/account/forgot-password', methods=["GET", "POST"])
def forgot_password():
    """
    Render template for user to enter email,
    to get password reset link.
    """
    # ================ GET REQUEST ================== #
    if request.method == "GET":
        return render_template(
            f"{template_directory}forgot_pwd.html", cache_id=uuid4()
        )

    # ================ POST REQUEST ================== #
    # Recieved json of email and sent in request body.
    # To create a magic link and sent to email for password reset.
    data = request.get_json()

    email = data.get("email")

    # Set email in session to be proccess in account recovery route.
    session["email"] = email

    # Add url to append token to request body.
    rest_pwd_link = "http://127.0.0.1:5000/account/password-recovery"
    data["link"] = rest_pwd_link
    url = f'{API_BASE_URL}/password-recovery'
    json_response, status_code = safe_api_request(
        url, method='POST', params=data
    )
    if status_code == 200:
        jsonify({
            "status": "Success",
            "msg": "Link with Token Sent to Email"
        }), 200
    return json_response, status_code


@app.route(f'{URL_PREFIX}/account/password-recovery', methods=['GET', 'PUT'])
def password_recovery():
    """Routes definition for recovering user password."""

    # ================ GET REQUEST ================== #
    if request.method == 'GET':
        token = request.args.get("token") # Get the token from the url
        url = f'{API_BASE_URL}/verify-token'

        # Send request to API to validate token and,
        # Render template if valid.
        json_respons, status_code = safe_api_request(
                url, method='POST', params={"token": token}
        )
        if status_code == 200:
            return render_template(
                f"{template_directory}reset_pwd.html", cache_id=uuid4()
            )
        return jsonify({"error": "Invalid or Expired Token"}), 401


    # ================ PUT REQUEST ================== #
    # Retrive the password from the user form,
    # and the token which is in the hidden input field.
    if request.method == "PUT":
        body = request.get_json() # Get password from user

        # Retrieve email in session and add to request body
        email = session.get("email")
        body["email"] = email
        session.pop("email", None)
        body["email"] = email

        url = f'{API_BASE_URL}/password-recovery'
        json_response, status_code = safe_api_request(
            url, method='PUT', params=body
        )
        if status_code == 200:
            return jsonify({
                "status": "Success",
                "msg": "Password Reset Successfully"
            }), 200
        return json_response, status_code


@app.route(f"{URL_PREFIX}/account/logout")
def logout():
    """Clear set access_token from cookies."""
    response = make_response(redirect(url_for('app.signin')))
    unset_jwt_cookies(response)
    return response
