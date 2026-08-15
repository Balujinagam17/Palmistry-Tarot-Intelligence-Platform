# Palmistry & Tarot Intelligence Platform - AI Architecture & Manual Training Guide

This repository contains the complete production-ready application architecture for the **Palmistry & Tarot Intelligence Platform**.

> ⚠️ **IMPORTANT NOTE FOR DEVELOPERS & DATA SCIENTISTS**:
> AI model weight files are **NOT** pre-packaged in this platform repository. The AI model training scripts included in `training/` are structured as **clean code skeletons** with configuration settings, folder paths, and TODO sections.> AI model weight files are not pre-packaged in this repository. The AI model training scripts included in `training/` provide the configuration, folder structure, dataset paths, and training workflow required to train the models separately.

---

## 📂 1. Directory Structure

```text
├── backend/
│   ├── app/
│   │   └── ai/
│   │       └── model_loader.py          # Dynamic model loader (raises exception if weights missing)
│   ├── models/                           # Directory where your trained weights should be copied
│   │   ├── palm_detection/               # Copy best.pt here
│   │   ├── palm_line_detection/          # Copy line_model.pth here
│   │   ├── hand_landmarks/               # Copy hand_landmarks.onnx here
│   │   ├── tarot_classifier/             # Copy tarot_resnet50.pth here
│   │   ├── personality_model/            # Copy personality_clf.pkl here
│   │   └── recommendation_model/         # Copy rec_transformer.pkl here
│   └── .env                              # Model weight environment path configuration
│
├── datasets/                             # Dataset storage folders
│   ├── palmistry/                        # Place raw palm images & labels here
│   ├── hand_landmarks/                   # Place hand landmark coordinate files here
│   ├── tarot_cards/                      # Place 78 card subfolders here
│   ├── annotations/                      # Place COCO/YOLO label files here
│   └── processed/                        # Output folder for preprocessed train/val/test splits
│
└── training/                             # Training script skeletons with TODO sections
    ├── dataset_preprocessing.py          # Dataset cleaning, COCO->YOLO & splitting template
    ├── train_palm_detection.py           # YOLO Palm Detector training template
    ├── train_palm_lines.py               # PyTorch U-Net Palm Line Segmentation template
    ├── train_hand_landmarks.py           # 21 Hand Landmark Regressor training template
    ├── train_tarot_classifier.py         # 78 Tarot Arcana Card Classifier training template
    ├── train_personality_model.py        # Personality Archetype Classifier training template
    ├── train_recommendation_model.py     # KNN Vector Recommendation Engine template
    ├── evaluate_models.py                # Multi-model benchmark evaluation template
    └── predict.py                        # Standalone CLI prediction inference template
```

---

## 📥 2. Where to Place Datasets

Place your raw datasets inside the subfolders of `datasets/`:

1. **Palmistry Dataset**: `datasets/palmistry/`
   - `images/`: Raw JPG/PNG palm photographs.
   - `labels/`: YOLO format `.txt` bounding box annotation files.
   - `masks/`: PNG binary line segmentation masks.

2. **Hand Landmark Dataset**: `datasets/hand_landmarks/`
   - Image files and corresponding `.json`/`.csv` 21 landmark coordinate annotations `(x, y)`.

3. **Tarot Card Dataset**: `datasets/tarot_cards/`
   - Create 78 subfolders named after each card class (e.g. `00_The_Fool/`, `01_The_Magician/`, `Wands_01_Ace/`, etc.) and add card photos inside.

4. **Annotations**: `datasets/annotations/`
   - Raw COCO JSON files or XML annotations.

---

## ✏️ 3. Which Files to Edit for Training

Open the corresponding script in `training/` and implement your custom training loop inside the `TODO` sections:

- **Palm Detection**: Edit `training/train_palm_detection.py`
- **Palm Line Segmentation**: Edit `training/train_palm_lines.py`
- **Hand Landmarks**: Edit `training/train_hand_landmarks.py`
- **Tarot Classifier**: Edit `training/train_tarot_classifier.py`
- **Personality Model**: Edit `training/train_personality_model.py`
- **Recommendation Engine**: Edit `training/train_recommendation_model.py`
- **Data Preprocessing**: Edit `training/dataset_preprocessing.py`
- **Model Evaluation**: Edit `training/evaluate_models.py`
- **CLI Testing**: Edit `training/predict.py`

---

## 🚀 4. How to Train Models & Copy Weights

After implementing your training pipelines:

1. **Execute Training**:

   ```bash
   python training/train_palm_detection.py
   python training/train_palm_lines.py
   python training/train_hand_landmarks.py
   python training/train_tarot_classifier.py
   python training/train_personality_model.py
   python training/train_recommendation_model.py
   ```

2. **Copy Trained Weights to Output Destinations**:
   - Save YOLO Palm Detection model to: `backend/models/palm_detection/best.pt`
   - Save Palm Line Segmentation model to: `backend/models/palm_line_detection/line_model.pth`
   - Save Hand Landmark ONNX model to: `backend/models/hand_landmarks/hand_landmarks.onnx`
   - Save Tarot Card Classifier model to: `backend/models/tarot_classifier/tarot_resnet50.pth`
   - Save Personality Classifier model to: `backend/models/personality_model/personality_clf.pkl`
   - Save Recommendation Engine model to: `backend/models/recommendation_model/rec_transformer.pkl`

---

## ⚙️ 5. How the Backend Loads Model Weights

1. Model weight file paths are specified in `backend/.env`:

   ```env
   PALM_MODEL_PATH=backend/models/palm_detection/best.pt
   LINE_MODEL_PATH=backend/models/palm_line_detection/line_model.pth
   HAND_MODEL_PATH=backend/models/hand_landmarks/hand_landmarks.onnx
   TAROT_MODEL_PATH=backend/models/tarot_classifier/tarot_resnet50.pth
   PERSONALITY_MODEL_PATH=backend/models/personality_model/personality_clf.pkl
   RECOMMENDATION_MODEL_PATH=backend/models/recommendation_model/rec_transformer.pkl
   ```

2. The backend application uses `backend/app/ai/model_loader.py` to check for model files.
   - If a model file is missing, the backend returns HTTP 503 Service Unavailable:
     ```json
     {
       "success": false,
       "message": "Model not trained yet. Please train the model externally and place the weights in backend/models/."
     }
     ```
   - Once trained model weights are copied into `backend/models/`, the backend detects the files and activates model inference.
