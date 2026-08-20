from pathlib import Path

from ultralytics import YOLO


class PalmistryFeatureDetector:
    """
    Detects palmistry-specific features using the
    trained 12-class YOLO model.

    Model:
        models/palmistry_features_960_best.pt

    The detector returns structured information that
    can be directly added to the palm analysis result.
    """

    CLASS_NAMES = {
        0: "Water",
        1: "Fire",
        2: "Earth",
        3: "Air",
        4: "Low Low Mars",
        5: "High Low Mars",
        6: "High Line Frequency",
        7: "Medium Line Frequency",
        8: "Low Line Frequency",
        9: "Short Mercury Finger",
        10: "Long Mercury Finger",
        11: "Saturnus"
    }

    def __init__(
        self,
        model_path="models/palmistry_features_960_best.pt",
        confidence=0.25,
        image_size=960
    ):
        """
        Initialize the trained palmistry feature detector.

        Parameters
        ----------
        model_path : str
            Path to trained YOLO model.

        confidence : float
            Minimum detection confidence.

        image_size : int
            YOLO inference image size.
        """

        self.model_path = Path(model_path)

        self.confidence = confidence

        self.image_size = image_size

        # ---------------------------------------------------------
        # Verify model exists
        # ---------------------------------------------------------

        if not self.model_path.exists():

            raise FileNotFoundError(
                "Palmistry feature model not found:\n"
                f"{self.model_path.resolve()}"
            )

        # ---------------------------------------------------------
        # Load YOLO model
        # ---------------------------------------------------------

        self.model = YOLO(
            str(self.model_path)
        )

        # ---------------------------------------------------------
        # Make sure model has expected classes
        # ---------------------------------------------------------

        model_names = getattr(
            self.model,
            "names",
            None
        )

        if model_names is not None:

            print(
                "Palmistry feature model loaded:"
            )

            print(
                f"Classes: {len(model_names)}"
            )

    # =============================================================
    # DETECT FEATURES
    # =============================================================

    def detect(
        self,
        image,
        confidence=None,
        image_size=None
    ):
        """
        Detect palmistry features.

        Parameters
        ----------
        image : numpy.ndarray or image path
            Input palm image or palm crop.

        confidence : float, optional
            Override default confidence.

        image_size : int, optional
            Override default YOLO image size.

        Returns
        -------
        list
            Example:

            [
                {
                    "class_id": 8,
                    "class_name": "Low Line Frequency",
                    "confidence": 0.7612,
                    "bbox": [103, 134, 311, 375]
                }
            ]
        """

        if image is None:

            return []

        # ---------------------------------------------------------
        # Use supplied values or defaults
        # ---------------------------------------------------------

        conf = (
            self.confidence
            if confidence is None
            else confidence
        )

        imgsz = (
            self.image_size
            if image_size is None
            else image_size
        )

        # ---------------------------------------------------------
        # Run YOLO inference
        # ---------------------------------------------------------

        results = self.model.predict(
            source=image,
            imgsz=imgsz,
            conf=conf,
            device="cpu",
            verbose=False
        )

        if not results:

            return []

        result = results[0]

        boxes = result.boxes

        if boxes is None or len(boxes) == 0:

            return []

        # ---------------------------------------------------------
        # Extract detections
        # ---------------------------------------------------------

        detections = []

        class_ids = (
            boxes.cls
            .detach()
            .cpu()
            .numpy()
        )

        confidences = (
            boxes.conf
            .detach()
            .cpu()
            .numpy()
        )

        xyxy_boxes = (
            boxes.xyxy
            .detach()
            .cpu()
            .numpy()
        )

        # ---------------------------------------------------------
        # Build structured detections
        # ---------------------------------------------------------

        for class_id, score, bbox in zip(
            class_ids,
            confidences,
            xyxy_boxes
        ):

            class_id = int(
                class_id
            )

            score = float(
                score
            )

            x1, y1, x2, y2 = (
                bbox.astype(int)
            )

            class_name = self.CLASS_NAMES.get(
                class_id,
                f"Unknown Class {class_id}"
            )

            detections.append({

                "class_id": class_id,

                "class_name": class_name,

                "confidence": round(
                    score,
                    4
                ),

                "bbox": [
                    int(x1),
                    int(y1),
                    int(x2),
                    int(y2)
                ]
            })

        # ---------------------------------------------------------
        # Sort highest confidence first
        # ---------------------------------------------------------

        detections.sort(
            key=lambda item: item["confidence"],
            reverse=True
        )

        return detections

    # =============================================================
    # DETECT WITH GROUPING
    # =============================================================

    def detect_grouped(
        self,
        image,
        confidence=None,
        image_size=None
    ):
        """
        Detect features and group them by class.

        Returns:

        {
            "features": [...],
            "by_class": {
                "Water": [...],
                "Fire": [...],
                ...
            }
        }
        """

        detections = self.detect(
            image=image,
            confidence=confidence,
            image_size=image_size
        )

        grouped = {}

        for detection in detections:

            class_name = (
                detection["class_name"]
            )

            if class_name not in grouped:

                grouped[class_name] = []

            grouped[class_name].append(
                detection
            )

        return {
            "features": detections,
            "by_class": grouped
        }

    # =============================================================
    # CLOSE
    # =============================================================

    def close(self):
        """
        Release model resources.

        Ultralytics does not require an explicit
        close operation for this model, but this
        method is provided for compatibility with
        the rest of the project.
        """

        self.model = None