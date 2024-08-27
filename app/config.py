#!/usr/bin/python3
"""
Defines configuration settings for the Flask application.

The `Config` class serves as the base configuration, providing default settings
that can be inherited and overridden by environment-specific configurations.

Key configurations include:

- SECRET_KEY: Use for session management and other security-related features.
"""
from os import environ


class Config:
    """Base configuration."""
    SECRET_KEY = getenv("FLASK_SECRET_KEY")
