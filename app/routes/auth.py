#!/usr/bin/python3

from app.routes import app
from flask import render_template, request, redirect, url_for, jsonify

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('register.html')

    # Process the form data here
    firstname = request.form['firstname']
    lastname = request.form['lastname']
    email = request.form['email']
    password = request.form['password']
    confirm_password = request.form['confirm_password']
        
    # logic to handle registration
    if password == confirm_password:
        return redirect(url_for('app.login'))
    return jsonify({"error": "password mismatch"})

@app.route('/login')
def login():
    return render_template('login.html')
