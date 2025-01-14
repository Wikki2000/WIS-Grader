#!/usr/bin/python3
""" Model for handling views for user dashboard. """
from app.routes import app_views
from flask import abort, render_template, request, jsonify
from api.v1.views.utils import role_required
from datetime import datetime
from flask_jwt_extended import jwt_required

@app_views.route(f"/dashboard")
@jwt_required()
def dashboarde():
    """"Render templates for user dashboard"""
    return render_template("dashboard/main_dashboard.html")
