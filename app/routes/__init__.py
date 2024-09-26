#!/usr/bin/python3
"""Create the blueprint of flask"""
from flask import Blueprint

app = Blueprint('app', __name__)
static = Blueprint('static', __name__, template_folder='../web_static')

from app.routes.auth import *
from app.routes.dashboard import *
from app.routes.courses import *
from app.routes.static_pages import *
from app.routes.students import *
from app.routes.enrollments import *
