# Palmistry & Tarot Intelligence Platform

An AI-powered Palmistry & Tarot Intelligence Platform that combines palm image analysis, hand landmark detection, palm feature extraction, tarot readings, and integrated personalized insights.

## Overview

The platform allows users to:

- Create and authenticate user accounts
- Upload palm images
- Analyze palm images using computer vision
- Detect hand landmarks
- Extract palm features
- Perform palm-line analysis
- Select and interpret Tarot cards
- Combine palm and Tarot insights
- Generate integrated life reports
- View analysis history
- Manage user profiles

## Technology Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Vite

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication

### Computer Vision
- OpenCV
- MediaPipe

### Machine Learning
- YOLO
- Palm feature detection
- Hand landmark analysis
- Computer vision-based feature extraction

## Project Structure

```text
Palmistry-Tarot-Integrated/
│
├── backend/
│   ├── app/
│   ├── uploads/
│   └── ...
│
├── src/
│   ├── components/
│   ├── data/
│   ├── utils/
│   ├── App.tsx
│   └── types.ts
│
├── training/
│   └── datasets/
│
├── public/
│
├── index.html
├── package.json
├── vite.config.ts
└── README.md
