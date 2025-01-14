#!/usr/bin/python3
""" Model for handling views for user dashboard. """
from app.routes import app_views
from flask import abort, render_template, request, jsonify
from api.v1.views.utils import role_required
from datetime import datetime


@app_views.route(f"/dashboard")
@role_required(["staff", "manager", "admin"])
def dashboarde(user_role: str, user_id: str):
    """"Render templates for user dashboard"""
    return render_template("dashboard/main_dashboard.html")
