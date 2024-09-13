#!/usr/bin/python3
from app.routes import app
from flask import request, jsonify, make_response
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.routes.utils import get_auth_headers
import requests

# Define the base API URL
API_BASE_URL = "http://127.0.0.1:5001/api/v1"


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

        return jsonify(response.json()), response.status_code

    # ===================== GET ================================ #
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
        return jsonify(
            {
                "error": "Unable to retrieve courses."
            }
        ), response.status_code


@app.route('/courses/<string:course_id>', methods=['DELETE', 'PUT'])
@jwt_required()
def put_del_course(course_id):
    """
    Handle DELETE and PUT (update) requests for a specific course by its ID.
    """

    lecturer_id = get_jwt_identity()

    headers = get_auth_headers()
    if not headers:
        return jsonify(
            {
                'error': 'Missing or invalid access token'
            }
        ), 401

    if request.method == 'DELETE':
        # Make a DELETE request to the external API to delete the course
        response = requests.delete(
            f"{API_BASE_URL}/courses/{course_id}",
            headers=headers
        )

        # Send API response back into client
        return jsonify(response.json()), response.status_code

    # Extract the data to be updated from the request body
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    # Make a PUT request to the external API to update the course
    response = requests.put(
        f"{API_BASE_URL}/courses/{course_id}",
        headers=headers,
        json=data
    )

    # Send API response back into client
    return jsonify(response.json()), response.status_code
