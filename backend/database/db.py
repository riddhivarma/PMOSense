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
cycles_col = db['cycles']
reports_col = db['reports']

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
        # Seed default articles if empty
        if edu_content_col.count_documents({}) == 0:
            initial_articles = [
                {
                    "article_id": "art-1",
                    "title": "What is PMOS? Understanding the Endocrine Disorder",
                    "category": "What is PMOS",
                    "content": "Polyendocrine Metabolic Ovarian Syndrome (PMOS) is a multi-system hormonal disorder characterized by reproductive, metabolic, and psychological features. It affects 8% to 13% of women of reproductive age. Diagnostic criteria (Rotterdam consensus) require at least two of the following: 1) Irregular or absent ovulatory cycles, 2) Elevated androgen hormone levels (hyperandrogenism), and 3) Polycystic ovaries visible on pelvic ultrasound.",
                    "video_url": "https://www.youtube.com/watch?v=N4d94A3D0B4",
                    "created_by": "Dr. Sarah Jenkins",
                    "created_at": "Jul 15, 2026",
                    "status": "PUBLISHED",
                    "authorRole": "doctor",
                    "authorId": "doc-1"
                },
                {
                    "article_id": "art-2",
                    "title": "Common Symptoms: From Menstrual Irregularity to Hirsutism",
                    "category": "Symptoms",
                    "content": "PMOS manifests differently in every individual. Key clinical symptoms include oligomenorrhea (cycles > 35 days), amenorrhea, persistent facial and abdominal hair growth (hirsutism), androgenic hair thinning, acanthosis nigricans (dark velvety skin patches around neck folds), cystic acne, and metabolic insulin resistance leading to weight management challenges.",
                    "video_url": "https://www.youtube.com/watch?v=V3W94S3D0C6",
                    "created_by": "Dr. Elena Rostova",
                    "created_at": "Jul 18, 2026",
                    "status": "PUBLISHED",
                    "authorRole": "doctor",
                    "authorId": "doc-3"
                },
                {
                    "article_id": "art-3",
                    "title": "Root Causes: Insulin Resistance and Hyperandrogenism",
                    "category": "Causes",
                    "content": "While the exact etiology remains complex, insulin resistance plays a primary role. Excess insulin signals the ovaries to produce excess testosterone, impairing egg follicle maturation. Genetic predisposition, low-grade systemic inflammation, and environmental endocrine disruptors also contribute significantly to the onset of symptoms.",
                    "video_url": "",
                    "created_by": "EndoResearch Team",
                    "created_at": "Jul 19, 2026",
                    "status": "PUBLISHED",
                    "authorRole": "admin",
                    "authorId": "admin"
                },
                {
                    "article_id": "art-4",
                    "title": "Prevention & Lifestyle Strategies",
                    "category": "Prevention",
                    "content": "Early lifestyle intervention can mitigate long-term complications such as Type 2 diabetes, dyslipidemia, and cardiovascular risks. Key strategies include maintaining a stable low-glycemic index diet, regular physical exercise to increase muscle GLUT-4 glucose transporters, stress management, and consistent sleep hygiene.",
                    "video_url": "",
                    "created_by": "Dr. Amanda Ross",
                    "created_at": "Jul 20, 2026",
                    "status": "PUBLISHED",
                    "authorRole": "doctor",
                    "authorId": "doc-2"
                },
                {
                    "article_id": "art-5",
                    "title": "PMOS Healthy Diet Guide: Glycemic Control and Nutrition",
                    "category": "Healthy Diet",
                    "content": "Dietary management is essential for regulating insulin sensitivity. Focus on complex carbohydrates (quinoa, legumes, steel-cut oats), high-fiber dark leafy greens, lean proteins, and omega-3 fatty acids (salmon, walnuts, flaxseeds). Minimize refined sugars, white flour, processed foods, and sugary drinks.",
                    "video_url": "",
                    "created_by": "NutriWellness Team",
                    "created_at": "Jul 21, 2026",
                    "status": "PUBLISHED",
                    "authorRole": "admin",
                    "authorId": "admin"
                },
                {
                    "article_id": "art-6",
                    "title": "Frequently Asked Questions (FAQs) About PMOS",
                    "category": "FAQs",
                    "content": "Q: Can PMOS be cured?\nA: PMOS is a chronic condition, but symptoms can be effectively managed and reversed through targeted diet, exercise, and clinical guidance.\n\nQ: Is PMOSense a diagnostic tool?\nA: No, PMOSense provides early risk screening only. A formal diagnosis requires clinical evaluation by a physician.",
                    "video_url": "",
                    "created_by": "Medical Review Board",
                    "created_at": "Jul 22, 2026",
                    "status": "PUBLISHED",
                    "authorRole": "admin",
                    "authorId": "admin"
                },
                {
                    "article_id": "art-7",
                    "title": "Clinical Efficacy of Myo-Inositol & Vitamin D3 in PMOS Ovulatory Restoration",
                    "category": "Medical and Research",
                    "content": "A double-blind clinical trial evaluating the synergistic effects of 40:1 Myo-inositol and D-chiro-inositol supplementation in insulin-resistant PMOS patients. Significant improvements were observed in fasting insulin levels, LH/FSH ratios, and spontaneous cycle regularity within 12 weeks of baseline therapy.",
                    "video_url": "https://www.youtube.com/watch?v=N4d94A3D0B4",
                    "created_by": "Dr. Vishal Sharma",
                    "created_at": "Sep 20, 2026",
                    "status": "PENDING",
                    "authorRole": "doctor",
                    "authorId": "doc-vishal"
                },
                {
                    "article_id": "art-8",
                    "title": "Endocrine Biomarkers and Anti-Müllerian Hormone (AMH) Screening Protocols",
                    "category": "Medical and Research",
                    "content": "Analysis of AMH threshold values (>4.5 ng/mL) in differentiating polycystic ovarian morphology from typical reproductive variations. Early biomarker screening coupled with metabolic assessment provides accurate clinical stratification for preventative intervention.",
                    "video_url": "",
                    "created_by": "Dr. Vishal Sharma",
                    "created_at": "Sep 15, 2026",
                    "status": "PUBLISHED",
                    "authorRole": "doctor",
                    "authorId": "doc-vishal"
                },
                {
                    "article_id": "art-9",
                    "title": "Herbal Adaptogens in Hyperandrogenism Management",
                    "category": "Medical and Research",
                    "content": "Preliminary overview of spearmint tea and saw palmetto for anti-androgenic therapy. Requires larger randomized controlled sample size for clinical efficacy confirmation.",
                    "video_url": "",
                    "created_by": "Dr. Vishal Sharma",
                    "created_at": "Sep 10, 2026",
                    "status": "REJECTED",
                    "authorRole": "doctor",
                    "authorId": "doc-vishal"
                }
            ]
            edu_content_col.insert_many(initial_articles)
            print("Default educational articles seeded.")

    except Exception as e:
        print(f"Skipping database collection index/seeding steps: {e}")
