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

    :template => Path to html file to be render.
    """
    allowed_pages = ["reset-password-success", "reset-password-email-sent",
                     "email-confirmed"]
    template_directory = "static_pages/"
    if page in allowed_pages:
        return render_template(template_directory + page + ".html")
    else:
        abort(404)
