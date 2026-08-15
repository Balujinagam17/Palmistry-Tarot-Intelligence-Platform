# Palmistry & Tarot Intelligence Platform

An AI-powered Palmistry & Tarot Intelligence Platform that combines palm image analysis, hand landmark detection, palm feature extraction, Tarot card interpretation, and integrated personalized insights.

## Overview

The platform provides an integrated experience for analyzing palm images and Tarot selections to generate personalized spiritual and reflective insights.

### Core Capabilities

- User registration and authentication
- JWT-based authentication
- User profile management
- Palm image upload
- Palm and hand detection
- MediaPipe hand landmark extraction
- Palm feature extraction
- Palm analysis
- Tarot card selection
- Tarot spread interpretation
- Integrated palm + Tarot analysis
- Personality insights
- Career guidance
- Relationship guidance
- Finance insights
- Wellness-oriented recommendations
- Personal growth guidance
- Life trend analysis
- Personalized integrated reports
- Analysis history

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Motion

### Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- OAuth2 Password Bearer

### Computer Vision

- OpenCV
- MediaPipe
- Hand landmark detection
- Palm feature extraction

### Machine Learning

- YOLO
- Computer Vision
- Palm detection
- Hand landmark analysis
- Feature extraction
- Model training and evaluation

### Development & Deployment

- Git
- GitHub
- Docker
- Google Colab for model training

---

## System Architecture

```text
                    USER
                      │
                      ▼
              React Frontend
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
    Palm Analysis             Tarot Reading
          │                       │
          ▼                       ▼
    Palm Detection          Card Selection
          │                       │
          ▼                       ▼
    Hand Landmarks          Tarot Interpretation
          │                       │
          ▼                       │
    Palm Features                │
          │                       │
          └───────────┬───────────┘
                      │
                      ▼
             Integrated Analysis
                      │
                      ▼
             Intelligence Engine
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
       Insights    Life Trends  Guidance
          │           │           │
          └───────────┼───────────┘
                      │
                      ▼
              Personalized Report
```

#Palm Analysis Pipeline

Palm Image
│
▼
Palm / Hand Detection
│
▼
MediaPipe Hand Landmarks
│
▼
21 Hand Landmarks
│
▼
Palm Feature Extraction
│
├── Thumb Length
├── Index Length
├── Middle Length
├── Ring Length
├── Pinky Length
├── Palm Width
├── Palm Height
└── Aspect Ratio
│
▼
Palm Feature Analysis
│
▼
Palm Interpretation

#Tarot Analysis Pipeline

Tarot Sanctuary
│
▼
Card Selection
│
▼
Tarot Spread
│
▼
Card Interpretation
│
▼
Elemental Balance
│
▼
Tarot Insights

#Integrated Reading Pipeline

Palm Analysis +
Tarot Analysis
│
▼
Confidence Calculation
│
▼
Radar Metrics
│
├── Intuition
├── Ambition
├── Empathy
├── Logic
├── Resilience
└── Creativity
│
▼
Spiritual Guidance Score
│
▼
Personality Archetype
│
▼
Life Trends
│
▼
Multi-Domain Guidance
│
├── Career
├── Relationships
├── Finance
├── Health & Wellness
└── Personal Growth
│
▼
Risk Indicators
│
▼
Recommendations
│
▼
Integrated Life Report

#Project Structure

