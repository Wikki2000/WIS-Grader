#!/usr/bin/env python3
"""
This module defines routes for managing course enrollment.
"""
from flask import jsonify, request, abort
from app.routes import app
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.routes.utils import get_auth_headers, safe_api_request
import requests


# Define the base API URL
API_BASE_URL = "http://127.0.0.1:5001/api/v1"
APP_URL_PREFIX = "/wisgrader"


@app.route(
    f"{APP_URL_PREFIX}/course/sudents/<string:student_id>/enroll-student",
    methods=["POST"]
)
def enroll_student(student_id):
    """Defines function for enrollment in a course."""
    data = request.get_json()

    url = f"{API_BASE_URL}/course/students/{student_id}/enroll"
    json_response, status_code = safe_api_request(
        url, method="POST", params=data
    )
    return json_response, status_code
