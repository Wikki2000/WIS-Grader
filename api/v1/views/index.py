#!/usr/bin/python3

from flask import jsonify
from . import app_views

@app_views.route('/status', methods=['GET'])
def status():
    """Return the status of the API."""
    return jsonify({"status": "OK"}), 200

@app_views.errorhandler(404)
def not_found_error(error):
    response = jsonify({
        'error': 'Not Found',
        'message': 'The requested URL was not found on the server.'
    })
    response.status_code = 404
    return response
