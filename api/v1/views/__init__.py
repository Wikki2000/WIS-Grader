#!/usr/bin/python3
"""Create the blueprint of flask"""
from flask import Blueprint

app_views = Blueprint('app_views', __name__)

from api.v1.views.auth.login import *
from api.v1.views.auth.send_token import *
from api.v1.views.auth.register import *
from api.v1.views.auth.reset_password import *
from api.v1.views.index import *
from api.v1.views.course import *
from api.v1.views.lecturer import *
from api.v1.views.student import *
from api.v1.views.enrollment import *
