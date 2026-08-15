class RuleEngine:
    """
    Applies rule-based interpretations to extracted palm features.
    """

    @staticmethod
    def analyze(features):
        interpretation = {}

        # Palm Shape
        ratio = features.get("aspect_ratio", 0)

        if ratio > 1.25:
            interpretation["palm_shape"] = "Long Palm"
        elif ratio < 0.90:
            interpretation["palm_shape"] = "Wide Palm"
        else:
            interpretation["palm_shape"] = "Balanced Palm"

        # Dominant Finger
        finger_lengths = {
            "Thumb": features.get("thumb_length", 0),
            "Index": features.get("index_length", 0),
            "Middle": features.get("middle_length", 0),
            "Ring": features.get("ring_length", 0),
            "Pinky": features.get("pinky_length", 0)
        }

        interpretation["dominant_finger"] = max(
            finger_lengths,
            key=finger_lengths.get
        )

        # Palm Size
        palm_width = features.get("palm_width", 0)
        palm_height = features.get("palm_height", 0)

        if palm_width > 0.35:
            interpretation["palm_size"] = "Large"
        else:
            interpretation["palm_size"] = "Small"

        interpretation["summary"] = (
            f"{interpretation['palm_shape']} with "
            f"{interpretation['dominant_finger']} as the dominant finger."
        )

        return interpretation