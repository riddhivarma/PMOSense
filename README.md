# PMOSense – AI-Powered PMOS Risk Assessment, Menstrual Cycle Tracking & Clinical Platform

**PMOSense** is a full-stack, AI-powered healthcare platform designed for early risk assessment, longitudinal menstrual health tracking, and clinical education regarding **Polyendocrine Metabolic Ovarian Syndrome (PMOS / PCOS)**.

The platform combines a **Random Forest machine learning classifier** with comprehensive patient health tools: personalized risk scoring, monthly menstrual cycle tracking with flow/pain metrics, automated clinical PDF report generation, doctor-patient consultation channels, and an administrative moderation hub.

---

## 🔑 Default Login Credentials

Use the following pre-configured credentials to explore the different role portals:

| Role | Username / Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Patient (User)** | `patient@pmosense.com` | `patient123` | Patient dashboard, screening, cycle tracking & consultations |
| **Doctor (Specialist)** | `doctor@pmosense.com` | `doctor123` | Doctor dashboard, patient consultations, reports & article publishing |
| **Administrator** | `admin` (or `admin@pmosense.com`) | `admin123` | Global analytics, doctor verification, report resolution & education hub |

---

## 🌟 Key Features & Capabilities

### 1. AI-Powered Early PMOS Risk Assessment
* **Random Forest ML Model**: Trained on clinical datasets to predict PMOS risk levels (**Low**, **Moderate**, **High**) along with confidence percentages.
* **Multi-Factor Assessment**: Evaluates anthropometric metrics (Age, BMI), hormonal symptoms (hirsutism, alopecia, acanthosis nigricans, cystic acne), cycle regularity, and lifestyle factors.
* **Instant Lifestyle Guidance**: Dynamic recommendations for diet, exercise routines, and clinical next-steps tailored to the user's risk profile.
* **Assessment History**: Tracks past screenings over time to monitor symptom progression.

### 2. Longitudinal Menstrual Cycle Tracker (`/cycle-tracker`)
* **Cycle Logging**: Record cycle start/end dates, active bleeding duration, and flow intensity (`Light`, `Medium`, `Heavy`).
* **Symptom & Pain Intensity**: Track pain levels on a 1–5 scale, sanitary pads changed per day, and co-occurring symptoms (severe cramps, bloating, nausea, fatigue, headache, mood swings).
* **Automated Cycle Analytics**: Real-time calculation of average cycle length, average period duration, and predicted next period date.

### 3. Automated Clinical PDF Reports
* **Assessment Report**: Downloadable clinical summary of PMOS risk score, feature breakdown, and doctor consultation recommendations built with **ReportLab**.
* **Cycle Summary Report**: Detailed log of past menstrual cycles, symptom frequency, and bleeding metrics formatted for physician review.

### 4. Doctor-Patient Consultation Hub
* **Specialist Q&A**: Patients can submit health inquiries and medical file attachments to approved gynecologists and endocrinologists.
* **Doctor Workspace**: Doctors review assigned queries, evaluate attached documents, and deliver structured medical guidance.
* **Doctor Verification System**: Doctors must register with a medical license number and profile picture. License changes undergo administrative verification.

### 5. Educational Hub & Knowledge Base
* **Curated Articles & Media**: Educational guides on PMOS causes, endocrine biomarkers, low-glycemic nutrition, and clinical research.
* **Content Moderation**: Doctors submit research publications; Administrators review, publish, or reject articles before they go live.

### 6. Role-Based Administration & Support
* **Admin Dashboard**: System-wide statistics on registered patients, verified doctors, assessment volume, and risk distribution.
* **Incident & Support Reports (`/admin-reports`)**: Doctors can report technical issues or medical queries with screenshots for administrator review and resolution.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, React Router DOM v7, React Context API |
| **UI & Visuals** | Framer Motion (animations), Recharts (charts & graphs), SweetAlert2, Lucide React, React Icons |
| **Backend API** | Python 3.8+, Flask, Flask-RESTful, Flask-CORS, Flask-JWT-Extended, Flask-Mail |
| **Database** | MongoDB (Local / Atlas), PyMongo client |
| **Machine Learning** | Scikit-Learn (Random Forest Classifier), Joblib, Pandas, NumPy, Jupyter Notebooks |
| **Reporting & Docs** | ReportLab (PDF compilation), Werkzeug (secure file uploads) |
| **Security** | Bcrypt (salted password hashing), JWT (Bearer token authentication), Role-Based Route Guards |

---

## 📁 Repository Structure

