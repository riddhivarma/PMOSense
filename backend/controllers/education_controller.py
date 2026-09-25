# backend/controllers/education_controller.py
import uuid
import datetime
from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from database.db import edu_content_col, doctors_col

class EducationController:
    @staticmethod
    def get_articles():
        """GET /api/articles"""
        try:
            # Public endpoint should only return PUBLISHED articles
            articles = list(edu_content_col.find({"status": "PUBLISHED"}, {"_id": 0}).sort("_id", -1))
            return jsonify(articles), 200
        except Exception as e:
            return jsonify({"message": "Error loading articles.", "error": str(e)}), 500

    @staticmethod
    def get_article(id):
        """GET /api/article/:id"""
        try:
            art = edu_content_col.find_one({"article_id": id}, {"_id": 0})
            if not art:
                return jsonify({"message": "Article not found."}), 404
            return jsonify(art), 200
        except Exception as e:
            return jsonify({"message": "Error loading article.", "error": str(e)}), 500

    @staticmethod
    def get_doctor_articles():
        """GET /api/doctor/articles"""
        try:
            doctor_id = get_jwt_identity()
            
            # Get only this doctor's articles, regardless of status
            articles = list(edu_content_col.find({"authorId": doctor_id}, {"_id": 0}).sort("_id", -1))
            return jsonify(articles), 200
        except Exception as e:
            return jsonify({"message": "Error loading doctor articles.", "error": str(e)}), 500

    @staticmethod
    def create_doctor_article():
        """POST /api/doctor/articles"""
        try:
            doctor_id = get_jwt_identity()
            
            # Fetch doctor's name
            doc = doctors_col.find_one({"doctor_id": doctor_id})
            author_name = doc.get("name", "Unknown Doctor") if doc else "Unknown Doctor"
            if not author_name.startswith("Dr."):
                author_name = f"Dr. {author_name}"

            data = request.get_json() or {}
            title = data.get('title', '').strip()
            content = data.get('content', '').strip()
            category = data.get('category', '').strip()
            video_url = data.get('video_url', '').strip()

            if not title or not content or not category:
                return jsonify({"message": "Title, content, and category are required."}), 422

            article_id = f"art-{uuid.uuid4().hex[:8]}"
            new_art = {
                "article_id": article_id,
                "title": title,
                "content": content,
                "category": category,
                "video_url": video_url,
                "created_by": author_name,
                "authorId": doctor_id,
                "authorRole": "doctor",
                "status": "PENDING",
                "created_at": datetime.datetime.utcnow().strftime("%b %d, %Y")
            }
            edu_content_col.insert_one(new_art)

            # Return the new article object as it would be expected by the frontend without _id
            new_art.pop("_id", None)
            return jsonify({"message": "Article submitted for review successfully.", "article": new_art}), 201
        except Exception as e:
            return jsonify({"message": "Error creating article.", "error": str(e)}), 500
