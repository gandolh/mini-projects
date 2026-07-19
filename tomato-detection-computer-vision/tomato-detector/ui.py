
import tkinter as tk
from tkinter import filedialog
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from matplotlib.figure import Figure
import cv2
import numpy as np
from tomato_detector import TomatoDetector

class MainApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Tomato Detection App")
        self.geometry("1200x600")

        self.detector = TomatoDetector()
        self.current_image_path = None
        self.original_bgr = None
        self.blurred_bgr = None
        self.hsv = None
        self.mask = None
        self.mask_clean = None
        self.result_bgr = None

        self._create_layout()
        self._create_figure()
        self._create_controls()

    def _create_layout(self):
        self.columnconfigure(0, weight=3)
        self.columnconfigure(1, weight=1)
        self.rowconfigure(0, weight=1)

        self.left_frame = tk.Frame(self)
        self.left_frame.grid(row=0, column=0, sticky="nsew")

        self.right_frame = tk.Frame(self, padx=10, pady=10, relief=tk.GROOVE, borderwidth=2)
        self.right_frame.grid(row=0, column=1, sticky="nsew")

    def _create_figure(self):
        # Larger figure with six subplots: processing pipeline
        # Increase figsize so individual images appear bigger in the UI
        self.fig = Figure(figsize=(12, 8), dpi=100)

        self.ax_original = self.fig.add_subplot(2, 3, 1)
        self.ax_blurred = self.fig.add_subplot(2, 3, 2)
        self.ax_hsv = self.fig.add_subplot(2, 3, 3)
        self.ax_mask = self.fig.add_subplot(2, 3, 4)
        self.ax_mask_clean = self.fig.add_subplot(2, 3, 5)
        self.ax_result = self.fig.add_subplot(2, 3, 6)

        self.ax_original.set_title("Original")
        self.ax_blurred.set_title("Blurred")
        self.ax_hsv.set_title("HSV")
        self.ax_mask.set_title("Mask")
        self.ax_mask_clean.set_title("Mask Clean")
        self.ax_result.set_title("Detected")

        for ax in (self.ax_original, self.ax_blurred, self.ax_hsv,
                   self.ax_mask, self.ax_mask_clean, self.ax_result):
            ax.axis("off")

        self.canvas = FigureCanvasTkAgg(self.fig, master=self.left_frame)
        self.canvas_widget = self.canvas.get_tk_widget()
        self.canvas_widget.pack(fill=tk.BOTH, expand=True)

    def _create_controls(self):
        row = 0

        tk.Button(self.right_frame, text="Load Image", command=self.load_image).grid(row=row, column=0, columnspan=2, pady=(0, 10), sticky="ew")
        row += 1

        tk.Label(self.right_frame, text="Red Hue Range (start / end)").grid(row=row, column=0, columnspan=2, sticky="w")
        row += 1
        # start and end hue for red detection (TomatoDetector.hue_red_start / hue_red_end)
        self.h1_min = tk.Scale(self.right_frame, from_=0, to=180, orient=tk.HORIZONTAL)
        self.h1_min.set(150)
        self.h1_min.grid(row=row, column=0, sticky="ew")
        self.h1_max = tk.Scale(self.right_frame, from_=0, to=180, orient=tk.HORIZONTAL)
        self.h1_max.set(40)
        self.h1_max.grid(row=row, column=1, sticky="ew")
        row += 1

        tk.Label(self.right_frame, text="Min Area").grid(row=row, column=0, sticky="w")
        self.min_area_scale = tk.Scale(self.right_frame, from_=0, to=5000, orient=tk.HORIZONTAL)
        self.min_area_scale.set(300)
        self.min_area_scale.grid(row=row, column=1, sticky="ew")
        row += 1

        tk.Label(self.right_frame, text="Min Circularity (x100)").grid(row=row, column=0, sticky="w")
        self.min_circ_scale = tk.Scale(self.right_frame, from_=0, to=100, orient=tk.HORIZONTAL)
        self.min_circ_scale.set(40)
        self.min_circ_scale.grid(row=row, column=1, sticky="ew")
        row += 1

        tk.Button(self.right_frame, text="Detect Tomatoes", command=self.detect_tomatoes).grid(row=row, column=0, columnspan=2, pady=10, sticky="ew")

        for i in range(2):
            self.right_frame.columnconfigure(i, weight=1)

    def load_image(self):
        filetypes = (("Image files", "*.jpg *.jpeg *.png *.bmp"), ("All files", "*.*"))
        filename = filedialog.askopenfilename(title="Open image", filetypes=filetypes)
        if not filename:
            return
        self.current_image_path = filename
        self.update_detector_params()
        self.original_bgr = self.detector.load_image(filename)
        self.blurred_bgr = None
        self.hsv = None
        self.mask = None
        self.mask_clean = None
        self.result_bgr = None

        # automatically run detection after loading the image
        self.detect_tomatoes()

    def update_detector_params(self):
        # update TomatoDetector hue range for red based on sliders
        self.detector.hue_red_start = self.h1_min.get()
        self.detector.hue_red_end = self.h1_max.get()
        self.detector.min_area = self.min_area_scale.get()
        self.detector.min_circularity = self.min_circ_scale.get() / 100.0

    def detect_tomatoes(self):
        if not self.current_image_path:
            return
        self.update_detector_params()
        (self.original_bgr,
         self.blurred_bgr,
         self.hsv,
         self.mask,
         self.mask_clean,
         self.result_bgr) = self.detector.detect(self.current_image_path)
        self._update_figure()

    def _update_figure(self):
        self.ax_original.clear()
        self.ax_blurred.clear()
        self.ax_hsv.clear()
        self.ax_mask.clear()
        self.ax_mask_clean.clear()
        self.ax_result.clear()

        self.ax_original.set_title("Original")
        self.ax_blurred.set_title("Blurred")
        self.ax_hsv.set_title("HSV")
        self.ax_mask.set_title("Mask")
        self.ax_mask_clean.set_title("Mask Clean")
        self.ax_result.set_title("Detected")

        if self.original_bgr is not None:
            original_rgb = cv2.cvtColor(self.original_bgr, cv2.COLOR_BGR2RGB)
            self.ax_original.imshow(original_rgb)
        self.ax_original.axis("off")

        if self.blurred_bgr is not None:
            blurred_rgb = cv2.cvtColor(self.blurred_bgr, cv2.COLOR_BGR2RGB)
            self.ax_blurred.imshow(blurred_rgb)
        self.ax_blurred.axis("off")

        if self.hsv is not None:
            hsv_rgb = cv2.cvtColor(self.hsv, cv2.COLOR_HSV2RGB)
            self.ax_hsv.imshow(hsv_rgb)
        self.ax_hsv.axis("off")

        if self.mask is not None:
            self.ax_mask.imshow(self.mask, cmap="gray")
        self.ax_mask.axis("off")

        if self.mask_clean is not None:
            self.ax_mask_clean.imshow(self.mask_clean, cmap="gray")
        self.ax_mask_clean.axis("off")

        if self.result_bgr is not None:
            result_rgb = cv2.cvtColor(self.result_bgr, cv2.COLOR_BGR2RGB)
            self.ax_result.imshow(result_rgb)
        self.ax_result.axis("off")

        self.canvas.draw_idle()


if __name__ == "__main__":
    app = MainApp()
    app.mainloop()