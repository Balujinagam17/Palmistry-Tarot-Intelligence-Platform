import math


class FeatureExtractor:
    """
    Extracts geometric features from MediaPipe hand landmarks.
    """

    @staticmethod
    def distance(point1, point2):
        """
        Calculate Euclidean distance between two landmarks.
        """
        return math.sqrt(
            (point1["x"] - point2["x"]) ** 2 +
            (point1["y"] - point2["y"]) ** 2
        )

    @staticmethod
    def extract_features(landmarks):
        """
        Extract palm features from landmark coordinates.
        """

        features = {}

        # Wrist
        wrist = landmarks[0]

        # Finger tips
        thumb_tip = landmarks[4]
        index_tip = landmarks[8]
        middle_tip = landmarks[12]
        ring_tip = landmarks[16]
        pinky_tip = landmarks[20]

        # Finger lengths
        features["thumb_length"] = FeatureExtractor.distance(wrist, thumb_tip)
        features["index_length"] = FeatureExtractor.distance(wrist, index_tip)
        features["middle_length"] = FeatureExtractor.distance(wrist, middle_tip)
        features["ring_length"] = FeatureExtractor.distance(wrist, ring_tip)
        features["pinky_length"] = FeatureExtractor.distance(wrist, pinky_tip)

        # Palm width
        features["palm_width"] = FeatureExtractor.distance(
            landmarks[5],
            landmarks[17]
        )

        # Palm height
        features["palm_height"] = FeatureExtractor.distance(
            wrist,
            landmarks[9]
        )

        # Aspect ratio
        if features["palm_width"] != 0:
            features["aspect_ratio"] = (
                features["palm_height"] /
                features["palm_width"]
            )
        else:
            features["aspect_ratio"] = 0

        return features