#!/usr/bin/python3
"""
    Handle index view of Flask App and,
    some common routes accross it.
"""
#from app.routes import app
from flask import abort, render_template, request
from app.routes.utils import safe_api_request
from app.routes import static


def is_authorize():
    """
        Helper function to check if user is authenticated,
        So as to prevent user from accessing unauthorized pages
    """
    token = request.cookies.get("access_token")
    url = 'http://127.0.0.1:5001/auth/verify-token'
    return safe_api_request(url, "POST", params=token, timeout=30)


@static.route("/web_static/<string:page>")
def template(page):
    """
    Responsible for rendering template that do not need
    further processing (e.g., Registration Success Page).

    :page => Html file to be render without including `.html`.
    """

    # Pages that do not require authentication
    public_pages = [
        "reset-password-success", "modal-confirm-delete", "modal-success",
        "reset-password-email-sent", "email-confirmed",
        "modal-course-added-success", "loading",
    ]

    # Pages that require authentication
    authenticated_pages = [
        "modal-course-form.html", "modal-student-form.html",
        "modal-enrollment-form.html"
    ]

    #template_directory = "web_static/"
    if page in public_pages:
        #return render_template(template_directory + page)
        return render_template(page)
    elif page in authenticated_pages:
        if is_authorize:
            return render_template(page)
            #return render_template(template_directory + page)
        else:
            abort(404)
    else:
        abort(404)
