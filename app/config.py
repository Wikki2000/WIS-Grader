#!/usr/bin/python3
"""
Defines configuration settings for the Flask application.

The `Config` class serves as the base configuration, providing default settings
that can be inherited and overridden by environment-specific configurations.

Key configurations include:

- SECRET_KEY: Use for session management and other security-related features.
"""
from os import environ
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration."""
    SECRET_KEY = environ["FLASK_SECRET_KEY"]
    JWT_SECRET_KEY = environ['JWT_SECRET_KEY']
    JWT_TOKEN_LOCATION = ['cookies']
    JWT_ACCESS_COOKIE_PATH = '/'      # Specify the cookie path
    JWT_COOKIE_SECURE = True          # Only transmit cookies over HTTPS
