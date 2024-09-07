#!/usr/bin/python3
"""This API Handles Registration of User."""
from api.v1.views import app_views
from flask import request, jsonify
from flasgger.utils import swag_from
from redis import Redis
from models.lecturer import Lecturer
from models import storage
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token

r = Redis(host="localhost", port=6379, db=0)


@app_views.route("/auth/register", methods=["POST"])
@swag_from("../documentation/auth/register.yml")
def register():
    """Handle view for registration of user"""
    data = request.get_json()

    if not data:
        return jsonify({"error": "Bad Request"}), 400

    required_fields = ["first_name", "last_name", "email", "password", "token"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} Field Missing"}), 400

    token = data.get("token")

    # Retrieved user data using dictionary comprehension
    registration_data = {
        key: data.get(key) for key in required_fields if key != "token"
    }

    if not r.get(token):
        return jsonify({"error": "Invalid or Expired Token"}), 422

    try:
        lecturer = Lecturer(**registration_data)
        lecturer.hash_password(lecturer.password)
        storage.new(lecturer)
        storage.save()
        r.delete(token)
        access_token = create_access_token(identity=lecturer.id)
        return jsonify({
            "status": "Success",
            "access_token": access_token,
            "msg": "Registration Successful"
        }), 200
    except IntegrityError:
        storage.rollback()
        return jsonify({"error": "User Exists Already"}), 409
    finally:
        storage.close()
