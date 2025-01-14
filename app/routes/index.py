#!/usr/bin/python3
"""Handle API views."""
from flask import abort, jsonify, render_template
from flask_jwt_extended import jwt_required
from app.routes import app_views
from api.v1.views.utils import role_required
from jinja2.exceptions import TemplateNotFound


@app_views.route("/pages/<string:page>")
@role_required(["staff", "manager", "admin"])
def page(user_role: str, user_id: str, page: str):
    """Render any given pages pass as an arguements.
    
    :user_role - The role of logged-in user (e.g., ceo, staff or manager).
    :user_id: The ID of login user.
    :page - The HTML page to be rendered.
    """
    # Check and load page from corresponding directory.
    """
    DYNAMIC_PAGE_DIRECTORY = ""
    if user_role == "staff":
        DYNAMIC_PAGE_DIRECTORY = "staff_dynamic_pages/"
    elif user_role == "manager":
        DYNAMIC_PAGE_DIRECTORY = "manager_dynamic_pages/"
    elif user_role == "admin":
        DYNAMIC_PAGE_DIRECTORY = "ceo_dynamic_pages/"
    else:
        abort(404)
    """
    try:
        DYNAMIC_PAGE_DIRECTORY = 'dynamic_pages/'
        return render_template(f"{DYNAMIC_PAGE_DIRECTORY}{page}.html")
    except TemplateNotFound:
        abort(404)
