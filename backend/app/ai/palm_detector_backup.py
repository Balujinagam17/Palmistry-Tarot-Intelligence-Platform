import mediapipe as mp


print("=" * 60)
print("MediaPipe file:", mp.__file__)
print("MediaPipe version:", getattr(mp, "__version__", "Unknown"))
print("Has solutions:", hasattr(mp, "solutions"))
print("Dir contains solutions:", "solutions" in dir(mp))
print("=" * 60)


class PalmDetector:
    """
    Detects a hand and extracts MediaPipe hand landmarks.

    MediaPipe handedness is interpreted assuming the input image
    is mirrored/selfie-style. The project uses normal, non-mirrored
    palm photographs, so the detected handedness is swapped before
    returning it.
    """

    def __init__(
        self,
        static_image_mode=True,
        max_num_hands=1,
        min_detection_confidence=0.7
    ):
        self.mp_hands = mp.solutions.hands

        self.hands = self.mp_hands.Hands(
            static_image_mode=static_image_mode,
            max_num_hands=max_num_hands,
            min_detection_confidence=min_detection_confidence
        )

    def detect(self, rgb_image):
        """
        Detect hand landmarks from an RGB image.

        Returns:
            {
                "success": bool,
                "landmarks": landmarks or None,
                "handedness": "Right" / "Left" / "Unknown"
            }

        Note:
            MediaPipe assumes mirrored input when interpreting
            handedness. Because this project processes normal
            non-mirrored photographs, Left and Right are swapped.
        """

        results = self.hands.process(rgb_image)

        # ---------------------------------------------------------
        # No hand detected
        # ---------------------------------------------------------

        if not results.multi_hand_landmarks:
            return {
                "success": False,
                "landmarks": None,
                "handedness": None
            }

        # ---------------------------------------------------------
        # Extract landmarks
        # ---------------------------------------------------------

        landmarks = results.multi_hand_landmarks[0]

        # ---------------------------------------------------------
        # Detect handedness
        # ---------------------------------------------------------

        handedness = "Unknown"

        if results.multi_handedness:

            media_pipe_label = (
                results
                .multi_handedness[0]
                .classification[0]
                .label
            )

            # -----------------------------------------------------
            # IMPORTANT:
            #
            # MediaPipe:
            #   Normal/mirrored assumption can reverse the label
            #
            # Project input:
            #   Normal non-mirrored photograph
            #
            # Therefore swap the result.
            # -----------------------------------------------------

            if media_pipe_label == "Left":
                handedness = "Right"

            elif media_pipe_label == "Right":
                handedness = "Left"

            else:
                handedness = "Unknown"

        # ---------------------------------------------------------
        # Return detection result
        # ---------------------------------------------------------

        return {
            "success": True,
            "landmarks": landmarks,
            "handedness": handedness
        }

    def close(self):
        """
        Release MediaPipe resources.
        """
        self.hands.close()