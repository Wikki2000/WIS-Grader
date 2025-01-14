#!/usr/bin/python3
"""Define function needed accross different files."""
from flask import request


def get_auth_headers():
    """
    Helper function to retrieve access token from cookie and set header
    """
    token = request.cookies.get('access_token_cookie')
    if not token:
        return None
    return {'Authorization': f'Bearer {token}'}
