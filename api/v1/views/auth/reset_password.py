#!/usr/bin/python3
"""Handles password reset from users."""
from api.v1.views import app_views
from api.v1.views.auth.send_token import fwd_token, read_html_file
from flask import abort, request,url_for, jsonify
from models import storage
from models.lecturer import Lecturer
from flasgger.utils import swag_from
from flask_jwt_extended import create_access_token, decode_token, exceptions
from datetime import timedelta


@app_views.route("/auth/verify-token", methods=["POST"])
@swag_from(
    "../documentation/auth/password_recovery/verify_link_token.yml"
)
def verify_token():
    """Verify if token append to reset link url is valid."""
    if "token" not in request.get_json():
        return jsonify({"error": "token Field Required"}), 400

    try:
        token = request.get_json().get("token")
        decoded_token = decode_token(token)
        return jsonify({"status": "Success", "msg": "Token is Valid"}), 200
    except exceptions.JWTDecodeError:
        return jsonify({"error": "Invalid or Expired Token"}), 401
    except Exception as e:
        return jsonify({"error": f"An Error Occured: {str(e)}"}), 500


@app_views.route("/auth/password-recovery", methods=["POST"])
@swag_from(
    "../documentation/auth/password_recovery/sent_pwd_reset_link.yml"
)
def pwd_reset_link():
    """Append access token to url to ensure integrity ."""

    # Handle missing field error
    data = request.get_json()
    if "email" not in data or "link" not in data:
        return jsonify({"error": f"Bad Request"}), 400

    email = data.get("email")
    link = data.get("link")

    lecturer = storage.get_by_field(Lecturer, "email", email)
    if not lecturer:
        abort(404)

    mins = 60
    expiring_time = timedelta(minutes=mins)

    # Create access_token and append to url
    token = create_access_token(
        identity=email, expires_delta=expiring_time
    )
    reset_link = link + "?token=" + token
    is_true = fwd_token(reset_link, {"email": email})

    if is_true:
        return jsonify({
            "status": "Success",
            "msg": "Token Successfully Sent to Email",
            "token": reset_link
        }), 200
    return jsonify({"error": "Token Delivery Failed"}), 500


@app_views.route("/auth/password-recovery", methods=["PUT"])
@swag_from(
    "../documentation/auth/password_recovery/sent_pwd_reset_link.yml"
)
def update_password():
    """Update new password to database as enter by user."""

    body = request.get_json()

    if "password" not in body or "email" not in body:
        return jsonify({"error": f"Bad Request"}), 400

    password = request.get_json().get("password")
    email = request.get_json().get("email")
    lecturer = storage.get_by_field(Lecturer, "email", email)
    if not lecturer:
        abort(404)

    lecturer.password = password
    lecturer.hash_password(password)
    storage.save()
    return jsonify({
         "id": lecturer.id,
         "first_name": lecturer.first_name,
         "last_name": lecturer.last_name,
         "email": lecturer.email
    }), 200
