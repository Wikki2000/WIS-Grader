#!/usr/bin/python3
"""Handle sending token for email verification."""
from api.v1.views import app_views
from flask import request, jsonify
from flasgger.utils import swag_from
from datetime import timedelta
from os import environ
import sib_api_v3_sdk
from redis import Redis
from random import randint
from dotenv import load_dotenv

load_dotenv()
r = Redis(host="localhost", port=6379, db=0)


@app_views.route("/auth/send-token", methods=["POST"])
@swag_from("../documentation/auth/send_token.yml")
def send_token():
    """Handle view for sending of token."""
    data = request.get_json()

    # Handle error on empty req, body
    if not data:
        return jsonify({"error": "Bad Request"}), 400

    # Handle missing field error
    required_fields = ["email", "name"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"Bad Request"}), 400

    # Genrate token and store in redis db temporarily
    token = generate_token()
    mins = 60
    expiring_time = timedelta(minutes=mins)
    r.setex(token, expiring_time, "valid")

    # Send token to user for email verification
    recipient = {"name": data.get("name"), "email": data.get("email")}
    file_path = "api/v1/views/auth/email_content.html"
    email_content = read_html_file(file_path, recipient["name"], token)
    response = fwd_token(email_content, recipient)
    if response:
        return jsonify({
            "status": "Success",
            "token": token,
            "expiring_time": f"{mins} minute"
        })
    return jsonify({"error": "Token Delivery Failed"}), 500


# ------------------HelperFunctionDefinition------------------ #

def generate_token():
    """Return a 6 digit random numbers."""
    return str(randint(100000, 999999))


def fwd_token(mail, kwargs):
    """Send token to email.

    Args:
        token (string): The 6-digit email confirmation token.
        mail (string): The mail to be sent.
        kwargs (dict): Key-value pairs of recipient info.
    """
    config = sib_api_v3_sdk.Configuration()
    config.api_key["api-key"] = environ["MAIL_API_KEY"]

    # Create an instance of the API class
    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
        sib_api_v3_sdk.ApiClient(config)
    )
    email = environ["SENDER_EMAIL"]
    sender = {"name": "WIS_Grader", "email": email}
    email_subject = "[Wis_Grader] Complete your registration"
    recipient = [kwargs]

    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=recipient, sender=sender, subject=email_subject,
        html_content=mail
    )
    try:
        api_response = api_instance.send_transac_email(send_smtp_email)
        return True
    except Exception:
        return False


def read_html_file(file_path, name, token):
    """Read email from file and substitue placeholder."""
    with open(file_path, "r") as f:
        content = f.read()

    # Replace content with placeholder
    content = content.replace("{{ name }}", name).replace("{{ token }}", token)
    return content
