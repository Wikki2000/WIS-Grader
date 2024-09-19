#!/usr/bin/python3
from app.routes import app
from flask import request, jsonify, make_response
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.routes.utils import get_auth_headers, safe_api_request
import requests

# Define the base API URL
API_BASE_URL = "http://127.0.0.1:5001/api/v1"


@app.route("/students", methods=["POST"])
@jwt_required()
def create_student():
    """
    Handle POST (create student) and GET (retrieve students)
    """
    headers = get_auth_headers()
    if not headers:
        return jsonify(
            {
                'error': 'Missing or invalid access token'
            }
        ), 401

    # ===================== POST ================================ #
    if request.method == "POST":
        # Retrieve the JSON data from the request body
        data = request.get_json()

        # Make a POST request to the API to create a new student
        response = requests.post(
            f"{API_BASE_URL}/students",
            json=data,
            headers=headers
        )
        return jsonify(response.json()), response.status_code

    # ===================== GET ================================ #
    # Make a GET request to the API to retrieve all students for the lecturer
    #response = requests.get(
    #    f"{API_BASE_URL}/lecturer/courses",
    #    headers=headers
    #)

    # Check if the API response is successful (200)
    #if response.status_code == 200:
    #    courses = response.json()
        # Wrap the array in a dictionary to include the status
    #    return jsonify(
    #        {
    #            'status': 'Success',
    #            'courses': courses
    #        }
    #    ), 200
    #else:
    #    return jsonify(
    #        {
    #            "error": "Unable to retrieve courses."
    #        }
    #    ), response.status_code


@app.route('/students/<string:student_id>', methods=['DELETE', 'PUT', 'GET'])
@jwt_required()
def delete_update_student(student_id):
    """
    Handle DELETE and PUT (update) requests for a specific student by its ID.
    """
    headers = get_auth_headers()
    if not headers:
        return jsonify({'error': 'Missing or invalid access token'}), 401

    # ===================== GET ================================ #
    if request.method == 'GET':
        json_response, status_code = safe_api_request(
            f"{API_BASE_URL}/students/{student_id}", headers=headers
        )
        return json_response, status_code

    # ===================== DELETET ================================ #

    if request.method == 'DELETE':
        # Make a DELETE request to the external API to delete the student
        response = requests.delete(
            f"{API_BASE_URL}/students/{student_id}",
            headers=headers
        )

        # Send API response back into client
        return jsonify(response.json()), response.status_code

    # ===================== PUT ================================ #
    # Extract the data to be updated from the request body
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    # Make a PUT request to the external API to update the student
    response = requests.put(
        f"{API_BASE_URL}/students/{student_id}",
        headers=headers,
        json=data
    )

    # Send API response back into client
    return jsonify(response.json()), response.status_code