```
PMOSense/
├── dataset/                                # Clinical dataset source files
│   └── PCOS_data_without_infertility.xlsx  # Cleaned clinical dataset
├── models/                                 # Serialized ML models
│   └── pcos_model.pkl                      # Exported Random Forest classifier
├── machine_learning/                       # ML experimentation & notebooks
│   ├── PMOS_Training.ipynb                 # Preprocessing, model training & export
│   └── PMOS_Testing.ipynb                  # Validation and inference evaluation
├── backend/                                # Flask REST API backend
│   ├── app.py                              # Flask application factory & error handlers
│   ├── config.py                           # App configuration & environment loader
│   ├── setup_db.py                         # Database indexing & initial seed script
│   ├── requirements.txt                    # Python dependencies
│   ├── controllers/                        # Business logic controllers
│   │   ├── admin_controller.py             # Admin metrics, user & doctor verification
│   │   ├── assessment_controller.py        # Screening inputs & risk scoring
│   │   ├── auth_controller.py              # JWT register, login & profile management
│   │   ├── consultation_controller.py      # Doctor consultation requests & replies
│   │   ├── cycle_controller.py             # Menstrual cycle logging & statistics
│   │   ├── education_controller.py         # Educational article CRUD & review
│   │   ├── recommendation_controller.py    # Personalized guidance retrieval
│   │   └── report_controller.py           # Support reports & file uploads
│   ├── database/
│   │   └── db.py                           # MongoDB connection & collections mapping
│   ├── middlewares/
│   │   └── auth.py                         # Role-based authorization decorator
│   ├── models/
│   │   └── schemas.py                      # Collection document schema specifications
│   ├── routes/
│   │   └── api.py                          # Consolidated REST API endpoints
│   ├── services/
│   │   ├── predict_service.py              # Random Forest model inference pipeline
│   │   └── recommendation_service.py       # Heuristic recommendation engine
│   └── utils/
│       ├── report_generator.py             # PDF generator for PMOS assessments
│       └── cycle_report_generator.py       # PDF generator for menstrual cycles
└── frontend/                               # Vite + React client application
    ├── package.json                        # Dependencies and build scripts
    ├── vite.config.js                      # Vite configuration
    ├── tailwind.config.js                  # Tailwind styling setup
    ├── postcss.config.js                   # CSS post-processing
    ├── index.html                          # HTML entry point
    └── src/
        ├── main.jsx                        # Application root render
        ├── App.jsx                         # App entry with router & AuthProvider
        ├── context/
        │   └── AuthContext.jsx             # Global state (auth, cycles, consultations)
        ├── routes/
        │   └── AppRoutes.jsx               # Protected & role-guarded route definitions
        ├── layouts/
        │   ├── MainLayout.jsx              # Navbar & Footer layout wrapper
        │   └── PreviewLayout.jsx           # Clean preview layout for articles
        ├── components/                     # Reusable UI components
        │   ├── Navbar.jsx                  # Header with responsive navigation
        │   ├── Footer.jsx                  # Medical disclaimer & site links
        │   ├── Sidebar.jsx                 # Role dashboard navigation sidebar
        │   ├── Card.jsx / DashboardCard.jsx# Glassmorphism container cards
        │   ├── Modal.jsx                   # Popup dialog component
        │   ├── Loader.jsx / Skeleton.jsx   # Loading state indicators
        │   └── Table.jsx / Button.jsx      # Design system primitives
        └── pages/                          # Application route views
            ├── LandingPage.jsx             # Public landing & feature showcases
            ├── LoginPage.jsx / RegisterPage.jsx # Authentication portals
            ├── AdminLoginPage.jsx          # Admin portal login
            ├── ForgotPasswordPage.jsx      # Password reset request
            ├── ResetPasswordPage.jsx       # Password reset submission
            ├── AboutPage.jsx / ContactPage.jsx # Informational pages
            ├── UserDashboardPage.jsx       # Patient dashboard
            ├── AssessmentPage.jsx          # PMOS risk screening questionnaire
            ├── PredictionResultPage.jsx    # Assessment breakdown & risk score
            ├── RecommendationsPage.jsx     # Diet, exercise & lifestyle guidance
            ├── HistoryPage.jsx             # Past screening results history
            ├── CycleTrackerPage.jsx        # Menstrual cycle calendar & tracking
            ├── DoctorConsultationPage.jsx  # Patient consultation portal
            ├── DoctorDashboardPage.jsx     # Doctor consultation management
            ├── DoctorReportsPage.jsx       # Doctor support ticket submission
            ├── EducationResourcesPage.jsx  # Public educational content hub
            ├── AdminDashboardPage.jsx      # Administrative control center
            ├── AdminEducationHubPage.jsx   # Article moderation & publishing
            └── AdminReportsPage.jsx        # Support reports management
```

