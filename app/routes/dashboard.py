#!/usr/bin/python3
""" Model for handling views for user dashboard. """
from app.routes import app
from flask import render_template, request, jsonify, url_for, abort, redirect
from flask_jwt_extended import jwt_required
import requests
from uuid import uuid4


@app.route("/dashboard", methods=['GET'])
@jwt_required()
def dashboard():
    """Render template for successfull email registration."""
    return "Welcome to WIS_Grader Dashboard"
