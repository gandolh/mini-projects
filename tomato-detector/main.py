import cv2
import matplotlib.pyplot as plt
from tomato_detector import TomatoDetector


def show_results(original_bgr, blurred_bgr, hsv, mask, mask_clean, result_bgr):
    # Convert BGR → RGB for matplotlib
    original_rgb = cv2.cvtColor(original_bgr, cv2.COLOR_BGR2RGB)
    blurred_rgb = cv2.cvtColor(blurred_bgr, cv2.COLOR_BGR2RGB)
    hsv_rgb = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB)
    result_rgb = cv2.cvtColor(result_bgr, cv2.COLOR_BGR2RGB)

    plt.figure(figsize=(15, 10))

    # Original
    plt.subplot(2, 3, 1)
    plt.imshow(original_rgb)
    plt.title("Original")
    plt.axis("off")

    # Blurred
    plt.subplot(2, 3, 2)
    plt.imshow(blurred_rgb)
    plt.title("Blurred")
    plt.axis("off")

    # HSV
    plt.subplot(2, 3, 3)
    plt.imshow(hsv_rgb)
    plt.title("HSV")
    plt.axis("off")

    # Raw mask
    plt.subplot(2, 3, 4)
    plt.imshow(mask, cmap="gray")
    plt.title("Mask")
    plt.axis("off")

    # Cleaned mask
    plt.subplot(2, 3, 5)
    plt.imshow(mask_clean, cmap="gray")
    plt.title("Mask Clean")
    plt.axis("off")

    # Detection result
    plt.subplot(2, 3, 6)
    plt.imshow(result_rgb)
    plt.title("Detected Tomatoes")
    plt.axis("off")

    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    image_path = "../tomato1.jpg"
    detector = TomatoDetector()
    original, blurred, hsv, mask, mask_clean, result = detector.detect(image_path)
    show_results(original, blurred, hsv, mask, mask_clean, result)