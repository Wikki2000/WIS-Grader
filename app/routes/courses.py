#!/usr/bin/python3
from flask import request, jsonify, make_response
import requests
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.routes import app

# Define the base API URL
API_BASE_URL = "http://127.0.0.1:5001/api/v1"


# Helper function to retrieve access token from cookie and set header
def get_auth_headers():
    token = request.cookies.get('access_token_cookie')
    if not token:
        return None
    return {'Authorization': f'Bearer {token}'}


# Route to handle POST (create course) and GET (retrieve courses)
@app.route("/courses", methods=["POST", "GET"])
@jwt_required()
def get_post_course():
    """
    Handle POST (create course) and GET (retrieve courses)
    """
    headers = get_auth_headers()
    if not headers:
        return jsonify(
            {
                'error': 'Missing or invalid access token'
            }
        ), 401

    if request.method == "POST":
        # Retrieve the JSON data from the request body
        data = request.get_json()

        # Make a POST request to the API to create a new course
        response = requests.post(
            f"{API_BASE_URL}/lecturer/courses",
            json=data,
            headers=headers
        )

        if response.status_code:
            return jsonify(response.json()), response.status_code

    # Make a GET request to the API to retrieve all courses for the lecturer
    response = requests.get(
        f"{API_BASE_URL}/lecturer/courses",
        headers=headers
    )

    # Check if the API response is successful (200)
    if response.status_code == 200:
        courses = response.json()
        # Wrap the array in a dictionary to include the status
        return jsonify(
            {
                'status': 'Success',
                'courses': courses
            }
        ), 200
    else:
        return jsonify({"error": response.status_code}), response.status_code
