# PMOSense – AI-Powered Early PMOS Risk Assessment & Awareness Platform

PMOSense is an AI-powered healthcare screening platform designed for early risk assessment and education regarding Polyendocrine Metabolic Ovarian Syndrome (PMOS). The platform utilizes Machine Learning algorithms (Random Forest) to evaluate physical symptoms, menstrual cycle patterns, and lifestyle habits, providing personalized guidelines and downloadable PDF screening reports.

---


## 🔑 Sample Login Credentials

To test the application portals, you can use the following default accounts:

| Role | Username / Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Patient (User)** | `patient@pmosense.com` | `patient123` | Pre-registered sample user/patient account |
| **Doctor** | `doctor@pmosense.com` | `doctor123` | Pre-approved sample specialist (Gynecologist/Endocrinologist) |
| **Administrator** | `admin` (or `admin@pmosense.com`) | `admin123` | Default administrative account |

---

## 🌟 Current Status & Recent Updates
- **Doctor Verification Flow**: Integrated robust verification for Doctor accounts. Doctors are required to upload a profile picture and input their Medical License Number during registration. Any subsequent modifications to these credentials require Administrator approval to go live.
- **Enhanced UI Components**: Modernized custom dropdowns that display doctor avatars, customized profile settings pages with pending-verification indicators, and an administrative dashboard for credential validation.
- **Machine Learning Integration**: The backend ML pipeline evaluates patient physical parameters to deliver personalized risk probabilities and recommendations.

---

## ⚠️ Important Medical Disclaimer
PMOSense is designed for **screening and educational awareness only**. It **does not constitute a medical diagnosis**, clinical assessment, or prescription. A final diagnostic confirmation of PMOS requires gynecological evaluation, laboratory hormone panels (measuring LH, FSH, Testosterone, etc.), and transvaginal pelvic ultrasound screenings. Users should always consult a licensed doctor for health concerns.

---

## 📁 Repository Structure
```
PMOSense/
├── dataset/                     # Contains the clinical datasets
│   └── PCOS_data_without_infertility.xlsx  # Clinical dataset modeling PMOS parameters
├── models/                      # Serialized ML assets
│   └── pcos_model.pkl           # Trained Random Forest classifier
├── machine_learning/            # Machine Learning pipeline notebooks
│   ├── PMOS_Training.ipynb      # Preprocesses, trains, evaluates, and exports the model
│   └── PMOS_Testing.ipynb       # Contains model validation & testing routines
├── backend/                     # Flask REST API Server
│   ├── app.py                   # App entry and blueprint registration
│   ├── config.py                # Environment configuration loader
│   ├── database/
│   │   └── db.py                # MongoDB client connections, collections, and admin seed
│   ├── controllers/             # Request controllers processing API logic
│   │   ├── admin_controller.py
│   │   ├── assessment_controller.py
│   │   ├── auth_controller.py
│   │   ├── consultation_controller.py
│   │   ├── education_controller.py
│   │   └── recommendation_controller.py
│   ├── routes/                  # API routing endpoints definitions
│   │   └── api.py               # Consolidated API endpoints
│   ├── services/                # Background services processing model logic
│   │   ├── predict_service.py   # Runs ML model predictions and formatting
│   │   └── recommendation_service.py # Core recommendation generation logic
│   ├── middlewares/
│   │   └── auth.py              # JWT authentication role validation middleware
│   ├── utils/
│   │   └── report_generator.py  # ReportLab PDF compile engine
│   ├── requirements.txt         # Server dependencies listing
│   └── venv/                    # Local Python virtual environment
├── frontend/                    # Vite React Client
│   ├── package.json             # NPM dependencies
│   ├── tailwind.config.js       # Tailwind theme configurations
│   ├── postcss.config.js        # PostCSS compiler configurations
│   ├── index.html               # Main HTML viewport & fonts loading
│   └── src/
│       ├── main.jsx             # React entry point
│       ├── App.jsx              # Router & Route guards
│       ├── index.css            # Custom CSS utilities & design components
│       ├── utils/
│       │   └── api.js           # Axios base request client
│       ├── components/          # Reusable components
│       │   ├── Navbar.jsx       # Header links & user menus
│       │   ├── Footer.jsx       # Disclaimer & quick links
│       │   ├── Card.jsx         # Sleek glassmorphism wrappers
│       │   └── Skeleton.jsx     # Pulse loading skeleton cards
│       └── pages/               # Application view pages
│           ├── LandingPage.jsx  # Landing & feature overview
│           ├── RegisterPage.jsx / LoginPage.jsx # Authentication portals
│           ├── UserDashboardPage.jsx / AssessmentPage.jsx # Patient workspace & screener
│           ├── DoctorDashboardPage.jsx / DoctorConsultationPage.jsx # Doctor portal
│           └── AdminDashboardPage.jsx # Administrative dashboard
├── reports/                     # Server temporary generated PDF cache folder
└── uploads/                     # Server upload items
```

