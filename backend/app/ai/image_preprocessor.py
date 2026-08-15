import cv2
import numpy as np
from pathlib import Path


class ImagePreprocessor:
    """
    Handles image preprocessing before palm detection.
    """

    ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}

    @staticmethod
    def load_image(image_path: str):
        """
        Load image from disk.
        """
        path = Path(image_path)

        if not path.exists():
            raise FileNotFoundError(f"Image not found: {image_path}")

        if path.suffix.lower() not in ImagePreprocessor.ALLOWED_EXTENSIONS:
            raise ValueError("Unsupported image format.")

        image = cv2.imread(str(path))

        if image is None:
            raise ValueError("Unable to read image.")

        return image

    @staticmethod
    def resize_image(image, max_width=800):
        """
        Resize image while maintaining aspect ratio.
        """
        height, width = image.shape[:2]

        if width <= max_width:
            return image

        ratio = max_width / width
        new_width = int(width * ratio)
        new_height = int(height * ratio)

        return cv2.resize(
            image,
            (new_width, new_height),
            interpolation=cv2.INTER_AREA
        )

    @staticmethod
    def enhance_image(image):
        """
        Improve image quality using CLAHE.
        """
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)

        l, a, b = cv2.split(lab)

        clahe = cv2.createCLAHE(
            clipLimit=2.0,
            tileGridSize=(8, 8)
        )

        l = clahe.apply(l)

        enhanced = cv2.merge((l, a, b))

        return cv2.cvtColor(enhanced, cv2.COLOR_LAB2BGR)

    @staticmethod
    def preprocess(image_path: str):
        """
        Complete preprocessing pipeline.
        """
        image = ImagePreprocessor.load_image(image_path)

        image = ImagePreprocessor.resize_image(image)

        image = ImagePreprocessor.enhance_image(image)

        image = cv2.GaussianBlur(image, (3, 3), 0)

        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        return {
            "original": image,
            "rgb": rgb_image,
            "height": image.shape[0],
            "width": image.shape[1]
        }