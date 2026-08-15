from app.ai.image_preprocessor import ImagePreprocessor
from app.ai.palm_detector import PalmDetector
from app.ai.landmark_detector import LandmarkDetector
from app.ai.feature_extractor import FeatureExtractor
from app.ai.rule_engine import RuleEngine
from app.ai.line_detector import LineDetector
from app.ai.line_classifier import LineClassifier
from app.ai.palm_interpreter import PalmInterpreter
from app.repositories.palm_analysis_repository import PalmAnalysisRepository

import traceback


class PalmAnalysisService:
    """
    Complete Palm Analysis Pipeline
    """

    def __init__(self):
        self.preprocessor = ImagePreprocessor()
        self.detector = PalmDetector()

    def analyze(self, image_path, db, user_id):
        """
        Complete palm analysis pipeline.
        """

        try:
            print("=" * 60)
            print("STEP 1 : Loading and preprocessing image")

            processed = self.preprocessor.preprocess(image_path)

            print("Image Loaded Successfully")

            print("=" * 60)
            print("STEP 2 : Detecting Hand")

            detection = self.detector.detect(processed["rgb"])

            if not detection["success"]:
                return {
                    "success": False,
                    "message": "No hand detected."
                }

            print("Hand Detected")

            print("=" * 60)
            print("STEP 3 : Extracting Landmarks")

            landmarks = LandmarkDetector.extract(
                detection["landmarks"]
            )

            print(f"Landmarks Extracted : {len(landmarks)}")

            print("=" * 60)
            print("STEP 4 : Extracting Features")

            features = FeatureExtractor.extract_features(
                landmarks
            )

            print("Features Extracted")

            print("=" * 60)
            print("STEP 5 : Detecting Palm Lines")

            lines = LineDetector.detect(
                processed["original"]
            )

            print(f"Lines Detected : {len(lines)}")

            print("=" * 60)
            print("STEP 6 : Classifying Palm Lines")

            classified_lines = LineClassifier.classify(
                lines,
                processed["height"]
            )

            print("Palm Lines Classified")

            print("=" * 60)
            print("STEP 7 : Rule Engine")

            rule_based = RuleEngine.analyze(
                features
            )

            print("Rule Engine Completed")

            print("=" * 60)
            print("STEP 8 : Palm Interpretation")

            interpretation = PalmInterpreter.interpret(
                features,
                classified_lines
            )

            analysis_data = {
                "user_id": user_id,
                "image_path": image_path,
                "hand": detection["handedness"],
                "features": features,
                "classified_lines": classified_lines,
                "interpretation": interpretation
            }

            saved_analysis = PalmAnalysisRepository.create(
                db,
                analysis_data
            )

            print("Interpretation Generated")

            print("=" * 60)
            print("PALM ANALYSIS COMPLETED SUCCESSFULLY")
            print("=" * 60)

            return {
                "success": True,
                "analysis_id": saved_analysis.id,
                "hand": detection["handedness"],
                "features": features,
                "lines": lines,
                "classified_lines": classified_lines,
                "rule_engine": rule_based,
                "interpretation": interpretation
            }

        except Exception:
            print("=" * 60)
            print("ERROR DURING PALM ANALYSIS")
            traceback.print_exc()
            print("=" * 60)

            return {
                "success": False,
                "message": "Palm analysis failed."
            }

    def close(self):
        self.detector.close()