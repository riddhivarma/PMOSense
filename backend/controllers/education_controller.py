# backend/controllers/education_controller.py
from flask import jsonify
from database.db import edu_content_col

class EducationController:
    @staticmethod
    def get_articles():
        """GET /api/articles"""
        try:
            articles = list(edu_content_col.find({}, {"_id": 0}))
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
