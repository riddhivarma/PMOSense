# backend/controllers/consultation_controller.py
import datetime
import uuid
from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from database.db import consultations_col, doctors_col, users_col

class ConsultationController:
    @staticmethod
    def get_approved_doctors():
        """GET /api/doctors"""
        try:
            docs = list(doctors_col.find({"is_approved": True}, {"password": 0, "_id": 0}))
            return jsonify(docs), 200
        except Exception as e:
            return jsonify({"message": "Error retrieving doctors.", "error": str(e)}), 500

    @staticmethod
    def create_consultation():
        """POST /api/consultation"""
        try:
            user_id = get_jwt_identity()
            data = request.get_json() or {}
            doctor_id = data.get('doctor_id')
            question = data.get('question', '').strip()

            if not question:
                return jsonify({"message": "Question content is required."}), 422
            
            if len(question) < 10:
                return jsonify({"message": "Question must be at least 10 characters long."}), 422

            # Check if doctor exists and is approved
            if doctor_id:
                doc = doctors_col.find_one({"doctor_id": doctor_id, "is_approved": True})
                if not doc:
                    return jsonify({"message": "Selected doctor is invalid or not verified."}), 400

            consultation_id = str(uuid.uuid4())
            new_consult = {
                "consultation_id": consultation_id,
                "user_id": user_id,
                "doctor_id": doctor_id, # Can be null for general pool
                "question": question,
                "reply": "",
                "status": "pending",
                "consultation_date": datetime.datetime.utcnow().isoformat()
            }
            consultations_col.insert_one(new_consult)

            return jsonify({"message": "Consultation query submitted successfully.", "consultation_id": consultation_id}), 201

        except Exception as e:
            return jsonify({"message": "Error creating consultation.", "error": str(e)}), 500

    @staticmethod
    def get_user_consultations():
        """GET /api/consultation/user"""
        try:
            user_id = get_jwt_identity()
            # Fetch consultations and join doctor names
            consults = list(consultations_col.find({"user_id": user_id}, {"_id": 0}).sort("consultation_date", -1))
            
            for c in consults:
                if c.get("doctor_id"):
                    doc = doctors_col.find_one({"doctor_id": c["doctor_id"]})
                    c["doctor_name"] = doc["name"] if doc else "General Practitioner"
                else:
                    c["doctor_name"] = "General Medical Pool"
            
            return jsonify(consults), 200
        except Exception as e:
            return jsonify({"message": "Error retrieving consultations.", "error": str(e)}), 500

    @staticmethod
    def get_doctor_consultations():
        """GET /api/consultation/doctor"""
        try:
            doctor_id = get_jwt_identity()
            # Doctors see queries explicitly assigned to them or pool queries (doctor_id is null)
            queries = list(consultations_col.find(
                {"$or": [{"doctor_id": doctor_id}, {"doctor_id": None, "status": "pending"}]}, 
                {"_id": 0}
            ).sort("consultation_date", -1))

            for q in queries:
                usr = users_col.find_one({"user_id": q["user_id"]})
                q["user_name"] = usr["name"] if usr else "Anonymous Patient"

            return jsonify(queries), 200
        except Exception as e:
            return jsonify({"message": "Error retrieving queries.", "error": str(e)}), 500

    @staticmethod
    def reply_consultation():
        """PUT /api/consultation/reply"""
        try:
            doctor_id = get_jwt_identity()
            data = request.get_json() or {}
            consultation_id = data.get('consultation_id')
            reply = data.get('reply', '').strip()

            if not consultation_id or not reply:
                return jsonify({"message": "Consultation ID and reply content are required."}), 422
            
            if len(reply) < 10:
                return jsonify({"message": "Reply must be at least 10 characters long."}), 422

            # Find consultation
            consult = consultations_col.find_one({"consultation_id": consultation_id})
            if not consult:
                return jsonify({"message": "Consultation record not found."}), 404

            # Enforce that query is assigned to this doctor or is a general query
            if consult.get("doctor_id") and consult["doctor_id"] != doctor_id:
                return jsonify({"message": "This consultation is assigned to another specialist."}), 403

            # Update
            result = consultations_col.update_one(
                {"consultation_id": consultation_id},
                {"$set": {
                    "reply": reply,
                    "status": "resolved",
                    "doctor_id": doctor_id, # Set in case it was a general pool query
                    "resolved_at": datetime.datetime.utcnow().isoformat()
                }}
            )

            return jsonify({"message": "Reply successfully posted."}), 200

        except Exception as e:
            return jsonify({"message": "Error replying to query.", "error": str(e)}), 500
