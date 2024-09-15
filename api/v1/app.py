#!/usr/bin/python3
"""Create Flask Appplication."""
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flasgger import Swagger
from api.v1.views import app_views
from api.v1.config import Config
from models.storage import Storage

# Initialize storage
storage = Storage()

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
jwt = JWTManager(app)
Swagger(app)

# Allow cross-origin requests from port 5000
cors = CORS(app, resources={
    r"/*": {
        "origins": "http://localhost:5000"
        }
    })

# Register blueprint
app.register_blueprint(app_views, url_prefix='/api/v1')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
