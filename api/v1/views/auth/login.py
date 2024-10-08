#!/usr/bin/python3

from flask import request, jsonify
from models.lecturer import Lecturer
from flask_jwt_extended import create_access_token
import datetime
from api.v1.views import app_views
from models.storage import Storage
from flasgger.utils import swag_from


@app_views.route('/auth/login', methods=['POST'])
@swag_from('../documentation/auth/login.yml')
def login():
    """Route for user login with JSON data."""

    # Parse JSON data from request
    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data provided"}), 400

    # Ensure all required fields are in the JSON data
    required_fields = ['email', 'password']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({
            "error": f"Missing fields: {' '.join(missing_fields)}"
        }), 400

    email = data['email']
    password = data['password']

    storage = Storage()
    session = storage.get_session()

    # Check if the user exists
    user = session.query(Lecturer).filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Create JWT token
    access_token = create_access_token(identity=user.id)

    # Return response with aceess token
    return jsonify(
            {
                "message": "Login successful",
                "status": "Success",
                "access_token": access_token,
                "user":
                    {
                        "email": email,
                        "id": user.id,
                        "name": user.first_name + " " + user.last_name
                    }
            }
        ), 200
