# backend/controllers/auth_controller.py
import re
import uuid
import datetime
import bcrypt
from flask import jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, get_jwt
from database.db import users_col, doctors_col, admins_col

# Email pattern matching
EMAIL_REGEX = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'

class AuthController:
    @staticmethod
    def register_user():
        """POST /api/user/register"""
        try:
            data = request.get_json() or {}
            name = data.get('name', '').strip()
            email = data.get('email', '').strip().lower()
            password = data.get('password', '')
            phone = data.get('phone', '').strip()
            
            # Validations
            if not name or not email or not password:
                return jsonify({"message": "Name, email, and password are required."}), 422
            
            if not re.match(EMAIL_REGEX, email):
                return jsonify({"message": "Invalid email format."}), 422
                
            if len(password) < 6:
                return jsonify({"message": "Password must be at least 6 characters long."}), 422

            # Check if email exists in users or doctors
            if users_col.find_one({"email": email}) or doctors_col.find_one({"email": email}):
                return jsonify({"message": "Email is already registered."}), 400

            # Create User
            hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            user_id = str(uuid.uuid4())
            
            dob = data.get('dob', '').strip()
            age = None
            if dob:
                try:
                    birth_date = datetime.datetime.strptime(dob, "%Y-%m-%d")
                    today = datetime.date.today()
                    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
                    if age < 15 or age > 55:
                        return jsonify({"message": "Age calculated from DOB must be between 15 and 55."}), 422
                except ValueError:
                    return jsonify({"message": "Invalid DOB format, must be YYYY-MM-DD."}), 422
            else:
                return jsonify({"message": "Date of Birth is required."}), 422

            new_user = {
                "user_id": user_id,
                "name": name,
                "email": email,
                "password": hashed_pw,
                "phone": data.get('phone', None),
                "dob": dob,
                "age": age,
                "height": None,
                "weight": None,
                "blood_group": "Not set",
                "is_verified": True,
                "created_at": datetime.datetime.utcnow().isoformat()
            }
            users_col.insert_one(new_user)
            
            return jsonify({"message": "User registered successfully.", "user_id": user_id}), 201
            
        except Exception as e:
            return jsonify({"message": "Error registering user.", "error": str(e)}), 500

    @staticmethod
    def login_user():
        """POST /api/user/login"""
        try:
            data = request.get_json() or {}
            email = data.get('email', '').strip().lower()
            password = data.get('password', '')
            
            if not email or not password:
                return jsonify({"message": "Email and password are required."}), 422
                
            user = users_col.find_one({"email": email})
            if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
                return jsonify({"message": "Invalid email or password."}), 401
                
            if not user.get('is_verified', False):
                return jsonify({"message": "Your account approval has been revoked by an administrator. Please contact support."}), 403
                
            # Create token
            access_token = create_access_token(
                identity=user['user_id'],
                additional_claims={"role": "user", "name": user['name'], "email": user['email']}
            )
            
            return jsonify({
                "message": "Login successful.",
                "token": access_token,
                "user": {
                    "user_id": user['user_id'],
                    "name": user['name'],
                    "email": user['email'],
                    "role": "user"
                }
            }), 200
            
        except Exception as e:
            return jsonify({"message": "Error logging in.", "error": str(e)}), 500

    @staticmethod
    def register_doctor():
        """POST /api/doctor/register"""
        try:
            data = request.get_json() or {}
            name = data.get('name', '').strip()
            email = data.get('email', '').strip().lower()
            password = data.get('password', '')
            specialization = data.get('specialization', '').strip()
            profile_picture = data.get('profile_picture', '').strip()
            
            if not name or not email or not password or not specialization or not profile_picture:
                return jsonify({"message": "Name, email, password, specialization, and profile picture are required."}), 422
                
            if not re.match(EMAIL_REGEX, email):
                return jsonify({"message": "Invalid email format."}), 422
                
            if len(password) < 6:
                return jsonify({"message": "Password must be at least 6 characters long."}), 422

            if users_col.find_one({"email": email}) or doctors_col.find_one({"email": email}):
                return jsonify({"message": "Email is already registered."}), 400

            hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            doctor_id = str(uuid.uuid4())
            
            try:
                experience_years = int(data.get('experience_years', 0))
            except (ValueError, TypeError):
                experience_years = 0
                
            new_doc = {
                "doctor_id": doctor_id,
                "name": name,
                "email": email,
                "password": hashed_pw,
                "specialization": specialization,
                "profile_picture": profile_picture,
                "phone": data.get('phone', None),
                "experience_years": experience_years,
                "license_number": data.get('license_number', '').strip(),
                "is_approved": False, # Requires admin approval
                "created_at": datetime.datetime.utcnow().isoformat()
            }
            doctors_col.insert_one(new_doc)
            
            return jsonify({"message": "Doctor registered successfully. Awaiting admin approval.", "doctor_id": doctor_id}), 201
            
        except Exception as e:
            return jsonify({"message": "Error registering doctor.", "error": str(e)}), 500

    @staticmethod
    def login_doctor():
        """POST /api/doctor/login"""
        try:
            data = request.get_json() or {}
            email = data.get('email', '').strip().lower()
            password = data.get('password', '')
            
            if not email or not password:
                return jsonify({"message": "Email and password are required."}), 422
                
            doc = doctors_col.find_one({"email": email})
            if not doc or not bcrypt.checkpw(password.encode('utf-8'), doc['password'].encode('utf-8')):
                return jsonify({"message": "Invalid email or password."}), 401
                
            if not doc.get('is_approved', False):
                return jsonify({"message": "Account pending administrator approval."}), 403
                
            access_token = create_access_token(
                identity=doc['doctor_id'],
                additional_claims={"role": "doctor", "name": doc['name'], "email": doc['email']}
            )
            
            return jsonify({
                "message": "Login successful.",
                "token": access_token,
                "user": {
                    "doctor_id": doc['doctor_id'],
                    "name": doc['name'],
                    "email": doc['email'],
                    "role": "doctor"
                }
            }), 200
            
        except Exception as e:
            return jsonify({"message": "Error logging in.", "error": str(e)}), 500

    @staticmethod
    def login_admin():
        """POST /api/admin/login"""
        try:
            data = request.get_json() or {}
            username = data.get('username', '').strip()
            password = data.get('password', '')
            
            if not username or not password:
                return jsonify({"message": "Username and password are required."}), 422
                
            # Normalize common domain typo to the base username
            if username == "admin@pmosense.com" or username == "admin@pcosense.com":
                username = "admin"
                
            admin = admins_col.find_one({"$or": [{"username": username}, {"email": username}]})
            if not admin or not bcrypt.checkpw(password.encode('utf-8'), admin['password'].encode('utf-8')):
                return jsonify({"message": "Invalid credentials."}), 401
                
            access_token = create_access_token(
                identity=admin['admin_id'],
                additional_claims={"role": "admin", "username": admin['username']}
            )
            
            return jsonify({
                "message": "Admin login successful.",
                "token": access_token,
                "user": {
                    "admin_id": admin['admin_id'],
                    "username": admin['username'],
                    "role": "admin"
                }
            }), 200
            
        except Exception as e:
            return jsonify({"message": "Error logging in.", "error": str(e)}), 500

    @staticmethod
    def get_profile():
        """GET /api/profile"""
        try:
            jwt_data = get_jwt()
            role = jwt_data.get('role', 'user')
            identity = get_jwt_identity()
            
            if role == 'user':
                user = users_col.find_one({"user_id": identity}, {"password": 0, "_id": 0})
            elif role == 'doctor':
                user = doctors_col.find_one({"doctor_id": identity}, {"password": 0, "_id": 0})
            elif role == 'admin':
                user = admins_col.find_one({"admin_id": identity}, {"password": 0, "_id": 0})
            else:
                return jsonify({"message": "Invalid role."}), 403

            if not user:
                return jsonify({"message": "Profile not found."}), 404
            
            user['role'] = role
            return jsonify(user), 200
        except Exception as e:
            return jsonify({"message": "Error loading profile.", "error": str(e)}), 500

    @staticmethod
    def update_profile():
        """PUT /api/profile"""
        try:
            jwt_data = get_jwt()
            role = jwt_data.get('role', 'user')
            identity = get_jwt_identity()
            data = request.get_json() or {}
            
            name = data.get('name', '').strip()
            phone = data.get('phone', '').strip()
            
            update_fields = {}
            if name: update_fields["name"] = name
            if phone: update_fields["phone"] = phone
            
            if role == 'user':
                dob = data.get('dob', '').strip()
                height = data.get('height')
                weight = data.get('weight')
                blood_group = data.get('blood_group', '').strip()
                
                if dob:
                    try:
                        birth_date = datetime.datetime.strptime(dob, "%Y-%m-%d")
                        today = datetime.date.today()
                        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
                        if age < 15 or age > 55:
                            return jsonify({"message": "Age calculated from DOB must be between 15 and 55."}), 422
                        update_fields["dob"] = dob
                        update_fields["age"] = age
                    except ValueError:
                        return jsonify({"message": "Invalid DOB format, must be YYYY-MM-DD."}), 422
                        
                if height is not None:
                    try:
                        height = float(height)
                        if height < 100 or height > 220:
                            return jsonify({"message": "Height must be between 100 and 220 cm."}), 422
                        update_fields["height"] = height
                    except ValueError:
                        return jsonify({"message": "Height must be a valid float."}), 422
                        
                if weight is not None:
                    try:
                        weight = float(weight)
                        if weight < 30 or weight > 180:
                            return jsonify({"message": "Weight must be between 30 and 180 kg."}), 422
                        update_fields["weight"] = weight
                    except ValueError:
                        return jsonify({"message": "Weight must be a valid float."}), 422
                
                if blood_group:
                    update_fields["blood_group"] = blood_group
                    
                if not update_fields:
                    return jsonify({"message": "No valid fields provided for update."}), 400
                    
                result = users_col.update_one({"user_id": identity}, {"$set": update_fields})
                
            elif role == 'doctor':
                specialization = data.get('specialization', '').strip()
                experience = data.get('experience_years')
                license_number = data.get('license_number', '').strip()
                profile_picture = data.get('profile_picture', '').strip()
                
                if specialization: update_fields["specialization"] = specialization
                if experience is not None and experience != '':
                    try:
                        update_fields["experience_years"] = int(experience)
                    except ValueError:
                        return jsonify({"message": "Experience must be an integer."}), 422
                
                if license_number:
                    doc = doctors_col.find_one({"doctor_id": identity})
                    if doc and license_number != doc.get('license_number'):
                        update_fields["pending_license_number"] = license_number
                    elif doc and license_number == doc.get('license_number'):
                        doctors_col.update_one({"doctor_id": identity}, {"$unset": {"pending_license_number": ""}})

                if profile_picture:
                    update_fields["pending_profile_picture"] = profile_picture

                if not update_fields:
                    return jsonify({"message": "No valid fields provided for update."}), 400
                    
                result = doctors_col.update_one({"doctor_id": identity}, {"$set": update_fields})
                
            elif role == 'admin':
                email = data.get('email', '').strip()
                if email: update_fields["email"] = email
                if not update_fields:
                    return jsonify({"message": "No valid fields provided for update."}), 400
                result = admins_col.update_one({"admin_id": identity}, {"$set": update_fields})
            else:
                return jsonify({"message": "Invalid role."}), 403

            if result.matched_count == 0:
                return jsonify({"message": "Profile not found."}), 404
                
            return jsonify({"message": "Profile updated successfully."}), 200
            
        except Exception as e:
            return jsonify({"message": "Error updating profile.", "error": str(e)}), 500
