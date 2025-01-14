#!/usr/bin/python3
"""This module handles users request to logout."""
from flask import redirect, jsonify
from flask_jwt_extended import (
    jwt_required, get_jwt_identity, unset_jwt_cookies
)
from models.user import User
from models import storage
from api.v1.views import api_views


@api_views.route("/account/logout", methods=["DELETE"])
@jwt_required()
def logout():
    """Clear set access_token from cookies."""
    user_id = get_jwt_identity()
    response = jsonify({
        "status": "Success",
        "msg": "Logout Successfully"
    })

    user =  storage.get_by(User, id=user_id)
    user.is_active = False
    storage.save()
    unset_jwt_cookies(response)
    return response, 200
