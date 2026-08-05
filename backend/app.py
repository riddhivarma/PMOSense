# backend/app.py
import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from database.db import init_db

def create_app():
    app = Flask(__name__)
    
    # Load settings config
    app.config.from_object(Config)
    
    # Configure CORS (allow access to api points from anywhere in development)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialize JWT Manager
    jwt = JWTManager(app)
    
    # Initialize Database collections, indexes, and admin account seeds
    init_db()
    
    # Register consolidated API Blueprint
    from routes.api import api_bp
    app.register_blueprint(api_bp)
    
    # Health check route
    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({
            "status": "healthy",
            "message": "PCOSENSE REST API Server is online."
        }), 200

    # Custom JWT Error behaviors
    @jwt.unauthorized_loader
    def unauthorized_response(callback):
        return jsonify({"message": "Missing authorization token."}), 401

    @jwt.invalid_token_loader
    def invalid_token_response(callback):
        return jsonify({"message": "Invalid authorization token."}), 401

    @jwt.expired_token_loader
    def expired_token_response(jwt_header, jwt_payload):
        return jsonify({"message": "Authorization token has expired."}), 401

    # Global status error boundaries
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"message": "Bad request parameters."}), 400

    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({"message": "Unauthorized request access."}), 401

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({"message": "Forbidden access."}), 403

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"message": "Requested API endpoint not found."}), 404

    @app.errorhandler(422)
    def unprocessable_entity(e):
        return jsonify({"message": "Unprocessable entity payload validations failed."}), 422

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"message": "Internal server error occurred."}), 500

    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Launching PCOSENSE Backend API on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=True)
