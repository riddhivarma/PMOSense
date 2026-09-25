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
            import os
            from config import Config
            from werkzeug.utils import secure_filename

            user_id = get_jwt_identity()
            
            # Handle both JSON and FormData
            if request.is_json:
                data = request.get_json() or {}
            else:
                data = request.form

            doctor_id = data.get('doctor_id')
            if doctor_id == "null" or not doctor_id:
                doctor_id = None
                
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

            file_paths = []
            files = request.files.getlist('files') or request.files.getlist('files[]')
            if files:
                if len(files) > 2:
                    return jsonify({"message": "Maximum 2 PDF files allowed."}), 422
                for file in files:
                    if file.filename:
                        if not file.filename.lower().endswith('.pdf'):
                            return jsonify({"message": "Only PDF files are allowed."}), 422
                            
                        file.seek(0, os.SEEK_END)
                        file_length = file.tell()
                        if file_length > 1024 * 1024:
                            return jsonify({"message": "Each PDF file size must be less than 1MB."}), 422
                        file.seek(0)
                        
                        upload_dir = os.path.join(Config.UPLOAD_FOLDER, 'consultations')
                        os.makedirs(upload_dir, exist_ok=True)
                        
                        ext = file.filename.rsplit('.', 1)[1].lower()
                        unique_filename = f"{uuid.uuid4().hex}.{ext}"
                        save_path = os.path.join(upload_dir, unique_filename)
                        file.save(save_path)
                        
                        file_paths.append(f"consultations/{unique_filename}")

            consultation_id = str(uuid.uuid4())
            new_consult = {
                "consultation_id": consultation_id,
                "user_id": user_id,
                "doctor_id": doctor_id,
                "question": question,
                "file_paths": file_paths,
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

    @staticmethod
    def download_consultation_file(consultation_id):
        """GET /api/consultation/:id/file"""
        try:
            from flask import send_file
            import os
            from config import Config
            
            # Fetch consultation
            consultation = consultations_col.find_one({"consultation_id": consultation_id})
            if not consultation:
                return jsonify({"message": "Consultation record not found."}), 404
                
            # Verify authorization
            user_id = get_jwt_identity()
            user = users_col.find_one({"user_id": user_id}) or doctors_col.find_one({"doctor_id": user_id})
            if not user:
                return jsonify({"message": "User not found."}), 404
                
            if 'doctor_id' in user:
                if consultation.get("doctor_id") and consultation.get("doctor_id") != user["doctor_id"] and consultation.get("status") != "pending":
                    return jsonify({"message": "Unauthorized access."}), 403
            else:
                if consultation.get("user_id") != user["user_id"]:
                    return jsonify({"message": "Unauthorized access."}), 403
            
            file_paths = consultation.get("file_paths", [])
            if not file_paths and consultation.get("file_path"):
                file_paths = [consultation.get("file_path")]
                
            if not file_paths:
                return jsonify({"message": "No file attached to this consultation."}), 404
                
            index = request.args.get('index', 0, type=int)
            if index < 0 or index >= len(file_paths):
                return jsonify({"message": "File not found."}), 404
                
            file_path = file_paths[index]
                
            full_path = os.path.join(Config.UPLOAD_FOLDER, file_path)
            if not os.path.exists(full_path):
                return jsonify({"message": "File not found on server."}), 404
                
            ext = file_path.rsplit('.', 1)[-1]
            return send_file(full_path, as_attachment=True, download_name=f"Consultation_Document_{consultation_id}_{index+1}.{ext}")
            
        except Exception as e:
            return jsonify({"message": "Error downloading file.", "error": str(e)}), 500
