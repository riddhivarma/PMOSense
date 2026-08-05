# backend/controllers/admin_controller.py
import datetime
import uuid
from flask import jsonify, request
from database.db import users_col, doctors_col, assessments_col, edu_content_col

class AdminController:
    @staticmethod
    def get_dashboard_stats():
        """GET /api/admin/dashboard"""
        try:
            total_users = users_col.count_documents({})
            total_doctors = doctors_col.count_documents({})
            total_assessments = assessments_col.count_documents({})
            high_risk_cases = assessments_col.count_documents({"prediction_result": "High"})

            return jsonify({
                "total_users": total_users,
                "total_doctors": total_doctors,
                "total_assessments": total_assessments,
                "high_risk_cases": high_risk_cases
            }), 200
        except Exception as e:
            return jsonify({"message": "Error loading admin dashboard stats.", "error": str(e)}), 500

    @staticmethod
    def get_users():
        """GET /api/admin/users"""
        try:
            users = list(users_col.find({}, {"password": 0, "_id": 0}))
            return jsonify(users), 200
        except Exception as e:
            return jsonify({"message": "Error loading users registry.", "error": str(e)}), 500

    @staticmethod
    def get_doctors():
        """GET /api/admin/doctors"""
        try:
            docs = list(doctors_col.find({}, {"password": 0, "_id": 0}))
            return jsonify(docs), 200
        except Exception as e:
            return jsonify({"message": "Error loading doctors registry.", "error": str(e)}), 500

    @staticmethod
    def toggle_user_verify(id):
        """PUT /api/admin/users/:id/verify"""
        try:
            user = users_col.find_one({"user_id": id})
            if not user: return jsonify({"message": "User not found."}), 404
            
            new_status = not user.get("is_verified", False)
            users_col.update_one({"user_id": id}, {"$set": {"is_verified": new_status}})
            return jsonify({"message": "User verify toggled.", "is_verified": new_status}), 200
        except Exception as e:
            return jsonify({"message": "Error toggling user verification.", "error": str(e)}), 500

    @staticmethod
    def toggle_doctor_approve(id):
        """PUT /api/admin/doctors/:id/approve"""
        try:
            doc = doctors_col.find_one({"doctor_id": id})
            if not doc:
                return jsonify({"message": "Doctor not found."}), 404

            # Toggle the is_approved state
            new_status = not doc.get("is_approved", False)
            doctors_col.update_one({"doctor_id": id}, {"$set": {"is_approved": new_status}})

            return jsonify({
                "message": f"Doctor account {'approved' if new_status else 'suspended'} successfully.",
                "is_approved": new_status
            }), 200
        except Exception as e:
            return jsonify({"message": "Error toggling approval.", "error": str(e)}), 500

    @staticmethod
    def verify_profile_change(id):
        """PUT /api/admin/doctors/:id/profile_change/verify"""
        try:
            doc = doctors_col.find_one({"doctor_id": id})
            if not doc: return jsonify({"message": "Doctor not found."}), 404
            
            pending_lic = doc.get("pending_license_number")
            pending_pfp = doc.get("pending_profile_picture")
            
            if pending_lic or pending_pfp:
                update_fields = {}
                unset_fields = {}
                if pending_lic:
                    update_fields["license_number"] = pending_lic
                    unset_fields["pending_license_number"] = ""
                if pending_pfp:
                    update_fields["profile_picture"] = pending_pfp
                    unset_fields["pending_profile_picture"] = ""
                    
                doctors_col.update_one({"doctor_id": id}, {"$set": update_fields, "$unset": unset_fields})
                return jsonify({"message": "Profile changes verified."}), 200
                
            return jsonify({"message": "No pending changes."}), 400
        except Exception as e:
            return jsonify({"message": "Error processing profile verification.", "error": str(e)}), 500

    @staticmethod
    def reject_profile_change(id):
        """PUT /api/admin/doctors/:id/profile_change/reject"""
        try:
            doc = doctors_col.find_one({"doctor_id": id})
            if not doc: return jsonify({"message": "Doctor not found."}), 404
            
            if "pending_license_number" in doc or "pending_profile_picture" in doc:
                doctors_col.update_one({"doctor_id": id}, {"$unset": {"pending_license_number": "", "pending_profile_picture": ""}})
                return jsonify({"message": "Profile changes rejected."}), 200
            return jsonify({"message": "No pending changes."}), 400
        except Exception as e:
            return jsonify({"message": "Error processing profile rejection.", "error": str(e)}), 500

    @staticmethod
    def get_articles():
        """GET /api/admin/articles"""
        try:
            articles = list(edu_content_col.find({}, {"_id": 0}))
            return jsonify(articles), 200
        except Exception as e:
            return jsonify({"message": "Error loading articles list.", "error": str(e)}), 500

    @staticmethod
    def create_article():
        """POST /api/admin/articles"""
        try:
            data = request.get_json() or {}
            title = data.get('title', '').strip()
            description = data.get('description', '').strip()
            category = data.get('category', '').strip()

            if not title or not description or not category:
                return jsonify({"message": "Title, description, and category are required."}), 422

            article_id = str(uuid.uuid4())
            new_art = {
                "article_id": article_id,
                "title": title,
                "description": description,
                "category": category,
                "created_at": datetime.datetime.utcnow().isoformat()
            }
            edu_content_col.insert_one(new_art)

            return jsonify({"message": "Article published successfully.", "article_id": article_id}), 201
        except Exception as e:
            return jsonify({"message": "Error creating article.", "error": str(e)}), 500

    @staticmethod
    def update_article(id):
        """PUT /api/admin/articles/:id"""
        try:
            data = request.get_json() or {}
            title = data.get('title', '').strip()
            description = data.get('description', '').strip()
            category = data.get('category', '').strip()

            art = edu_content_col.find_one({"article_id": id})
            if not art:
                return jsonify({"message": "Article not found."}), 404

            update_fields = {}
            if title: update_fields["title"] = title
            if description: update_fields["description"] = description
            if category: update_fields["category"] = category

            if not update_fields:
                return jsonify({"message": "No valid fields provided for update."}), 400

            edu_content_col.update_one({"article_id": id}, {"$set": update_fields})
            return jsonify({"message": "Article updated successfully."}), 200
            
        except Exception as e:
            return jsonify({"message": "Error updating article.", "error": str(e)}), 500

    @staticmethod
    def delete_article(id):
        """DELETE /api/admin/articles/:id"""
        try:
            art = edu_content_col.find_one({"article_id": id})
            if not art:
                return jsonify({"message": "Article not found."}), 404

            edu_content_col.delete_one({"article_id": id})
            return jsonify({"message": "Article successfully deleted."}), 200
        except Exception as e:
            return jsonify({"message": "Error deleting article.", "error": str(e)}), 500
