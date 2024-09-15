#!/usr/bin/python3
"""
    Handle index view of Flask App and,
    some common routes accross it.
"""
from app.routes import app
from flask import abort, render_template


@app.route('/')
def home():
    """Render app landing page"""
    pass


@app.route("/static/<string:page>")
def template(page):
    """
    Responsible for rendering template that do not need
    further processing (e.g., Registration Success Page).

    :page => Html file to be render without including `.html`.
    """
    allowed_pages = [
        "reset-password-success", "modal-confirm-delete", "modal-success",
        "reset-password-email-sent", "email-confirmed", "modal-course-form",
        "modal-course-added-success",
    ]
    template_directory = "static_pages/"
    if page in allowed_pages:
        return render_template(template_directory + page + ".html")
    else:
        abort(404)
