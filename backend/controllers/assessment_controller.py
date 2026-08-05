# backend/controllers/assessment_controller.py
import datetime
import uuid
from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from database.db import assessments_col, recommendations_col, users_col
from services.predict_service import PredictService
from services.recommendation_service import RecommendationService

class AssessmentController:
    @staticmethod
    def create_assessment():
        """POST /api/assessment and POST /api/predict"""
        try:
            user_id = get_jwt_identity()
            data = request.get_json() or {}
            
            # Input extraction
            age = data.get('age')
            height = data.get('height')
            weight = data.get('weight')
            menstrual_cycle = data.get('menstrual_cycle')
            cycle_length = data.get('cycle_length')
            blood_group = data.get('blood_group', 'O+') # Defaulting to 'O+' if not provided
            
            # Binary indicators
            weight_gain = data.get('weight_gain', False)
            hair_growth = data.get('hair_growth', False)
            hair_loss = data.get('hair_loss', False)
            skin_darkening = data.get('skin_darkening', False)
            pimples = data.get('pimples', False)
            fast_food = data.get('fast_food', False)
            regular_exercise = data.get('regular_exercise', True)

            # Validations
            if age is None or height is None or weight is None or cycle_length is None or menstrual_cycle is None:
                return jsonify({"message": "Age, height, weight, menstrual cycle, and cycle length are required."}), 422
            
            try:
                age = int(age)
                height = float(height)
                weight = float(weight)
                cycle_length = int(cycle_length)
                menstrual_cycle = int(menstrual_cycle)
                
                if age < 15 or age > 55:
                    return jsonify({"message": "Age must be between 15 and 55."}), 422
                if height < 100 or height > 220:
                    return jsonify({"message": "Height must be between 100 and 220 cm."}), 422
                if weight < 30 or weight > 180:
                    return jsonify({"message": "Weight must be between 30 and 180 kg."}), 422
                if cycle_length < 15 or cycle_length > 120:
                    return jsonify({"message": "Cycle length must be between 15 and 120 days."}), 422
            except ValueError:
                return jsonify({"message": "Invalid numeric input formats."}), 422

            # Calculate BMI
            bmi = round(weight / ((height / 100) ** 2), 2)
            
            # Calculate Health Score
            score_val = 0
            if int(menstrual_cycle) == 1: score_val += 35
            if weight_gain: score_val += 20
            if hair_growth: score_val += 15
            if skin_darkening: score_val += 15
            if pimples: score_val += 10
            if hair_loss: score_val += 10
            if fast_food: score_val += 5
            if not regular_exercise: score_val += 5
            if bmi >= 25.0: score_val += 5
            health_score = max(100 - score_val, 15)

            # Build prediction inputs dict
            predict_inputs = {
                'age': age,
                'weight': weight,
                'height': height,
                'bmi': bmi,
                'blood_group': blood_group,
                'menstrual_cycle': menstrual_cycle,
                'cycle_length': cycle_length,
                'weight_gain': weight_gain,
                'hair_growth': hair_growth,
                'hair_loss': hair_loss,
                'skin_darkening': skin_darkening,
                'pimples': pimples,
                'fast_food': fast_food,
                'regular_exercise': regular_exercise
            }

            # Execute machine learning model prediction
            prediction_result, confidence_score, probability = PredictService.evaluate_risk(predict_inputs)

            # Save Assessment
            assessment_id = str(uuid.uuid4())
            new_assessment = {
                "assessment_id": assessment_id,
                "user_id": user_id,
                "assessment_date": datetime.datetime.utcnow().isoformat(),
                "age": age,
                "height": height,
                "weight": weight,
                "bmi": bmi,
                "blood_group": blood_group,
                "menstrual_cycle": menstrual_cycle,
                "cycle_length": cycle_length,
                "weight_gain": weight_gain,
                "hair_growth": hair_growth,
                "hair_loss": hair_loss,
                "skin_darkening": skin_darkening,
                "pimples": pimples,
                "fast_food": fast_food,
                "regular_exercise": regular_exercise,
                "prediction_result": prediction_result,
                "confidence_score": confidence_score,
                "probability": probability,
                "health_score": health_score
            }
            assessments_col.insert_one(new_assessment)

            # Update User vitals automatically
            users_col.update_one(
                {"user_id": user_id},
                {"$set": {"age": age, "height": height, "weight": weight, "bmi": bmi}}
            )

            # Generate Recommendations
            rec_plans = RecommendationService.generate_recommendations(predict_inputs)
            recommendation_id = str(uuid.uuid4())
            new_rec = {
                "recommendation_id": recommendation_id,
                "assessment_id": assessment_id,
                "diet_plan": rec_plans["diet_plan"],
                "exercise_plan": rec_plans["exercise_plan"],
                "lifestyle_advice": rec_plans["lifestyle_advice"],
                "medical": rec_plans.get("medical", [])
            }
            recommendations_col.insert_one(new_rec)

            return jsonify({
                "message": "Assessment successfully evaluated.",
                "assessment_id": assessment_id,
                "prediction_result": prediction_result,
                "confidence_score": confidence_score,
                "bmi": bmi,
                "recommendations": rec_plans
            }), 201

        except Exception as e:
            return jsonify({"message": "Error creating assessment prediction.", "error": str(e)}), 500

    @staticmethod
    def _format_assessment(asm, rec):
        # We append Z to denote UTC time so frontend parses it correctly in local time
        date_iso = asm.get("assessment_date", "")
        if date_iso and not date_iso.endswith("Z"):
            date_iso += "Z"

        return {
            "id": asm.get("assessment_id"),
            "user_id": asm.get("user_id"),
            "date": date_iso,
            "inputs": {
                "age": asm.get("age"),
                "height": asm.get("height"),
                "weight": asm.get("weight"),
                "bmi": asm.get("bmi"),
                "blood_group": asm.get("blood_group", "O+"),
                "cycle": asm.get("menstrual_cycle"),
                "cycle_length": asm.get("cycle_length"),
                "weight_gain": asm.get("weight_gain"),
                "hair_growth": asm.get("hair_growth"),
                "hair_loss": asm.get("hair_loss"),
                "skin_darkening": asm.get("skin_darkening"),
                "pimples": asm.get("pimples"),
                "fast_food": asm.get("fast_food"),
                "reg_exercise": asm.get("regular_exercise")
            },
            "prediction": {
                "risk_level": asm.get("prediction_result"),
                "probability": asm.get("probability", 0.5),
                "confidence_score": asm.get("confidence_score")
            },
            "health_score": asm.get("health_score", 50),
            "recommendations": {
                "diet": rec.get("diet_plan", []) if rec else [],
                "exercise": rec.get("exercise_plan", []) if rec else [],
                "lifestyle": rec.get("lifestyle_advice", []) if rec else [],
                "medical": rec.get("medical", []) if rec else []
            }
        }

    @staticmethod
    def get_history():
        """GET /api/assessment/history"""
        try:
            user_id = get_jwt_identity()
            history_cursor = assessments_col.find({"user_id": user_id}).sort("assessment_date", -1)
            formatted_history = []
            for asm in history_cursor:
                rec = recommendations_col.find_one({"assessment_id": asm["assessment_id"]})
                formatted_history.append(AssessmentController._format_assessment(asm, rec))
            return jsonify(formatted_history), 200
        except Exception as e:
            return jsonify({"message": "Error loading assessment history.", "error": str(e)}), 500

    @staticmethod
    def get_assessment(id):
        """GET /api/assessment/:id"""
        try:
            user_id = get_jwt_identity()
            assessment = assessments_col.find_one({"assessment_id": id, "user_id": user_id})
            if not assessment:
                return jsonify({"message": "Assessment record not found."}), 404
            
            rec = recommendations_col.find_one({"assessment_id": id})
            return jsonify(AssessmentController._format_assessment(assessment, rec)), 200
        except Exception as e:
            return jsonify({"message": "Error loading assessment.", "error": str(e)}), 500

    @staticmethod
    def delete_assessment(id):
        """DELETE /api/assessment/:id"""
        try:
            user_id = get_jwt_identity()
            # Ensure assessment belongs to user
            assessment = assessments_col.find_one({"assessment_id": id, "user_id": user_id})
            if not assessment:
                return jsonify({"message": "Assessment record not found."}), 404

            # Delete assessment and recommendations matching
            assessments_col.delete_one({"assessment_id": id})
            recommendations_col.delete_one({"assessment_id": id})
            
            return jsonify({"message": "Assessment record successfully removed."}), 200
        except Exception as e:
            return jsonify({"message": "Error deleting assessment.", "error": str(e)}), 500
