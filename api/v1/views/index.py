#!/usr/bin/python3
"""Handle API views."""
from flask import jsonify, make_response
from . import app_views
import json


@app_views.route('/status', methods=['GET'])
def status():
    """Return the status of the API."""
    return jsonify({"status": "OK"}), 200


# Use app_errorhandler to register the handler globall
@app_views.app_errorhandler(404)
def not_found_error(error):
    response = {"error": "Not Found"}
    # Create a JSON response with indentation
    response_json = json.dumps(response, indent=2) + "\n"
    return make_response(
            response_json, 404,
            {'Content-Type': 'application/json'}
    )
