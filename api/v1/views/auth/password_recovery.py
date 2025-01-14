#!/usr/bin/python3
"""Handles password reset from users."""
from api.v1.views import api_views
from flask import abort, request,url_for, jsonify, session
from models import storage
from models.user import User
from flasgger.utils import swag_from
from datetime import timedelta
from api.v1.views.utils import (
    bad_request, read_html_file, send_mail,
    generate_token, validate_token, delete_token
)
from flask_jwt_extended import (
    create_access_token, get_jwt_identity,
    jwt_required, set_access_cookies, unset_jwt_cookies
)


@api_views.route("/account/reset-token", methods=["POST"])
@swag_from('../documentation/auth/send_token.yml')
def pwd_reset_token():
    """Send OTP to email for password recovery"""

    # Handle missing field error
    data = request.get_json()

    # Handle Bad Request Error
    required_fields = ["email"]
    response = bad_request(data, required_fields)
    if response:
        return jsonify(response), 400

    # Check if user with email exists
    email = data.get("email")
    user = storage.get_by(User, email=email)
    if not user:
        abort(404)

    token = generate_token()
    name = user.first_name + " " + user.last_name
    file_name = "api/v1/views/auth/mail.html"
    placeholders = {"name": name, "token": token}
    email_content = read_html_file(file_name, placeholders)
    mail_reciever = {"name": name, "email": email}
    is_sent = send_mail(email_content, mail_reciever)
    if is_sent:
        access_token = create_access_token(identity=email)
        response = jsonify({"message": "Token Sent to Email"})
        set_access_cookies(response, access_token)  # Set JWT in cookie
        return response, 200
    return jsonify({"error": "Token Delivery Failed"}), 500


@api_views.route("/account/validate-token", methods=["POST"])
@swag_from('../documentation/auth/validate_token.yml')
@jwt_required()
def validate_token():
    """Check if token is valid"""
    data = request.get_json()
    email = get_jwt_identity()
    
    required_fields = ["token"]
    response = bad_request(data, required_fields)
    if response:
        return jsonify(response), 400
    token = data.get("token")

    if validate_token(token):
        delete_token(token)
        return jsonify({
            "status": "Success",
            "message": "Token is Valid"
        }), 200
    else:
        return jsonify({"error": "Invalid or Expired Token"}), 401


@api_views.route("/account/reset-password", methods=["PUT"])
@swag_from('../documentation/auth/update_password.yml')
@jwt_required()
def update_password():
    """Update new password to database as enter by user."""
    data = request.get_json()
    email = get_jwt_identity()
    print(email)

    # Handle 400 error
    required_fields = ["password"]
    response = bad_request(data, required_fields)
    if response:
        return jsonify(response), 400

    user = storage.get_by(User, email=email)
    if not user:
        abort(404)

    password = data.get("password")
    user.password = password
    user.hash_password()
    storage.save()
    response = jsonify({"message": "Password Reset Success"})
    unset_jwt_cookies(response)
    return response, 200
