#!/usr/bin/python3
""" Create Flask Application. """
from app.config import Config
from flask import Flask, jsonify
from app.routes import app as bp
import sys
import os
from flask_jwt_extended import JWTManager

sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))

# Setting up Flask Application.
app = Flask(__name__)
app.config.from_object(Config)
app.config['JWT_TOKEN_LOCATION'] = ['cookies'] 
app.config['JWT_ACCESS_COOKIE_PATH'] = '/'  # Specify the cookie path
app.config['JWT_COOKIE_CSRF_PROTECT'] = False  # Optionally disable CSRF protection for development
app.config['JWT_COOKIE_SECURE'] = True  # Only transmit cookies over HTTPS
# Initialize the JWT Manager
jwt = JWTManager(app)

# Register blueprint
app.register_blueprint(bp)

@app.errorhandler(404)
def not_found(error):
    """Handle 404 error in the application scope."""
    return jsonify({"error": "Not Found"}), 404


if __name__ == "__main__":
    app.run(debug=True, port=5000)
