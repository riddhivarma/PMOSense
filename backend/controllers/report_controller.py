import datetime
import uuid
import os
from flask import jsonify, request, send_from_directory
from flask_jwt_extended import get_jwt_identity
from database.db import reports_col, doctors_col
from config import Config

class ReportController:
    @staticmethod
    def create_report():
        """POST /api/reports"""
        try:
            from werkzeug.utils import secure_filename
            
            doctor_id = get_jwt_identity()
            
            # Since we will upload files, it's form-data
            data = request.form
            
            title = data.get('title', '').strip()
            description = data.get('description', '').strip()
            
            if not title or not description:
                return jsonify({"message": "Title and description are required."}), 422
                
            doc = doctors_col.find_one({"doctor_id": doctor_id})
            if not doc:
                return jsonify({"message": "Doctor not found."}), 404
                
            image_url = None
            
            file = request.files.get('file')
            if file and file.filename:
                # Limit size, e.g., 5MB
                file.seek(0, os.SEEK_END)
                if file.tell() > 5 * 1024 * 1024:
                    return jsonify({"message": "Image must be less than 5MB."}), 422
                file.seek(0)
                
                upload_dir = os.path.join(Config.UPLOAD_FOLDER, 'reports')
                os.makedirs(upload_dir, exist_ok=True)
                
                ext = file.filename.rsplit('.', 1)[-1].lower()
                if ext not in ['jpg', 'jpeg', 'png', 'webp']:
                    return jsonify({"message": "Only JPG, PNG or WEBP images are allowed."}), 422
                    
                unique_filename = f"{uuid.uuid4().hex}.{ext}"
                save_path = os.path.join(upload_dir, unique_filename)
                file.save(save_path)
                
                # We will serve this file via an endpoint, e.g., /api/reports/image/unique_filename
                image_url = f"reports/{unique_filename}"
                
            report_id = f"rep-{uuid.uuid4().hex[:8]}"
            
            new_report = {
                "id": report_id,
                "title": title,
                "description": description,
                "image_url": image_url,
                "doctor_id": doctor_id,
                "doctor_name": doc.get('name'),
                "status": "PENDING",
                "created_at": datetime.datetime.utcnow().strftime("%b %d, %Y")
            }
            
            reports_col.insert_one(new_report)
            
            # Remove _id for JSON serialization
            new_report.pop('_id', None)
            
            return jsonify({"message": "Report submitted successfully.", "report": new_report}), 201
            
        except Exception as e:
            return jsonify({"message": "Error creating report.", "error": str(e)}), 500

    @staticmethod
    def get_my_reports():
        """GET /api/reports/my"""
        try:
            doctor_id = get_jwt_identity()
            reports = list(reports_col.find({"doctor_id": doctor_id}, {"_id": 0}))
            
            # We must prepend the API base url to image_url for the frontend
            # The frontend can also construct it, but we can do it via a generic route or just return the partial path
            return jsonify(reports), 200
        except Exception as e:
            return jsonify({"message": "Error fetching reports.", "error": str(e)}), 500
            
    @staticmethod
    def get_all_reports():
        """GET /api/reports/all"""
        try:
            reports = list(reports_col.find({}, {"_id": 0}))
            return jsonify(reports), 200
        except Exception as e:
            return jsonify({"message": "Error fetching reports.", "error": str(e)}), 500
            
    @staticmethod
    def resolve_report(report_id):
        """PUT /api/reports/<id>/resolve"""
        try:
            result = reports_col.update_one(
                {"id": report_id},
                {"$set": {"status": "RESOLVED"}}
            )
            
            if result.matched_count == 0:
                return jsonify({"message": "Report not found."}), 404
                
            return jsonify({"message": "Report resolved successfully."}), 200
        except Exception as e:
            return jsonify({"message": "Error resolving report.", "error": str(e)}), 500

    @staticmethod
    def serve_report_image(filename):
        """GET /api/reports/image/<filename>"""
        try:
            upload_dir = os.path.join(Config.UPLOAD_FOLDER, 'reports')
            return send_from_directory(upload_dir, filename)
        except Exception as e:
            return jsonify({"message": "File not found.", "error": str(e)}), 404
