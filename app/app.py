#!/usr/bin/python3
""" Create Flask Application. """
from app.config import Config
from flask import Flask, jsonify
from app.routes import app as bp
from flask_jwt_extended import JWTManager
import sys
import os


# Setting up Flask Application.
app = Flask(__name__)
app.config.from_object(Config)

# Initialization of flask app
JWTManager(app)


# Register blueprint
app.register_blueprint(bp)

@app.errorhandler(404)
def not_found(error):
    """Handle 404 error in the application scope."""
    return jsonify({"error": "Not Found"}), 404


if __name__ == "__main__":
    app.run(debug=True, port=5000)
