# backend/controllers/recommendation_controller.py
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import recommendations_col, assessments_col

class RecommendationController:
    @staticmethod
    def get_recommendation(assessment_id):
        """GET /api/recommendation/:assessment_id"""
        try:
            user_id = get_jwt_identity()
            
            # Ensure the parent assessment belongs to this user
            assessment = assessments_col.find_one({"assessment_id": assessment_id, "user_id": user_id})
            if not assessment:
                return jsonify({"message": "Assessment record not found or access denied."}), 404
                
            rec = recommendations_col.find_one({"assessment_id": assessment_id}, {"_id": 0})
            if not rec:
                return jsonify({"message": "No recommendations found for this assessment."}), 404
                
            return jsonify({
                "diet_plan": rec.get("diet_plan", []),
                "exercise_plan": rec.get("exercise_plan", []),
                "lifestyle_advice": rec.get("lifestyle_advice", [])
            }), 200
            
        except Exception as e:
            return jsonify({"message": "Error loading recommendations.", "error": str(e)}), 500
