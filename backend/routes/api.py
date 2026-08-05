# backend/routes/api.py
from flask import Blueprint
from flask_jwt_extended import jwt_required
from middlewares.auth import role_required
from controllers.auth_controller import AuthController
from controllers.assessment_controller import AssessmentController
from controllers.recommendation_controller import RecommendationController
from controllers.consultation_controller import ConsultationController
from controllers.education_controller import EducationController
from controllers.admin_controller import AdminController

api_bp = Blueprint('api', __name__)

# ==========================================
# AUTHENTICATION & USER PROFILE
# ==========================================
@api_bp.route('/api/user/register', methods=['POST'])
def user_register():
    return AuthController.register_user()

@api_bp.route('/api/user/login', methods=['POST'])
def user_login():
    return AuthController.login_user()

@api_bp.route('/api/doctor/register', methods=['POST'])
def doctor_register():
    return AuthController.register_doctor()

@api_bp.route('/api/doctor/login', methods=['POST'])
def doctor_login():
    return AuthController.login_doctor()

@api_bp.route('/api/admin/login', methods=['POST'])
def admin_login():
    return AuthController.login_admin()

@api_bp.route('/api/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    return AuthController.get_profile()

@api_bp.route('/api/profile', methods=['PUT'])
@jwt_required()
def update_user_profile():
    return AuthController.update_profile()

# ==========================================
# PCOS ASSESSMENTS & PREDICTIONS
# ==========================================
@api_bp.route('/api/assessment', methods=['POST'])
@jwt_required()
@role_required(['user'])
def create_assessment():
    return AssessmentController.create_assessment()

@api_bp.route('/api/assessment/history', methods=['GET'])
@jwt_required()
@role_required(['user'])
def get_assessment_history():
    return AssessmentController.get_history()

@api_bp.route('/api/assessment/<id>', methods=['GET'])
@jwt_required()
@role_required(['user'])
def get_single_assessment(id):
    return AssessmentController.get_assessment(id)

@api_bp.route('/api/assessment/<id>', methods=['DELETE'])
@jwt_required()
@role_required(['user'])
def delete_single_assessment(id):
    return AssessmentController.delete_assessment(id)

@api_bp.route('/api/predict', methods=['POST'])
@jwt_required()
@role_required(['user'])
def run_model_predict():
    # Alias endpoint for assessments
    return AssessmentController.create_assessment()

# ==========================================
# RECOMMENDATIONS RETRIEVAL
# ==========================================
@api_bp.route('/api/recommendation/<assessment_id>', methods=['GET'])
@jwt_required()
@role_required(['user'])
def get_recommendation_details(assessment_id):
    return RecommendationController.get_recommendation(assessment_id)

# ==========================================
# DOCTOR CONSULTATIONS
# ==========================================
@api_bp.route('/api/consultation', methods=['POST'])
@jwt_required()
@role_required(['user'])
def create_consultation_query():
    return ConsultationController.create_consultation()

@api_bp.route('/api/consultation/user', methods=['GET'])
@jwt_required()
@role_required(['user'])
def get_patient_consultations():
    return ConsultationController.get_user_consultations()

@api_bp.route('/api/consultation/doctor', methods=['GET'])
@jwt_required()
@role_required(['doctor'])
def get_specialist_consultations():
    return ConsultationController.get_doctor_consultations()

@api_bp.route('/api/consultation/reply', methods=['PUT'])
@jwt_required()
@role_required(['doctor'])
def reply_patient_consultation():
    return ConsultationController.reply_consultation()

@api_bp.route('/api/doctors', methods=['GET'])
def get_public_doctors():
    return ConsultationController.get_approved_doctors()

# ==========================================
# EDUCATIONAL CONTENT ARTICLES
# ==========================================
@api_bp.route('/api/articles', methods=['GET'])
def get_educational_articles():
    return EducationController.get_articles()

@api_bp.route('/api/article/<id>', methods=['GET'])
def get_single_article(id):
    return EducationController.get_article(id)

# ==========================================
# ADMIN DASHBOARD & CONTROLS
# ==========================================
@api_bp.route('/api/admin/dashboard', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def get_admin_dashboard_stats():
    return AdminController.get_dashboard_stats()

@api_bp.route('/api/admin/users', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def get_admin_users():
    return AdminController.get_users()

@api_bp.route('/api/admin/users/<id>/verify', methods=['PUT'])
@jwt_required()
@role_required(['admin'])
def toggle_admin_user_verify(id):
    return AdminController.toggle_user_verify(id)

@api_bp.route('/api/admin/doctors', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def get_admin_doctors():
    return AdminController.get_doctors()

@api_bp.route('/api/admin/doctors/<id>/approve', methods=['PUT'])
@jwt_required()
@role_required(['admin'])
def toggle_admin_doctor_approval(id):
    return AdminController.toggle_doctor_approve(id)

@api_bp.route('/api/admin/doctors/<id>/profile_change/verify', methods=['PUT'])
@jwt_required()
@role_required(['admin'])
def verify_admin_doctor_profile_change(id):
    return AdminController.verify_profile_change(id)

@api_bp.route('/api/admin/doctors/<id>/profile_change/reject', methods=['PUT'])
@jwt_required()
@role_required(['admin'])
def reject_admin_doctor_profile_change(id):
    return AdminController.reject_profile_change(id)

@api_bp.route('/api/admin/articles', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def get_admin_articles_inventory():
    return AdminController.get_articles()

@api_bp.route('/api/admin/articles', methods=['POST'])
@jwt_required()
@role_required(['admin'])
def create_admin_article():
    return AdminController.create_article()

@api_bp.route('/api/admin/articles/<id>', methods=['PUT'])
@jwt_required()
@role_required(['admin'])
def update_admin_article(id):
    return AdminController.update_article(id)

@api_bp.route('/api/admin/articles/<id>', methods=['DELETE'])
@jwt_required()
@role_required(['admin'])
def delete_admin_article(id):
    return AdminController.delete_article(id)
