#!/usr/bin/python3
"""This modules defines helper function for API"""
from flask import abort, request, jsonify
from datetime import timedelta
from os import environ
import sib_api_v3_sdk
from random import randint
from dotenv import load_dotenv
from models import storage
from functools import wraps
from flask_jwt_extended import get_jwt, jwt_required, get_jwt_identity
from typing import(
    Any, Dict, Union, Optional, List, Tuple, Callable, TypeVar
)
from redis import Redis
import base64


r = Redis(host="localhost", port=6379, db=0)  # Create Redis instance
load_dotenv()   # Load environ variables
F = TypeVar("F", bound=Callable[..., any])  # Generic type for callable


# =================================================== #
#               Email Sending Helper Function         #
# =================================================== #
def send_mail(
    mail: str, kwargs: Dict[str, str],
    mail_subject="[WISGrader]"
) -> bool:
    """Send token to email.

    Args:
        mail (string): The mail to be sent
        kwargs (dict): Key-value pairs of recipient info.

    Return:
        bool: True if email successfully delivered, else false.
    """
    config = sib_api_v3_sdk.Configuration()
    config.api_key["api-key"] = environ["MAIL_API_KEY"]

    # Create an instance of the API class
    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
        sib_api_v3_sdk.ApiClient(config)
    )

    sender = {
        "name": "William's Court Hotel",
        "email": environ["SENDER_EMAIL"]
    }
    email_subject = mail_subject
    recipient = [kwargs]

    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=recipient, sender=sender, subject=email_subject,
        html_content=mail
    )
    try:
        api_response = api_instance.send_transac_email(send_smtp_email)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
    except Exception:
        return False


def read_html_file(
        file_path: str, placeholders: Dict[Any, Any] = None
) -> str:
    """
    Read email from file and substitue placeholder if given.

    :placeholders - Dict. of placeholder (key) and value to be interpolated
    :return - The email content of file
    """
    with open(file_path, "r") as f:
        content = f.read()

    # Replace content with placeholder
    if placeholders:
        for key, val in placeholders.items():
            content = content.replace(f"[ {key} ]", val)
    return content


# =============================================#
#       Authentication Helper Function         #
# ============================================ #
def role_required(roles: List[str]) -> Callable[[F], F]:
    """
    Decorator to enforce role-based access control for routes.

    Args:
        roles (List[str]): A list of roles allowed to access the route.

    Returns:
        Callable[[F], F]: The decorated function with access control.
    """
    def decorator(func: F) -> F:
        @wraps(func)
        @jwt_required()  # Ensures JWT authentication is applied
        def wrapper(*args, **kwargs) -> Tuple[Dict, int]:
            """
            Wrapper function to validate user role and identity.

            Args:
                *args: Positional arguments passed to the decorated function.
                **kwargs: Keyword arguments passed to the decorated function.
            """
            # Extract claims and user identity
            claims = get_jwt()
            user_id = get_jwt_identity()  # Retrieve the user ID
            user_role = claims.get("role")

            # Inject as a keyword argument
            kwargs['user_role'] = user_role
            kwargs['user_id'] = user_id

            # Check if the user's role is allowed
            if user_role not in roles:
                abort(403)

            # Pass user_id and allow kwargs to include dynamic route arguments
            return func(*args, **kwargs)
        return wrapper
    return decorator


def generate_token(mins: int = 60) -> str:
    """
    Create random numbers and cache in redis db.

    :mins - Expiration time in minute for token
    :return - The token generated
    """
    expiring_time = timedelta(minutes=mins)
    token = str(randint(100000, 999999))
    r.setex(token, expiring_time, "valid")
    return token


def validate_token(token: str) -> bool:
    """
    Check if token is valid

    :token - Token whooose validity is checked.
    :return - True if token is valid, else false.
    """
    if r.get(token):
        return True
    return False

def delete_token(token: str) -> bool:
    """Remove cache token in redis
    """
    return r.delete(token)


# =============================================#
#       Common API Helper Function             #
# ============================================ #
def bad_request(
    data: Dict, required_fields: List[Any]
) -> Optional[Dict[str, str]]:
    """Handle response for Bad Request (400) error.

    :data - The request body to API endpoint.
    :required_fields - Required fields in request body.
    """
    if not data:
        return {"error": "Empty Request Body"}
    for field in required_fields:
        if not data.get(field):
            return {"error": f"{field} is required"}
    return None


def convert_to_binary(base64_string: str) -> bytes:
    """Convert Base64String of photo to Binary."""
    if not base64_string:
        return None
    if base64_string.startswith('data:image'):
        base64_string = base64_string.split(',')[1]  # Remove the prefix
        img_binary_data = base64.b64decode(base64_string)  # Decode to binary.
    return img_binary_data
