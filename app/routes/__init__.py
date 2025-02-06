#!/usr/bin/python3
"""Create Blueprint for Application Views."""
from flask import Blueprint

app_views = Blueprint("app_views", __name__)
web_static = Blueprint(
    "web_static", __name__, template_folder='../web_static'
)

from app.routes.auth import *
from app.routes.index import *
from app.routes.dashboard import *
