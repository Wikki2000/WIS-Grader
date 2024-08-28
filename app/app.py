#!/usr/bin/python3
""" Create Flask Application. """
from app.config import Config
from flask import Flask, jsonify

# Setting up Flask Application.
app = Flask(__name__)
app.config.from_object(Config)


@app.errorhandler(404)
def not_found(error):
    """Handle 404 error in the application scope."""
    return jsonify({"error": "Not found"}), 404


if __name__ == "__main__":
    app.run(debug=True, port=5001)
