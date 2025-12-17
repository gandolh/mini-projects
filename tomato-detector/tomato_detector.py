import cv2
import numpy as np

class TomatoDetector:
    def __init__(self,
                 hue_red_start=150,
                 hue_red_end=40,
                 saturation_red_start= 120,
                 saturation_red_end = 120,
                 value_red_start = 70,
                 value_red_end = 255,
                 blur_ksize=5,
                 morph_kernel_size=5,
                 min_area=300,
                 min_circularity=0.4):

        # used to mask the red color
        self.hue_red_start = hue_red_start
        self.hue_red_end = hue_red_end
        self.saturation_red_start = saturation_red_start
        self.saturation_red_end = saturation_red_end
        self.value_red_start = value_red_start
        self.value_red_end = value_red_end
       
        self.blur_ksize = blur_ksize
        self.morph_kernel = np.ones((morph_kernel_size, morph_kernel_size), np.uint8)
        self.min_area = min_area
        self.min_circularity = min_circularity

    '''
    Loads the image in BGR
    '''
    def load_image(self, image_path):
        img_bgr = cv2.imread(image_path)
        if img_bgr is None:
            raise ValueError(f"Could not read image: {image_path}")
        return img_bgr


    '''
    preprocess the data by adding a median blur and converting the image format 
    from BGR(default load for opencv) to HSV. We use HSV because it separates color (hue)
    from saturation and brightness.
    '''
    def preprocess(self, img_bgr):
        blurred = cv2.medianBlur(img_bgr, self.blur_ksize)
        hsv = cv2.cvtColor(blurred, cv2.COLOR_BGR2HSV)
        return blurred, hsv


    '''
    returns a mask for the elements that are red in the photo
    '''
    def create_color_mask(self, hsv):
        # single interval mask on the hue(hsv) circle
        if self.hue_red_start <= self.hue_red_end:
            lower = np.array([self.hue_red_start, 120, 70])
            upper = np.array([self.hue_red_end,   255, 255])
            mask = cv2.inRange(hsv, lower, upper)
        else:
            # wrap: two intervals [start, 179] U [0, end]
            lower1 = np.array([self.hue_red_start, 120, 70])
            upper1 = np.array([179, 255, 255])
            lower2 = np.array([0, 120, 70])
            upper2 = np.array([self.hue_red_end, 255, 255])
            # in Range does lowerbound[i] <= pixel[i] <= upperbound[i]
            # this but for our red, not green: https://stackoverflow.com/questions/47483951/how-can-i-define-a-threshold-value-to-detect-only-green-colour-objects-in-an-ima/47483966#47483966

            # It does the masking for the two intervals
            mask1 = cv2.inRange(hsv, lower1, upper1)
            mask2 = cv2.inRange(hsv, lower2, upper2)

            # we combine the masks with binary 'or' operator
            mask = cv2.bitwise_or(mask1, mask2)
        return mask


    '''
    We clean up the mask (make it more smooth)
    Nice article: https://docs.opencv.org/4.x/d9/d61/tutorial_py_morphological_ops.html
    Erosion:  A pixel in result is 1 only if all the pixels under the kernel is 1,
     otherwise it is eroded (made to zero).
    Dilution: A pixel element is '1' if at least one pixel under the kernel is '1'
    '''
    def clean_mask(self, mask):
        # Opening (erosion + dilluation) - clean extra bits outside of shape
        mask_clean = cv2.morphologyEx(mask, cv2.MORPH_OPEN, self.morph_kernel, iterations=2)
        # Closing is reverse of opening (dillation + erosion) -> clean extra bits inside of shape
        mask_clean = cv2.morphologyEx(mask_clean, cv2.MORPH_CLOSE, self.morph_kernel, iterations=2)
        return mask_clean


    # find tomatoes
    '''
    Firstly tried with hough transform but it was slow and not accurate enough
    Hough circles (https://docs.opencv.org/4.x/da/d53/tutorial_py_houghcircles.html) expects a known radius 
    rounded circles, so our eliptical tomatoes wouldn't fit. Also searching for an interval of radius 
    is dangerous and slow.

    Now we find the contours, do a circularity check and return the results.
    '''
    def find_tomato_contours(self, mask_clean):
        # find the contours in the cleaned masks. 
        # https://docs.opencv.org/4.x/d4/d73/tutorial_py_contours_begin.html
        # RETR_EXTERNAL means ignore inner contours (e.g holes because of light)
        # CHAIN_APPROX_SIMPLE gives fewer points and it's better for memory
        # Using the algorithm of Suzuki & Be (1985) - https://www.researchgate.net/post/What_is_the_algorithm_and_concept_behind_finding_contour_in_openCV
        contours, _ = cv2.findContours(mask_clean, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        tomato_contours = []
        for contour in contours:
            # https://docs.opencv.org/4.x/d3/dc0/group__imgproc__shape.html#ga2c759ed9f497d4a618048a2f56dc97f1
            # In docs it says about the Green Formula. There is a lot of math on it.
            # compute the area of detected contour
            area = cv2.contourArea(contour)
            if area < self.min_area:
                continue

            # We expect the shape to be closed.
            # gives the perimeter of our object (total length of boundary)
            # in the end, a square is just a circle with fewer points i guess
            perimeter = cv2.arcLength(contour, closed=True)

            # shape too small
            if perimeter == 0:
                continue

            # source for formula: https://napari.org/0.4.19/tutorials/segmentation/annotate_segmentation.html
            # circularity is 1 for a circle, If shape is elongated -> bigger perimeter -> closer to 0.
            circularity = 4 * np.pi * area / (perimeter ** 2)

            # if it's less rounded than the min_circularity we don't consider it tomato
            if circularity < self.min_circularity:
                continue

            # it passed previous checks, so we append it to our tomato contours.
            tomato_contours.append(contour)
        return tomato_contours


    # draw results
    def draw_detections(self, img_bgr, tomato_contours):
        # make a copy of the original image
        result_bgr = img_bgr.copy()

        # iterate through our resulting contours
        for cnt in tomato_contours:
            # get the bounding rect for our tomato
            x, y, w, h = cv2.boundingRect(cnt)
            # draw the rect
            cv2.rectangle(result_bgr, (x, y), (x + w, y + h), (0, 255, 0), 2)
            # draw the contour
            cv2.drawContours(result_bgr, [cnt], -1, (255, 0, 0), 2)
        return result_bgr

    def detect(self, image_path):
        # load image for detection
        img_bgr = self.load_image(image_path)
        # add median blur and convert to hsv (hue, saturation, value(brightness) )
        blurred, hsv = self.preprocess(img_bgr)

        # generate a red mask so that we extract red areas from the original image
        mask = self.create_color_mask(hsv)
        # do morphological transformations with cv2 to clean the mask
        mask_clean = self.clean_mask(mask)
        # Find tomato regions using simple contour detection
        tomato_contours = self.find_tomato_contours(mask_clean)
        # draw the results
        result_bgr = self.draw_detections(img_bgr, tomato_contours)
        return img_bgr, blurred, hsv, mask, mask_clean, result_bgr
