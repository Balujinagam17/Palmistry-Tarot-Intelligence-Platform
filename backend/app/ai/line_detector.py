import cv2
import numpy as np


class LineDetector:
    """
    Detect major palm lines using OpenCV.
    """

    @staticmethod
    def detect(image):

        if image is None:
            return []

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        blurred = cv2.GaussianBlur(gray, (5, 5), 0)

        edges = cv2.Canny(blurred, 50, 150)

        lines = cv2.HoughLinesP(
            edges,
            rho=1,
            theta=np.pi / 180,
            threshold=40,
            minLineLength=30,
            maxLineGap=10
        )

        detected_lines = []

        if lines is None:
            return detected_lines

        for line in lines:

            # Flatten any returned shape
            line = np.array(line).flatten()

            if len(line) != 4:
                continue

            x1, y1, x2, y2 = map(int, line)

            detected_lines.append({
                "x1": x1,
                "y1": y1,
                "x2": x2,
                "y2": y2
            })

        return detected_lines