Palmistry-Tarot-Integrated/
│
├── backend/
│ ├── app/
│ │ ├── ai/
│ │ │ └── palm_detector.py
│ │ │
│ │ ├── api/
│ │ │ └── v1/
│ │ │ ├── auth.py
│ │ │ ├── profile.py
│ │ │ ├── users.py
│ │ │ └── palm.py
│ │ │
│ │ ├── core/
│ │ │ └── config.py
│ │ │
│ │ ├── database/
│ │ │ └── postgres.py
│ │ │
│ │ ├── models/
│ │ │ ├── user.py
│ │ │ ├── palm_image.py
│ │ │ └── palm_analysis.py
│ │ │
│ │ ├── services/
│ │ │ └── palm_analysis_service.py
│ │ │
│ │ └── main.py
│ │
│ ├── uploads/
│ └── venv311/
│
├── src/
│ ├── components/
│ │ ├── AnalyticsHistoryView.tsx
│ │ ├── AuthModal.tsx
│ │ ├── DashboardView.tsx
│ │ ├── IntegratedReadingView.tsx
│ │ ├── LandingPageView.tsx
│ │ ├── LegalPagesView.tsx
│ │ ├── Navbar.tsx
│ │ ├── PalmScannerView.tsx
│ │ ├── ProfileSettingsView.tsx
│ │ ├── TarotCardVisual.tsx
│ │ └── TarotSanctuaryView.tsx
│ │
│ ├── data/
│ │ └── knowledge_base/
│ │ ├── personality_kb.json
│ │ └── recommendations_kb.json
│ │
│ ├── utils/
│ │
│ ├── App.tsx
│ ├── main.tsx
│ ├── index.css
│ └── types.ts
│
├── training/
│ └── datasets/
│ ├── palmar/
│ ├── palm_gloves/
│ └── coep/
│
├── public/
│
├── index.html
├── package.json
├── vite.config.ts
├── server.ts
├── README.md
└── README_TRAINING.md

Backend API

The backend is implemented using FastAPI.

Authentication
Register
POST /api/v1/auth/register
Login
POST /api/v1/auth/login
Current Profile
GET /api/v1/profile/me

Palm Analysis
Upload Palm Image
POST /api/v1/palm/upload
Analyze Palm Image
POST /api/v1/palm/analyze/{image_id}
Palm Analysis History
GET /api/v1/palm/history
Authentication Flow
User
│
▼
Register
│
▼
Login
│
▼
JWT Token
│
▼
Authorization Header
│
▼
Protected API Endpoints

Protected requests use:

Authorization: Bearer <JWT_TOKEN>

Running the Frontend

1. Install dependencies

From the project root:

npm install 2. Start the development server
npm run dev

The frontend is available at:

http://localhost:3000
Running the Backend

Open a second terminal.

Navigate to the backend:

cd backend

Activate the Python 3.11 virtual environment:

venv311\Scripts\activate

Verify Python:

python --version

Expected:

Python 3.11.9

Start FastAPI:

python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

Backend:

http://127.0.0.1:8000

FastAPI documentation:

http://127.0.0.1:8000/docs
Running Frontend and Backend Together

Two terminals are required during development.

Terminal 1 — Frontend
cd "C:\Users\haksh\OneDrive\Desktop\Palmistry-Tarot-Integrated"
npm run dev

Frontend:

http://localhost:3000
Terminal 2 — Backend
cd "C:\Users\haksh\OneDrive\Desktop\Palmistry-Tarot-Integrated\backend"
venv311\Scripts\activate
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

Backend:

http://127.0.0.1:8000
Computer Vision Environment

The palm analysis backend uses Python 3.11.

The tested environment includes:

Python 3.11.9
OpenCV 4.11.0
MediaPipe 0.10.21
bcrypt 4.0.1

MediaPipe hand detection provides 21 hand landmarks used by the palm analysis pipeline.

Machine Learning Training

The training/ directory is used for dataset organization and machine learning development.

The project is being extended with trained palm detection models to improve palm localization and analysis reliability.

Current Training Approach
Palm Dataset
│
▼
Dataset Validation
│
▼
YOLO Training
│
▼
Model Evaluation
│
▼
best.pt
│
▼
Palm Detection
│
▼
MediaPipe Landmarks
│
▼
Palm Feature Extraction
Dataset Organization
training/
└── datasets/
├── palmar/
│ ├── images/
│ │ ├── train/
│ │ ├── val/
│ │ └── test/
│ │
│ └── labels/
│ ├── train/
│ ├── val/
│ └── test/
│
├── palm_gloves/
│
└── coep/

Trained model weights are generated separately and are not included in the source repository unless explicitly required.

