## Tomato Detection

This project detects ripe(red) tomatoes in images using OpenCV. The detection pipeline:

- **Load original image** in BGR color space.
- **Apply median blur** to reduce noise while preserving edges.
- **Convert to HSV** to separate color (hue) from brightness.
- **Create a red color mask** based on configurable hue thresholds.
- **Clean the mask** with morphological operations (open/close) to remove small artifacts.
- **Find contours** on the cleaned mask and filter by area and circularity.
- **Draw detections** by outlining detected tomatoes on the original image.

You can run detection either from the command line (`main.py`, which shows all stages using Matplotlib) or via the Tkinter GUI (`ui.py`).
