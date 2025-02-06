#!/usr/bin/python3
""" Handle User API CRUD operations. """
from . import api_views
from flask_jwt_extended import jwt_required, get_jwt_identity
from flasgger.utils import swag_from
from flask import abort, request, jsonify
from models.user import User
from models import storage


@api_views.route('/users', methods=["GET"])
@jwt_required()
@swag_from('./documentation/lecturers/get_by_id.yml')
def get_by_id():
    """
    Retrieve a user object by it ID.
    """
    # Retrieve lecturer's ID from the JWT token
    user_id = get_jwt_identity()

    # Check if the lecturer exists
    user_obj = storage.get_by(User, id=user_id)
    if not user_obj:
        abort(404)
    lect_dict = user_obj.to_dict()
    del lect_dict["password"] # Delete user password from json
    return jsonify(lect_dict), 200