Machine Learning Model Integration

The trained palm detector is intended to improve palm localization before landmark extraction.

Input Image
│
▼
YOLO Palm Detector
│
▼
Detected Palm Region
│
▼
MediaPipe Hands
│
▼
21 Landmarks
│
▼
Feature Extraction
│
▼
Palm Analysis

This approach allows the existing MediaPipe-based feature extraction pipeline to work together with the trained palm detection model.

Frontend Views

The frontend contains the following major views.

Landing Page

Introduces the platform and provides access to the main analysis features.

Authentication

Supports:

Sign in
Registration
Password recovery interface
Dashboard

Displays the user's primary analysis information and recent reports.

Palm Scanner

Provides:

Palm image capture
Image upload
Palm analysis
Analysis results
Tarot Sanctuary

Provides:

Tarot card selection
Tarot spread creation
Card interpretation
Elemental analysis
Integrated Reading

Combines:

Palm analysis
Tarot analysis
Personality metrics
Life trends
Domain guidance
Recommendations
History & Analytics

Provides access to previous reports and analysis history.

Profile Settings

Allows users to manage their profile information.

Integrated Intelligence Metrics

The integrated report calculates several metrics:

Intuition
Ambition
Empathy
Logic
Resilience
Creativity

These metrics are combined with palm-analysis features and Tarot elemental influences.

The system also generates:

Spiritual Guidance Score
Confidence Score
Personality Archetype
Life Trends
Domain Scores
Risk Indicators
Recommendations
Knowledge Base

The frontend contains knowledge-base resources used for generating recommendations and personality interpretations.

src/
└── data/
└── knowledge_base/
├── personality_kb.json
└── recommendations_kb.json

These resources support the integrated interpretation workflow.

Database

The backend uses PostgreSQL.

The database stores application information such as:

User accounts
User profiles
Uploaded palm images
Palm analysis results
Analysis history

SQLAlchemy is used for database interaction.

Build for Production

To create a production build:

npm run build

The Vite frontend build is generated in:

dist/

The project also generates the bundled server file according to the project's build configuration.

Development Verification

Before committing changes, verify the frontend:

npm run build

Verify the backend:

cd backend
venv311\Scripts\activate
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

Then open:

http://127.0.0.1:8000/docs

Verify the main API workflow:

Register
↓
Login
↓
JWT Authentication
↓
Palm Upload
↓
Palm Analysis
↓
Analysis History
Git Workflow

Check the current repository state:

git status

Check the remote repository:

git remote -v

Add changes:

git add .

Commit:

git commit -m "Update Palmistry Tarot Intelligence Platform"

Push:

git push
Project Status
Module Status
Frontend Implemented
React UI Implemented
User Registration Implemented
User Login Implemented
JWT Authentication Implemented
PostgreSQL Integration Implemented
Palm Image Upload Implemented
Palm Detection Implemented
MediaPipe Hand Landmarks Implemented
Palm Feature Extraction Implemented
Palm Analysis API Implemented
Tarot Card Selection Implemented
Tarot Interpretation Implemented
Integrated Reading Implemented
Analysis History Implemented
Personalized Reports Implemented
ML Dataset Preparation In Progress
Trained Palm Detection Model In Progress
Production Deployment Pending
Future Improvements

Planned improvements include:

Improved palm detection using trained ML models
Improved palm-line detection
More robust feature extraction
Improved hand orientation detection
Better right-hand and left-hand classification
Expanded palm analysis datasets
Model performance evaluation
Improved personalized recommendations
Production deployment
Model optimization for faster inference
Disclaimer

Palmistry and Tarot interpretations generated by this platform are intended for entertainment, reflection, and personal exploration.

The generated insights should not be considered medical, financial, legal, psychological, or professional advice.

Users should consult qualified professionals for decisions requiring professional expertise.

License

This project is developed for educational, research, and project demonstration purposes.

Third-party datasets, libraries, models, and other resources remain subject to their respective licenses and terms of use.
