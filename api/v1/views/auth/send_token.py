#!/usr/bin/python3
"""Handle sending token for email verification."""
from api.v1.views import api_views
from flask import request, jsonify, session
from flasgger.utils import swag_from
from datetime import timedelta
from os import environ
import sib_api_v3_sdk
from redis import Redis
from random import randint
from api.v1.views.utils import generate_token, send_mail, read_html_file


@api_views.route("/account/send-token", methods=["POST"])
@swag_from("../documentation/auth/send_token.yml")
def send_token():
    """Handle view for sending of token."""
    data = request.get_json()

    # Handle error on empty req, body
    if not data:
        return jsonify({"error": "Bad Request"}), 400

    # Handle missing field error
    required_fields = ["email", "first_name", "last_name", "password"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"Bad Request"}), 400

    full_name = data.get("first_name") + " " + data.get("last_name")
    token = generate_token()

    # Send token to user for email verification
    recipient = {"name": full_name, "email": data.get("email")}
    file_path = "api/v1/views/auth/token_mail.html"
    place_holder = {"name": recipient["name"], "token": token}
    email_content = read_html_file(file_path, place_holder)
    email_subject = "[WISGrader] Complete your registration"
    response = send_mail(email_content, recipient, email_subject)
    if response:
        session["registration_data"] = data
        return jsonify({"message": "Token Sent Successfully"}), 200
    return jsonify({"error": "Token Delivery Failed"}), 500
