from app.ai.image_preprocessor import ImagePreprocessor
from app.ai.palm_detector import PalmDetector
from app.ai.landmark_detector import LandmarkDetector
from app.ai.feature_extractor import FeatureExtractor
from app.ai.palmistry_feature_detector import PalmistryFeatureDetector
from app.ai.rule_engine import RuleEngine
from app.ai.line_detector import LineDetector
from app.ai.line_classifier import LineClassifier
from app.ai.palm_interpreter import PalmInterpreter
from app.repositories.palm_analysis_repository import (
    PalmAnalysisRepository
)

import traceback


class PalmAnalysisService:
    """
    Complete Palm Analysis Pipeline.

    Pipeline:

        Image
          ↓
        Image Preprocessing
          ↓
        YOLO Palm Detection
          ↓
        MediaPipe Hand Landmarks
          ↓
        Geometric Feature Extraction
          ↓
        12-Class Palmistry Feature Detection
          ↓
        Palm Line Detection
          ↓
        Palm Line Classification
          ↓
        Rule Engine
          ↓
        Palm Interpretation
          ↓
        Database
    """

    def __init__(self):

        # =========================================================
        # IMAGE PREPROCESSOR
        # =========================================================

        self.preprocessor = ImagePreprocessor()

        # =========================================================
        # PALM DETECTOR
        #
        # Uses:
        #   models/palmimg.pt
        #
        # Also uses:
        #   models/hand_landmarker.task
        # =========================================================

        self.detector = PalmDetector()

        # =========================================================
        # PALMISTRY FEATURE DETECTOR
        #
        # Uses:
        #   models/palmistry_features_960_best.pt
        #
        # Detects:
        #   Water
        #   Fire
        #   Earth
        #   Air
        #   Low Low Mars
        #   High Low Mars
        #   High Line Frequency
        #   Medium Line Frequency
        #   Low Line Frequency
        #   Short Mercury Finger
        #   Long Mercury Finger
        #   Saturnus
        # =========================================================

        self.palmistry_feature_detector = (
            PalmistryFeatureDetector()
        )

    # =============================================================
    # ANALYZE
    # =============================================================

    def analyze(
        self,
        image_path,
        db,
        user_id
    ):
        """
        Complete palm analysis pipeline.

        Parameters
        ----------
        image_path : str
            Path to uploaded palm image.

        db :
            SQLAlchemy database session.

        user_id :
            ID of authenticated user.

        Returns
        -------
        dict
            Complete palm analysis result.
        """

        try:

            # =====================================================
            # STEP 1
            # =====================================================

            print("=" * 60)
            print(
                "STEP 1 : Loading and preprocessing image"
            )

            processed = (
                self.preprocessor.preprocess(
                    image_path
                )
            )

            print(
                "Image Loaded Successfully"
            )

            # =====================================================
            # STEP 2
            # =====================================================

            print("=" * 60)
            print(
                "STEP 2 : Detecting Hand / Palm"
            )

            detection = self.detector.detect(
                processed["rgb"]
            )

            if not detection["success"]:

                print(
                    "No hand detected."
                )

                return {
                    "success": False,
                    "message": (
                        "No hand detected."
                    )
                }

            print(
                "Hand Detected"
            )

            print(
                "Handedness:",
                detection.get(
                    "handedness"
                )
            )

            print(
                "Palm Confidence:",
                detection.get(
                    "palm_confidence",
                    0.0
                )
            )

            # =====================================================
            # STEP 3
            # =====================================================

            print("=" * 60)
            print(
                "STEP 3 : Extracting Landmarks"
            )

            landmarks = (
                LandmarkDetector.extract(
                    detection["landmarks"]
                )
            )

            print(
                f"Landmarks Extracted : "
                f"{len(landmarks)}"
            )

            # =====================================================
            # STEP 4
            # =====================================================

            print("=" * 60)
            print(
                "STEP 4 : Extracting Geometric Features"
            )

            features = (
                FeatureExtractor.extract_features(
                    landmarks
                )
            )

            print(
                "Features Extracted"
            )

            # =====================================================
            # STEP 5
            # =====================================================

            print("=" * 60)
            print(
                "STEP 5 : Detecting Palmistry Features"
            )

            palmistry_features = []

            # -----------------------------------------------------
            # The 12-class model works on an image region.
            #
            # We use the palm crop returned by PalmDetector.
            #
            # If it is unavailable, we safely skip this stage.
            # -----------------------------------------------------

            palm_crop = detection.get(
                "palm_crop"
            )

            if palm_crop is not None:

                try:

                    palmistry_features = (
                        self
                        .palmistry_feature_detector
                        .detect(
                            palm_crop,
                            confidence=0.25,
                            image_size=960
                        )
                    )

                except Exception as feature_error:

                    print(
                        "WARNING:"
                        " Palmistry feature"
                        " detection failed."
                    )

                    print(
                        str(feature_error)
                    )

                    palmistry_features = []

            else:

                print(
                    "WARNING:"
                    " Palm crop unavailable."
                )

            print(
                "Palmistry Features Detected :",
                len(palmistry_features)
            )

            # -----------------------------------------------------
            # Print individual detections
            # -----------------------------------------------------

            for feature in palmistry_features:

                print(
                    f"  "
                    f"{feature.get('class_name')}"
                    f" | confidence = "
                    f"{feature.get('confidence')}"
                )

            # =====================================================
            # STEP 6
            # =====================================================

            print("=" * 60)
            print(
                "STEP 6 : Detecting Palm Lines"
            )

            lines = LineDetector.detect(
                processed["original"]
            )

            print(
                f"Lines Detected : {len(lines)}"
            )

            # =====================================================
            # STEP 7
            # =====================================================

            print("=" * 60)
            print(
                "STEP 7 : Classifying Palm Lines"
            )

            classified_lines = (
                LineClassifier.classify(
                    lines,
                    processed["height"]
                )
            )

            print(
                "Palm Lines Classified"
            )

            # =====================================================
            # STEP 8
            # =====================================================

            print("=" * 60)
            print(
                "STEP 8 : Rule Engine"
            )

            rule_based = (
                RuleEngine.analyze(
                    features
                )
            )

            print(
                "Rule Engine Completed"
            )

            # =====================================================
            # STEP 9
            # =====================================================

            print("=" * 60)
            print(
                "STEP 9 : Palm Interpretation"
            )

            interpretation = (
                PalmInterpreter.interpret(
                    features,
                    classified_lines,
                    rule_based
                )
            )

            print(
                "Interpretation Generated"
            )

            # =====================================================
            # STEP 10
            # =====================================================

            print("=" * 60)
            print(
                "STEP 10 : Preparing Database Record"
            )

            analysis_data = {

                "user_id": user_id,

                "image_path": image_path,

                "hand": detection.get(
                    "handedness"
                ),

                "features": features,

                "classified_lines": (
                    classified_lines
                ),

                "interpretation": interpretation
            }

            # -----------------------------------------------------
            # IMPORTANT
            #
            # We do NOT put palmistry_features into the database
            # record here because your existing repository/model
            # structure has not been changed.
            #
            # The feature detections are returned through the API.
            # -----------------------------------------------------

            saved_analysis = (
                PalmAnalysisRepository.create(
                    db,
                    analysis_data
                )
            )

            # =====================================================
            # STEP 11
            # =====================================================

            print("=" * 60)
            print(
                "STEP 11 : Analysis Completed"
            )

            print(
                "Analysis ID:",
                saved_analysis.id
            )

            print("=" * 60)
            print(
                "PALM ANALYSIS COMPLETED SUCCESSFULLY"
            )
            print("=" * 60)

            # =====================================================
            # FINAL RESPONSE
            # =====================================================

            return {

                "success": True,

                "analysis_id": (
                    saved_analysis.id
                ),

                "hand": detection.get(
                    "handedness"
                ),

                "palm_detection": {

                    "confidence": detection.get(
                        "palm_confidence",
                        0.0
                    ),

                    "bbox": detection.get(
                        "palm_bbox"
                    )
                },

                "landmarks": landmarks,

                "landmark_count": len(
                    landmarks
                ),

                "features": features,

                "palmistry_features": (
                    palmistry_features
                ),

                "lines": lines,

                "classified_lines": (
                    classified_lines
                ),

                "rule_engine": rule_based,

                "interpretation": interpretation
            }

        # =========================================================
        # GLOBAL ERROR HANDLING
        # =========================================================

        except Exception:

            print("=" * 60)
            print(
                "ERROR DURING PALM ANALYSIS"
            )

            traceback.print_exc()

            print("=" * 60)

            return {

                "success": False,

                "message": (
                    "Palm analysis failed."
                )
            }

    # =============================================================
    # CLOSE
    # =============================================================

    def close(self):
        """
        Release AI resources.
        """

        try:

            if hasattr(
                self,
                "detector"
            ):

                self.detector.close()

        except Exception:

            pass

        try:

            if hasattr(
                self,
                "palmistry_feature_detector"
            ):

                self.palmistry_feature_detector.close()

        except Exception:

            pass