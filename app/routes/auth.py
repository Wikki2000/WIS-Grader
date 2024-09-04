#!/usr/bin/python3
""" Model for handling user registration, email verification, and login routes. """
from app.routes import app
from flask import render_template, request, redirect, url_for, jsonify
from flask import flash, session
import requests


@app.route('/register', methods=['GET', 'POST'])
def register():
    """Handle user registration."""
    if request.method == 'GET':
        return render_template('register.html')

    # Process the form data
    firstname = request.form['firstname']
    lastname = request.form['lastname']
    email = request.form['email']
    password = request.form['password']
    confirm_password = request.form['confirm_password']

    # Logic to handle registration
    if password == confirm_password:
        # Save data in the session
        session['registration_data'] = {
            'firstname': firstname,
            'lastname': lastname,
            'email': email,
            'password': password
        }

        # Retrieve email and name from session
        registration_data = session.get('registration_data')
        if not registration_data:
            flash("Error: No registration data found")
            return redirect(url_for('app.register'))

        email = registration_data['email']
        firstname = registration_data['firstname']
        lastname = registration_data['lastname']

        # Send verification token
        url = 'http://127.0.0.1:5001/api/v1/auth/send-token'
        res = requests.post(
            url,
            json={'email': email, 'name': f'{firstname} {lastname}'}
        )
        token = res.json().get('token')

        if token:
            print(token)
            # Redirect to email verification route
            return redirect(url_for('app.verify_email'))
        else:
            flash("Error: Could not send verification email")
            return redirect(url_for('app.register'))

    flash("Error: Passwords do not match")
    return render_template('register.html')


@app.route('/verify_email', methods=['GET', 'POST'])
def verify_email():
    """Verify the email using a token."""
    if request.method == 'GET':
        return render_template('verify_email.html')

    # Process the form data
    f1 = request.form.get('f1')
    f2 = request.form.get('f2')
    f3 = request.form.get('f3')
    f4 = request.form.get('f4')
    f5 = request.form.get('f5')
    f6 = request.form.get('f6')

    # Combine inputs into a single token
    token = f1 + f2 + f3 + f4 + f5 + f6

    # Retrieve registration data from session
    registration_data = session.get('registration_data')
    if not registration_data:
        flash("Error: No registration data found")
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
