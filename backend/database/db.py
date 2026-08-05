# backend/database/db.py
import sys
import bcrypt
import uuid
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from config import Config

try:
    print(f"Connecting to MongoDB: {Config.MONGO_URI}")
    client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=4000)
    client.admin.command('ping')
    db = client.get_database() # Gets DB from URI or defaults
    print("MongoDB connection established successfully.")
except (ConnectionFailure, ServerSelectionTimeoutError) as e:
    print("\n" + "="*60)
    print("WARNING: MongoDB Atlas connection failed.")
    print("Falling back to local MongoDB client...")
    print("="*60 + "\n")
    try:
        client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=2000)
        db = client.get_database('pcosense')
        print("Connected to fallback local MongoDB client.")
    except Exception as local_err:
        print(f"Local fallback connection failed: {local_err}")
        class MockDB:
            def __getitem__(self, name):
                raise RuntimeError(f"Database offline. Connection to '{name}' unavailable.")
        db = MockDB()

# Collections definition mapping
users_col = db['users']
doctors_col = db['doctors']
admins_col = db['admins']
assessments_col = db['assessments']
recommendations_col = db['recommendations']
consultations_col = db['consultations']
edu_content_col = db['educational_content']

def init_db():
    """Build collections indexes and seed defaults"""
    try:
        # Create unique indexes
        users_col.create_index("email", unique=True)
        doctors_col.create_index("email", unique=True)
        admins_col.create_index("username", unique=True)
        
        # Seed default admin account if empty
        if admins_col.count_documents({}) == 0:
            hashed_pw = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            admins_col.insert_one({
                "admin_id": str(uuid.uuid4()),
                "username": "admin",
                "email": "admin@pmosense.com", # supporting both username and email search
                "phone": None,
                "password": hashed_pw
            })
            print("Default admin seeded: username: 'admin', password: 'admin123'")
    except Exception as e:
        print(f"Skipping database collection index/seeding steps: {e}")
