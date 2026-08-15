class LandmarkDetector:
    """
    Converts MediaPipe landmarks into structured coordinates.
    """

    @staticmethod
    def extract(landmarks):
        """
        Convert MediaPipe landmarks into a list of dictionaries.

        Returns:
        [
            {
                "id": 0,
                "x": 0.52,
                "y": 0.34,
                "z": -0.08
            },
            ...
        ]
        """

        extracted = []

        for idx, landmark in enumerate(landmarks.landmark):
            extracted.append({
                "id": idx,
                "x": float(landmark.x),
                "y": float(landmark.y),
                "z": float(landmark.z)
            })

        return extracted

    @staticmethod
    def get_landmark(landmarks, landmark_id):
        """
        Return a single landmark by its ID.
        """

        for landmark in landmarks:
            if landmark["id"] == landmark_id:
                return landmark

        return None