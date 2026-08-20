class LandmarkDetector:
    """
    Converts MediaPipe Tasks API landmarks
    into the structured format used by the project.

    Supports:
        MediaPipe Tasks API
        MediaPipe Solutions-style landmarks
    """

    @staticmethod
    def extract(landmarks):
        """
        Convert MediaPipe landmarks into:

        [
            {
                "id": 0,
                "x": 0.52,
                "y": 0.34,
                "z": -0.08
            },
            ...
        ]

        The current MediaPipe Tasks API returns
        a list of NormalizedLandmark objects.
        """

        extracted = []

        if landmarks is None:
            return extracted

        # ---------------------------------------------------------
        # Current MediaPipe Tasks API
        #
        # landmarks is usually:
        #
        # [
        #     NormalizedLandmark,
        #     NormalizedLandmark,
        #     ...
        # ]
        # ---------------------------------------------------------

        if isinstance(
            landmarks,
            (list, tuple)
        ):

            for idx, landmark in enumerate(
                landmarks
            ):

                extracted.append({

                    "id": idx,

                    "x": float(
                        landmark.x
                    ),

                    "y": float(
                        landmark.y
                    ),

                    "z": float(
                        landmark.z
                    )
                })

            return extracted

        # ---------------------------------------------------------
        # Older MediaPipe Solutions API
        #
        # landmarks.landmark
        # ---------------------------------------------------------

        if hasattr(
            landmarks,
            "landmark"
        ):

            for idx, landmark in enumerate(
                landmarks.landmark
            ):

                extracted.append({

                    "id": idx,

                    "x": float(
                        landmark.x
                    ),

                    "y": float(
                        landmark.y
                    ),

                    "z": float(
                        landmark.z
                    )
                })

            return extracted

        # ---------------------------------------------------------
        # Unknown format
        # ---------------------------------------------------------

        raise TypeError(
            "Unsupported MediaPipe landmark format: "
            f"{type(landmarks)}"
        )

    @staticmethod
    def get_landmark(
        landmarks,
        landmark_id
    ):
        """
        Return a single landmark by ID.
        """

        if landmarks is None:
            return None

        for landmark in landmarks:

            if landmark["id"] == landmark_id:

                return landmark

        return None