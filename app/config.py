#!/usr/bin/python3
"""
Defines configuration settings for the Flask application.

The `Config` class serves as the base configuration, providing default settings
that can be inherited and overridden by environment-specific configurations.

Key configurations include:

- SECRET_KEY: Use for session management and other security-related features.
- JWT_SECRET_KEY: Use for jwt Authentication
- JWT_TOKEN_LOCATION: Give location where jwt token can me retrieve for authentication
- JWT_COOKIE_SECURE: Ensure that cookies only transmitted over https/http
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Base configuration."""
    SECRET_KEY = environ["FLASK_SECRET_KEY"]
    JWT_SECRET_KEY = os.environ['JWT_SECRET_KEY']
    JWT_TOKEN_LOCATION = ['cookies'] 
    JWT_COOKIE_CSRF_PROTECT = False
    JWT_COOKIE_SECURE = True
