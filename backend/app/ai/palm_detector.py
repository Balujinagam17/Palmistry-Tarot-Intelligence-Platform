import cv2
import numpy as np
from pathlib import Path

from ultralytics import YOLO

import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision


class PalmDetector:
    """
    YOLO + MediaPipe palm/hand detector.

    The image itself is NEVER flipped or mirrored.

    YOLO:
        Detects the palm region.

    MediaPipe:
        Detects 21 hand landmarks.

    Handedness:
        MediaPipe's raw Left/Right result is swapped before
        returning it because the project's expected hand name
        is opposite to MediaPipe's label for these images.
    """

    def __init__(
        self,
        palm_model_path=None,
        hand_landmarker_path=None,
        palm_confidence=0.25,
        hand_confidence=0.25,
    ):

        # =========================================================
        # MODEL PATHS
        # =========================================================

        backend_dir = Path(
            __file__
        ).resolve().parents[2]

        if palm_model_path is None:
            palm_model_path = (
                backend_dir
                / "models"
                / "palmimg.pt"
            )

        if hand_landmarker_path is None:
            hand_landmarker_path = (
                backend_dir
                / "models"
                / "hand_landmarker.task"
            )

        self.palm_model_path = Path(
            palm_model_path
        )

        self.hand_landmarker_path = Path(
            hand_landmarker_path
        )

        self.palm_confidence = float(
            palm_confidence
        )

        self.hand_confidence = float(
            hand_confidence
        )

        # =========================================================
        # CHECK MODEL FILES
        # =========================================================

        if not self.palm_model_path.exists():
            raise FileNotFoundError(
                "YOLO palm model not found:\n"
                f"{self.palm_model_path}"
            )

        if not self.hand_landmarker_path.exists():
            raise FileNotFoundError(
                "MediaPipe hand landmarker not found:\n"
                f"{self.hand_landmarker_path}"
            )

        # =========================================================
        # LOAD YOLO
        # =========================================================

        self.palm_model = YOLO(
            str(self.palm_model_path)
        )

        print(
            "YOLO palm detector loaded"
        )

        # =========================================================
        # LOAD MEDIAPIPE TASKS
        # =========================================================

        base_options = python.BaseOptions(
            model_asset_path=str(
                self.hand_landmarker_path
            )
        )

        options = vision.HandLandmarkerOptions(
            base_options=base_options,
            running_mode=vision.RunningMode.IMAGE,
            num_hands=1,
            min_hand_detection_confidence=(
                self.hand_confidence
            ),
            min_hand_presence_confidence=(
                self.hand_confidence
            ),
            min_tracking_confidence=(
                self.hand_confidence
            ),
        )

        self.hand_landmarker = (
            vision.HandLandmarker.create_from_options(
                options
            )
        )

        print(
            "MediaPipe hand landmarker loaded"
        )

    # =============================================================
    # YOLO PALM DETECTION
    # =============================================================

    def _detect_palm(self, image):

        results = self.palm_model.predict(
            source=image,
            conf=self.palm_confidence,
            verbose=False,
        )

        if not results:
            return None

        result = results[0]

        if result.boxes is None:
            return None

        if len(result.boxes) == 0:
            return None

        # ---------------------------------------------------------
        # Highest confidence detection
        # ---------------------------------------------------------

        best_index = int(
            result.boxes.conf.argmax().item()
        )

        box = result.boxes[
            best_index
        ]

        confidence = float(
            box.conf.item()
        )

        xyxy = (
            box.xyxy[0]
            .cpu()
            .numpy()
        )

        x1, y1, x2, y2 = [
            int(value)
            for value in xyxy
        ]

        height, width = image.shape[:2]

        x1 = max(
            0,
            min(
                x1,
                width - 1
            )
        )

        y1 = max(
            0,
            min(
                y1,
                height - 1
            )
        )

        x2 = max(
            x1 + 1,
            min(
                x2,
                width
            )
        )

        y2 = max(
            y1 + 1,
            min(
                y2,
                height
            )
        )

        return {
            "confidence": confidence,
            "bbox": [
                x1,
                y1,
                x2,
                y2,
            ],
        }

    # =============================================================
    # CREATE PADDED CROP
    # =============================================================

    @staticmethod
    def _crop_with_padding(
        image,
        bbox,
        padding_x,
        padding_y,
    ):

        height, width = image.shape[:2]

        x1, y1, x2, y2 = bbox

        box_width = x2 - x1
        box_height = y2 - y1

        pad_x = int(
            box_width * padding_x
        )

        pad_y = int(
            box_height * padding_y
        )

        crop_x1 = max(
            0,
            x1 - pad_x
        )

        crop_y1 = max(
            0,
            y1 - pad_y
        )

        crop_x2 = min(
            width,
            x2 + pad_x
        )

        crop_y2 = min(
            height,
            y2 + pad_y
        )

        if crop_x2 <= crop_x1:
            return None

        if crop_y2 <= crop_y1:
            return None

        crop = image[
            crop_y1:crop_y2,
            crop_x1:crop_x2
        ]

        if crop.size == 0:
            return None

        return crop

    # =============================================================
    # MEDIAPIPE HAND DETECTION
    # =============================================================

    def _detect_hand(self, image):

        if image is None:
            return None

        if image.size == 0:
            return None

        try:

            # -----------------------------------------------------
            # BGR → RGB
            #
            # The test file and API pass the original OpenCV BGR
            # image. Conversion is done only here.
            #
            # No image flipping.
            # No image mirroring.
            # -----------------------------------------------------

            rgb_image = cv2.cvtColor(
                image,
                cv2.COLOR_BGR2RGB
            )

            mp_image = mp.Image(
                image_format=(
                    mp.ImageFormat.SRGB
                ),
                data=rgb_image,
            )

            result = (
                self.hand_landmarker.detect(
                    mp_image
                )
            )

            if result is None:
                return None

            if not result.hand_landmarks:
                return None

            landmarks = (
                result.hand_landmarks[0]
            )

            handedness = (
                self._get_handedness(
                    result
                )
            )

            return {
                "landmarks": landmarks,
                "handedness": handedness,
            }

        except Exception as error:

            print(
                "MediaPipe error:",
                str(error)
            )

            return None

    # =============================================================
    # HANDEDNESS
    # =============================================================

    @staticmethod
    def _get_handedness(result):

        try:

            if result is None:
                return "Unknown"

            handedness_data = getattr(
                result,
                "handedness",
                None
            )

            if not handedness_data:
                return "Unknown"

            first = handedness_data[0]

            category = None

            # -----------------------------------------------------
            # MediaPipe Tasks normally returns:
            #
            # handedness[0] = list of Category objects
            # -----------------------------------------------------

            if isinstance(
                first,
                (list, tuple)
            ):

                if len(first) > 0:
                    category = first[0]

            elif hasattr(
                first,
                "category_name"
            ):

                category = first

            elif hasattr(
                first,
                "categories"
            ):

                categories = (
                    first.categories
                )

                if categories:
                    category = categories[0]

            if category is None:
                return "Unknown"

            raw_label = getattr(
                category,
                "category_name",
                None
            )

            print(
                "RAW MEDIAPIPE HANDEDNESS:",
                raw_label
            )

            # =====================================================
            # IMPORTANT
            #
            # DO NOT FLIP THE IMAGE.
            #
            # DO NOT MIRROR THE IMAGE.
            #
            # ONLY SWAP THE LABEL RETURNED TO THE APPLICATION.
            # =====================================================

            if raw_label == "Left":

                return "Right"

            if raw_label == "Right":

                return "Left"

            return "Unknown"

        except Exception as error:

            print(
                "Handedness extraction error:",
                str(error)
            )

            return "Unknown"

    # =============================================================
    # MAIN DETECTION
    # =============================================================

    def detect(self, image):

        if image is None:

            return {
                "success": False,
                "landmarks": None,
                "handedness": None,
                "palm_confidence": 0.0,
                "palm_bbox": None,
            }

        if not isinstance(
            image,
            np.ndarray
        ):

            raise TypeError(
                "PalmDetector.detect() "
                "expects a numpy image."
            )

        if image.size == 0:

            return {
                "success": False,
                "landmarks": None,
                "handedness": None,
                "palm_confidence": 0.0,
                "palm_bbox": None,
            }

        # =========================================================
        # YOLO PALM DETECTION
        # =========================================================

        palm = self._detect_palm(
            image
        )

        if palm is None:

            print(
                "YOLO could not detect palm."
            )

            return {
                "success": False,
                "landmarks": None,
                "handedness": None,
                "palm_confidence": 0.0,
                "palm_bbox": None,
            }

        bbox = palm[
            "bbox"
        ]

        confidence = palm[
            "confidence"
        ]

        print(
            f"YOLO palm confidence: "
            f"{confidence:.4f}"
        )

        print(
            "YOLO palm bbox:",
            bbox
        )

        # =========================================================
        # MEDIAPIPE CROP ATTEMPTS
        # =========================================================

        crop_settings = [
            (
                "YOLO padded crop",
                0.20,
                0.20,
            ),
            (
                "YOLO medium padded crop",
                0.35,
                0.35,
            ),
            (
                "YOLO large padded crop",
                0.50,
                0.50,
            ),
            (
                "YOLO extra padded crop",
                0.70,
                0.70,
            ),
        ]

        successful_detection = None

        for (
            crop_name,
            padding_x,
            padding_y
        ) in crop_settings:

            crop = (
                self._crop_with_padding(
                    image,
                    bbox,
                    padding_x,
                    padding_y,
                )
            )

            if crop is None:
                continue

            print(
                f"Trying MediaPipe: "
                f"{crop_name}"
            )

            detection = (
                self._detect_hand(
                    crop
                )
            )

            if detection is not None:

                print(
                    "MediaPipe success:",
                    crop_name
                )

                successful_detection = (
                    detection
                )

                break

            print(
                "MediaPipe failed:",
                crop_name
            )

        # =========================================================
        # FULL IMAGE FALLBACK
        # =========================================================

        if successful_detection is None:

            print(
                "Trying MediaPipe: "
                "full image fallback"
            )

            detection = (
                self._detect_hand(
                    image
                )
            )

            if detection is not None:

                print(
                    "MediaPipe success: "
                    "full image fallback"
                )

                successful_detection = (
                    detection
                )

        # =========================================================
        # NO HAND
        # =========================================================

        if successful_detection is None:

            print(
                "No hand detected."
            )

            return {
                "success": False,
                "landmarks": None,
                "handedness": None,
                "palm_confidence": confidence,
                "palm_bbox": bbox,
            }

        # =========================================================
        # SUCCESS
        # =========================================================

        return {
            "success": True,
            "landmarks": (
                successful_detection[
                    "landmarks"
                ]
            ),
            "handedness": (
                successful_detection[
                    "handedness"
                ]
            ),
            "palm_confidence": confidence,
            "palm_bbox": bbox,
        }

    # =============================================================
    # CLOSE
    # =============================================================

    def close(self):

        try:

            if (
                hasattr(
                    self,
                    "hand_landmarker"
                )
                and
                self.hand_landmarker
                is not None
            ):

                self.hand_landmarker.close()

        except Exception as error:

            print(
                "Error closing MediaPipe:",
                str(error)
            )