---

## 🛠️ Installation & Setup

### ⚙️ Prerequisites
Ensure the following are installed:
- **Python 3.8+**
- **Node.js 18+**
- **MongoDB** (Local instance or MongoDB Atlas link)

---

### 1️⃣ Machine Learning Setup
The classification models are developed using Jupyter Notebooks. The main training and validation processes can be run in:
- `machine_learning/PMOS_Training.ipynb` (to preprocess the dataset, train, and save the serialized model as `models/pcos_model.pkl`)
- `machine_learning/PMOS_Testing.ipynb` (to test and validate the model predictions)

---

### 2️⃣ Backend Server Installation
Set up the Flask server environment:
```bash
# Navigate to backend folder
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
venv\Scripts\activate # On Windows

# Install dependencies
pip install -r requirements.txt
```

#### 📁 Backend environment variables (.env)
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
SECRET_KEY=your_super_secret_jwt_key
MONGO_URI=mongodb://localhost:27017/pmosense  # Or Atlas MongoDB connection URI

# Email settings (Required for password resets & mail verifies, mock fallback active if blank)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your_gmail@gmail.com
MAIL_PASSWORD=your_gmail_app_password
MAIL_DEFAULT_SENDER=noreply.pmosense@gmail.com
```

#### 🚀 Start Backend:
```bash
python app.py
```
*The Flask REST API will start at `http://localhost:5000`.*

---

### 3️⃣ Frontend Client Installation
Install dependencies for the React frontend:
```bash
# Navigate to frontend folder
cd ../frontend

# Install dependencies
npm install

#### 📁 Frontend environment variables (.env - Optional)
Create a `.env` file in the `frontend/` directory to configure custom backend API URLs:
```env
VITE_API_URL=http://localhost:5000/api
```

# Run in Development mode
npm run dev
```
*The React client will launch at `http://localhost:5173` (or custom port).*

---

## 🌐 Production Deployment Guide

### Database (MongoDB Atlas)
1. Sign up on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Deploy a free cluster and copy the Connection String.
3. Replace the `MONGO_URI` in the backend `.env` variables with this connection string.

### Backend (Render / Heroku)
1. Link your repository to Render.
2. Create a **Web Service**, selecting `Python` as the environment.
3. Configure the start command: `gunicorn backend.app:app`.
4. Define the Environment Variables matching `.env`.

### Frontend (Vercel)
1. Create a `Vercel` account and import the repository.
2. Select the `frontend` subfolder as the root directory.
3. Add the build override: Environment variables should contain `VITE_API_URL` pointing to your deployed backend URL (e.g. `https://pmosense-api.onrender.com/api`).
4. Click **Deploy**.

---

## 🔒 Security Practices
- **Password Protection**: Salting and hashing credentials using `bcrypt` before storage.
- **Access Authorization**: JSON Web Tokens (JWT) are signed and verified on every protected API call.
- **Role Guards**: Separation of Patient, Doctor, and Administrative routing domains on both client-side and server-side.
