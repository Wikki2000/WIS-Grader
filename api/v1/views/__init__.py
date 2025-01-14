#!/usr/bin/python3
"""Create the Blueprint of Flask"""
from flask import Blueprint

api_views = Blueprint('api_views', __name__)

from api.v1.views.auth.login import *
from api.v1.views.auth.logout import *
from api.v1.views.auth.password_recovery import *
from api.v1.views.auth.register import *
from api.v1.views.auth.send_token import *
from api.v1.views.auth.verify_account import *
