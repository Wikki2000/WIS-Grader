#!/usr/bin/python3
""" Model for handling user registration, email verification, and login routes. """
from app.routes import app
from flask import render_template, request, redirect, url_for, jsonify
from flask import flash, session
import requests
from uuid import uuid4


@app.route('/account/signup', methods=['GET', 'POST'])
def register():
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
    token = res.json().get('token')

    if token:
        return jsonify({'status': 'Success'}), 200
    return jsonify({'error': 'Internal Error Occured'}), 500



@app.route('/account/verify-email', methods=['GET', 'POST'])
def verify_email():
    """Verify the email using a token."""
    if request.method == 'GET':
        email = request.args.get("email")
        data = {'email': email, 'cache_id': uuid4()}
        return render_template('verify_email.html', **data)



    # Retrieve registration data from session
    registration_data = session.get('registration_data')
    if not registration_data:
        return redirect(url_for('app.register'))

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
        return render_template('confirm_email.html')
    else:
        print("Error: Verification failed", response.status_code)
        return render_template('verify_email.html')


@app.route('/account/signin')
def signin():
    """Render the login page."""
    return render_template('login.html')


@app.route('/account/signup')
def signup():
    """Redirect to the registration page."""
    return redirect(url_for('app.register'))


@app.route('/login')
def login():
    """Render the login page."""
    return render_template('login.html')
