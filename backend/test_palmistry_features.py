import cv2
import numpy as np
from pathlib import Path

from app.ai.palmistry_feature_detector import (
    PalmistryFeatureDetector
)


# =============================================================
# CONFIGURATION
# =============================================================

IMAGE_PATH = (
    r"C:\Users\haksh\OneDrive\Pictures"
    r"\Screenshots\Screenshot (185).png"
)

OUTPUT_DIR = Path(
    "palmistry_test_outputs"
)

OUTPUT_DIR.mkdir(
    exist_ok=True
)


# =============================================================
# HELPERS
# =============================================================

def save_image(path, image):
    """
    Save an RGB image as BGR/JPEG.
    """

    if image is None:
        return

    bgr = cv2.cvtColor(
        image,
        cv2.COLOR_RGB2BGR
    )

    cv2.imwrite(
        str(path),
        bgr
    )


def print_results(title, detections):

    print()
    print("=" * 70)
    print(title)
    print("=" * 70)

    print(
        "Detections:",
        len(detections)
    )

    if not detections:

        print(
            "No detections."
        )

        return

    for item in detections:

        print(
            f"{item['class_name']}"
            f" | confidence = "
            f"{item['confidence']:.4f}"
            f" | bbox = "
            f"{item['bbox']}"
        )


# =============================================================
# LOAD IMAGE
# =============================================================

print("=" * 70)
print("PALMISTRY CROP SEARCH TEST")
print("=" * 70)

image = cv2.imread(
    IMAGE_PATH
)

if image is None:

    print(
        "ERROR: Could not read image."
    )

    print(
        "Path:",
        IMAGE_PATH
    )

    raise SystemExit(1)


rgb = cv2.cvtColor(
    image,
    cv2.COLOR_BGR2RGB
)

height, width = rgb.shape[:2]

print(
    "Original image:",
    rgb.shape
)


# =============================================================
# LOAD FEATURE MODEL
# =============================================================

print()
print(
    "Loading trained 12-class model..."
)

detector = PalmistryFeatureDetector()


# =============================================================
# TEST THE KNOWN COLAB-STYLE REGION
# =============================================================

# The previous successful Colab result reported a palm
# region around:
#
# x1 = 282
# y1 = 164
# x2 = 695
# y2 = 630
#
# We will test that exact region first.

known_box = (
    282,
    164,
    695,
    630
)

x1, y1, x2, y2 = known_box

known_crop = rgb[
    y1:y2,
    x1:x2
]

print()
print(
    "KNOWN COLAB-STYLE CROP:",
    known_crop.shape
)

save_image(
    OUTPUT_DIR / "05_known_colab_crop.jpg",
    known_crop
)


# =============================================================
# TEST KNOWN CROP
# =============================================================

known_results = detector.detect(
    known_crop,
    confidence=0.05,
    image_size=960
)

print_results(
    "KNOWN COLAB-STYLE CROP - CONFIDENCE 0.05",
    known_results
)


known_results_025 = detector.detect(
    known_crop,
    confidence=0.25,
    image_size=960
)

print_results(
    "KNOWN COLAB-STYLE CROP - CONFIDENCE 0.25",
    known_results_025
)


# =============================================================
# SEARCH NEARBY CROPS
# =============================================================

print()
print("=" * 70)
print("SEARCHING NEARBY CROP VARIATIONS")
print("=" * 70)

# We vary the crop around the previously reported
# successful Colab bounding box.

crop_variations = [
    ("A", 260, 140, 717, 650),
    ("B", 270, 150, 707, 640),
    ("C", 282, 164, 695, 630),
    ("D", 290, 170, 687, 624),
    ("E", 250, 130, 730, 660),
    ("F", 240, 120, 740, 670),
    ("G", 220, 100, 760, 690),
    ("H", 200, 80, 780, 710),
]


best_results = []


for name, x1, y1, x2, y2 in crop_variations:

    # ---------------------------------------------------------
    # Keep coordinates inside image
    # ---------------------------------------------------------

    x1 = max(
        0,
        min(x1, width - 1)
    )

    y1 = max(
        0,
        min(y1, height - 1)
    )

    x2 = max(
        x1 + 1,
        min(x2, width)
    )

    y2 = max(
        y1 + 1,
        min(y2, height)
    )

    crop = rgb[
        y1:y2,
        x1:x2
    ]

    # ---------------------------------------------------------
    # Save crop
    # ---------------------------------------------------------

    save_image(
        OUTPUT_DIR /
        f"crop_{name}.jpg",
        crop
    )

    # ---------------------------------------------------------
    # Run model
    # ---------------------------------------------------------

    detections = detector.detect(
        crop,
        confidence=0.05,
        image_size=960
    )

    # ---------------------------------------------------------
    # Print
    # ---------------------------------------------------------

    print()
    print(
        f"Crop {name}"
        f" | box = "
        f"[{x1}, {y1}, {x2}, {y2}]"
        f" | size = "
        f"{crop.shape[1]}x{crop.shape[0]}"
    )

    if not detections:

        print(
            "  No detections"
        )

        continue

    for detection in detections:

        print(
            f"  "
            f"{detection['class_name']}"
            f" -> "
            f"{detection['confidence']:.4f}"
        )

        best_results.append(
            (
                detection["confidence"],
                name,
                detection["class_name"],
                [
                    x1,
                    y1,
                    x2,
                    y2
                ]
            )
        )


# =============================================================
# SHOW STRONGEST DETECTIONS
# =============================================================

print()
print("=" * 70)
print("STRONGEST DETECTIONS FOUND")
print("=" * 70)

best_results.sort(
    reverse=True
)

if not best_results:

    print(
        "No detections found."
    )

else:

    for item in best_results[:20]:

        confidence, name, class_name, box = item

        print(
            f"Crop {name}"
            f" | {class_name}"
            f" | confidence = "
            f"{confidence:.4f}"
            f" | box = {box}"
        )


# =============================================================
# CLOSE
# =============================================================

detector.close()


print()
print("=" * 70)
print("CROP SEARCH COMPLETED")
print("=" * 70)

print()
print(
    "Diagnostic images saved in:"
)

print(
    OUTPUT_DIR.resolve()
)