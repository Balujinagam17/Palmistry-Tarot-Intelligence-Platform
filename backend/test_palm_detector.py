import cv2

from app.ai.palm_detector import PalmDetector
from app.ai.landmark_detector import LandmarkDetector


IMAGE_PATH = (
    r"C:\Users\haksh\OneDrive\Pictures\Screenshots"
    r"\Screenshot (197).png"
)


print("=" * 60)
print("PALM DETECTOR TEST")
print("=" * 60)


# =========================================================
# LOAD IMAGE
# =========================================================

image = cv2.imread(
    IMAGE_PATH
)

if image is None:

    print(
        "ERROR: Could not read image"
    )

    print(
        "Path:",
        IMAGE_PATH
    )

    raise SystemExit(1)


print(
    "Image loaded:",
    image.shape
)


# =========================================================
# IMPORTANT
#
# Do NOT convert the image to RGB here.
#
# PalmDetector handles BGR → RGB internally.
#
# The image itself is NOT flipped or mirrored.
# =========================================================


# =========================================================
# CREATE DETECTOR
# =========================================================

detector = PalmDetector()


# =========================================================
# DETECT PALM + HAND
# =========================================================

result = detector.detect(
    image
)


# =========================================================
# DISPLAY RESULT
# =========================================================

print(
    "\nDetection result:"
)

print(
    "Success:",
    result["success"]
)

print(
    "Handedness:",
    result["handedness"]
)

print(
    "Palm confidence:",
    result["palm_confidence"]
)

print(
    "Palm bounding box:",
    result["palm_bbox"]
)


# =========================================================
# EXTRACT LANDMARKS
# =========================================================

if result["success"]:

    landmarks = (
        LandmarkDetector.extract(
            result["landmarks"]
        )
    )

    print(
        "\nLandmarks detected:",
        len(landmarks)
    )

    for landmark in landmarks:

        print(
            f"{landmark['id']:2d} | "
            f"x={landmark['x']:.4f} | "
            f"y={landmark['y']:.4f} | "
            f"z={landmark['z']:.4f}"
        )

else:

    print(
        "\n❌ No hand detected inside palm crop."
    )


# =========================================================
# CLOSE DETECTOR
# =========================================================

detector.close()


print(
    "\n" + "=" * 60
)

print(
    "TEST COMPLETED"
)

print(
    "=" * 60
)