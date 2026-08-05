# backend/models/schemas.py
"""
PCOSENSE - Database Collection Schema Specifications
Documents the document models for reference and future ODM conversion (e.g. MongoEngine).
"""

# User Document Structure
USER_SCHEMA = {
    "user_id": str,          # UUIDv4
    "name": str,             # Full Name
    "email": str,            # Unique Email
    "password": str,         # Hashed password (bcrypt)
    "phone": str,            # Contact String
    "age": int,              # Demographics (optional, updated during screening)
    "height": float,         # in cm (optional)
    "weight": float,         # in kg (optional)
    "bmi": float,            # Calculated dynamically (optional)
    "created_at": str        # ISO String
}

# Doctor Document Structure
DOCTOR_SCHEMA = {
    "doctor_id": str,        # UUIDv4
    "name": str,             # Full Name
    "email": str,            # Unique Email
    "password": str,         # Hashed password
    "specialization": str,   # Specialist field (Gynecologist, Endocrinologist, etc.)
    "qualification": str,    # e.g., MD, MBBS
    "is_approved": bool,     # Admin approval status check
    "created_at": str        # ISO String
}

# Admin Document Structure
ADMIN_SCHEMA = {
    "admin_id": str,         # UUIDv4
    "username": str,         # Login name (e.g. 'admin')
    "email": str,            # Contact email
    "password": str          # Hashed password
}

# Assessment Document Structure
ASSESSMENT_SCHEMA = {
    "assessment_id": str,    # UUIDv4
    "user_id": str,          # Ref User
    "assessment_date": str,  # ISO String
    "age": int,
    "height": float,
    "weight": float,
    "bmi": float,
    "menstrual_cycle": int,  # 0 = Regular, 1 = Irregular
    "cycle_length": int,     # days
    "weight_gain": bool,
    "hair_growth": bool,
    "hair_loss": bool,
    "skin_darkening": bool,
    "pimples": bool,
    "fast_food": bool,
    "regular_exercise": bool,
    "prediction_result": str,# Low, Moderate, High Risk
    "confidence_score": int  # confidence percentage (50-100)
}

# Recommendation Document Structure
RECOMMENDATION_SCHEMA = {
    "recommendation_id": str,# UUIDv4
    "assessment_id": str,    # Ref Assessment
    "diet_plan": list,       # list of strings
    "exercise_plan": list,   # list of strings
    "lifestyle_advice": list # list of strings
}

# Consultation Document Structure
CONSULTATION_SCHEMA = {
    "consultation_id": str,  # UUIDv4
    "user_id": str,          # Ref User (Patient)
    "doctor_id": str,        # Ref Doctor (Specialist)
    "question": str,         # Patient inquiry text
    "reply": str,            # Doctor feedback text
    "status": str,           # pending, resolved
    "consultation_date": str # ISO String
}

# Educational Content Document Structure
EDUCATIONAL_CONTENT_SCHEMA = {
    "article_id": str,       # UUIDv4
    "title": str,            # Title
    "description": str,      # Detailed text
    "category": str          # Symptoms, Causes, Diet, Exercise, FAQs
}
