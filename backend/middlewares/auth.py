# backend/middlewares/auth.py
from functools import wraps
from flask import jsonify, request
from flask_jwt_extended import verify_jwt_in_request, get_jwt

def role_required(allowed_roles):
    """Enforces specific user role verification claims on JWT tokens"""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request()
                claims = get_jwt()
                user_role = claims.get("role")
                if user_role not in allowed_roles:
                    return jsonify({"message": f"Access denied. Required permissions: {allowed_roles}"}), 403
            except Exception as e:
                return jsonify({"message": "Unauthorized: Invalid or missing token.", "details": str(e)}), 401
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator
