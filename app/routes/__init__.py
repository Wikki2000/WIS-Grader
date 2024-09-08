#!/usr/bin/python3
"""Create the blueprint of flask"""
from flask import Blueprint

app = Blueprint('app', __name__)

from app.routes.auth import *
from app.routes.dashboard import *
from app.routes.courses import *
