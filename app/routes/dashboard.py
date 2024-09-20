#!/usr/bin/python3
""" Model for handling views for user dashboard. """
from app.routes import app
from app.routes.utils import safe_api_request, get_auth_headers
from flask import render_template, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import requests
from uuid import uuid4

API_BASE_URL = 'http://127.0.0.1:5001/api/v1' 


@app.route("/dashboard", methods=['GET'])
@app.route("/dashboard/<string:dashboard_section>", methods=['GET'])
@jwt_required()
def dashboard(dashboard_section=None):
    """Handle views for user dashboard."""
    headers = get_auth_headers()
    if not headers:
        return jsonify({"error": "Missing or Invalid Access Token"}), 401
    user_id = get_jwt_identity()
    url  = API_BASE_URL + '/lecturers'
    json_response, status_code = safe_api_request(url, "GET", headers=headers)
    email = json_response.get("email")
    first_name = json_response.get("first_name")
    last_name = json_response.get("last_name")
    data = {"email": email, "first_name": first_name,
            "last_name": last_name, "cache_id": uuid4()}
    if dashboard_section:
        template_dirctory = "/static_pages"
        return render_template(f"{template_dirctory}/{dashboard_section}.html", **data)
    return render_template("user_dashboard.html", **data)
