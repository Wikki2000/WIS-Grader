#!/usr/bin/python3
"""Handle sending token for email verification."""
from api.v1.views import api_views
from flask import request, jsonify, session
from flasgger.utils import swag_from
from api.v1.views.utils import (
        delete_token, validate_token, generate_token, send_mail, read_html_file
)
from models.user import User
from models import storage
from flask_jwt_extended import create_access_token, set_access_cookies


@api_views.route("/account/verify", methods=["POST"])
@swag_from("../documentation/auth/send_token.yml")
def verify_account():
    """Handle view for sending of token."""
    data = request.get_json()

    # Handle error on empty req, body
    if not data:
        return jsonify({"error": "Bad Request"}), 400

    # Handle missing field error
    required_fields = ["token"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"Bad Request"}), 400

    # Raise error if data not found in session.
    reg_data = session.get("registration_data")
    if not reg_data:
        raise ValueError("Registration data not found in session")

    # Register user delete token if valid.
    is_valid = validate_token(data.get("token"))
    if is_valid:
        user = User(**reg_data)
        password = reg_data.get("password")  # Get password from session.
        user.hash_password()  # Hash password
        storage.new(user)
        storage.save()

        # Return response with aceess token
        access_token = create_access_token(identity=user.id)
        response =  jsonify({"message": "Registration Successsfully."})
        set_access_cookies(response, access_token)  # Set JWT in cookie

        delete_token(data.get("token"))
        session.clear()

        return response, 200
    return jsonify({"message": "Registration Unsucessfully"}), 401