---

## 📡 Key REST API Endpoints

### Authentication & Users
* `POST /api/user/register` - Register a patient account
* `POST /api/user/login` - Authenticate patient & retrieve JWT
* `POST /api/doctor/register` - Register doctor account (with license)
* `POST /api/doctor/login` - Authenticate doctor & retrieve JWT
* `POST /api/admin/login` - Authenticate administrator & retrieve JWT
* `GET  /api/profile` - Fetch authenticated user profile
* `PUT  /api/profile` - Update profile data & credentials

### Screening & Predictions
* `POST /api/assessment` - Submit symptoms, run ML inference & save result
* `GET  /api/assessment/history` - Retrieve user assessment history
* `GET  /api/assessment/<id>` - Fetch single assessment details
* `DELETE /api/assessment/<id>` - Delete assessment record
* `GET  /api/assessment/<id>/pdf` - Download assessment PDF report

### Menstrual Cycle Tracking
* `POST /api/cycle` - Log or update menstrual cycle entry
* `GET  /api/cycle` - Retrieve user cycle history & stats
* `DELETE /api/cycle/<id>` - Delete cycle record
* `GET  /api/cycle/pdf` - Download menstrual cycle PDF report

### Doctor Consultations
* `POST /api/consultation` - Submit medical query to doctor (with attachments)
* `GET  /api/consultation/user` - Fetch patient's active consultations
* `GET  /api/consultation/doctor` - Fetch consultations assigned to doctor
* `PUT  /api/consultation/reply` - Submit doctor response to patient inquiry
* `GET  /api/doctors` - List approved doctors available for consultation

### Education & Articles
* `GET  /api/articles` - List all published educational articles
* `GET  /api/article/<id>` - Read single article details
* `POST /api/doctor/articles` - Doctor article draft submission
* `GET  /api/admin/articles` - Admin article inventory management
* `PUT  /api/admin/articles/<id>/status` - Approve, publish, or reject articles

### Reports & Admin Controls
* `POST /api/reports` - Doctor creates support report with screenshot
* `GET  /api/reports/all` - Admin lists all submitted support reports
* `PUT  /api/reports/<id>/resolve` - Admin marks report as resolved
* `GET  /api/admin/dashboard` - Global platform statistics
* `PUT  /api/admin/doctors/<id>/approve` - Approve doctor registration
* `PUT  /api/admin/doctors/<id>/profile_change/verify` - Approve doctor license update

---

## 🚀 Installation & Local Setup

### ⚙️ Prerequisites
* **Python 3.8+**
* **Node.js 18+** & npm
* **MongoDB** (Local daemon running at `mongodb://localhost:27017` or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)

---

### 1️⃣ Backend Setup (Flask Server)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate a virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 3. Install backend dependencies
pip install -r requirements.txt
```

#### Configure Environment Variables (`backend/.env`)
Create a `.env` file inside `backend/`:
```env
PORT=5000
SECRET_KEY=your_secret_jwt_key
JWT_SECRET_KEY=your_secret_jwt_key
MONGO_URI=mongodb://localhost:27017/pcosense

# Mail parameters (Optional - used for password recovery)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_DEFAULT_SENDER=noreply.pmosense@gmail.com
```

#### Start Backend Server
```bash
python app.py
```
*The Flask REST API will start on `http://localhost:5000`.*

---

### 2️⃣ Frontend Setup (Vite + React)

```bash
# 1. Open a new terminal and navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```
*The frontend will launch on `http://localhost:5173`.*

---

## 🔒 Security & Medical Disclaimers

### Security & Privacy
* **Password Hashing**: Cryptographically secure salted password hashing using `bcrypt`.
* **Stateless Authorization**: JWT authentication with role-based validation guards preventing unauthorized access across patient, doctor, and admin portals.
* **Input Sanitization**: Range and type verification for all numerical clinical parameters.

### ⚠️ Medical Disclaimer
> **PMOSense is intended for early screening, lifestyle awareness, and symptom tracking only.** It does **not** provide clinical diagnosis or prescribe medical treatments. A definitive diagnosis of PCOS / PMOS requires formal clinical evaluation by a licensed healthcare provider, including hormonal blood panels (LH/FSH ratio, free testosterone, fasting insulin) and pelvic ultrasound examinations. Always consult a qualified medical professional for health concerns.
