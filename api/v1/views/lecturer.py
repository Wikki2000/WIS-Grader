#!/usr/bin/python3
""" Handle User API CRUD operations. """
from . import app_views
from flask_jwt_extended import jwt_required, get_jwt_identity
from flasgger.utils import swag_from
from flask import abort, request, jsonify
from models.lecturer import Lecturer
from models.storage import Storage
from sqlalchemy.exc import IntegrityError

storage = Storage()


@app_views.route('/lecturers', methods=["GET"])
@jwt_required()
@swag_from('./documentation/courses/get_course.yml')
def get_lecturer():
    """
    Retrieve a lecturer object by it ID.
    """
    # Retrieve lecturer's ID from the JWT token
    lecturer_id = get_jwt_identity()
    print(lecturer_id)

    # Check if the lecturer exists
    user_obj = storage.get_by_field(Lecturer, "id", lecturer_id)
    if not user_obj:
        abort(404)
    lect_dict = user_obj.to_dict()
    return jsonify(lect_dict), 200


