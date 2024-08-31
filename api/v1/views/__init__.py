#!/usr/bin/python3

from flask import Blueprint

app_views = Blueprint('app_views', __name__)

from api.v1.views.auth.register import *
from api.v1.views.index import *
