---
sidebar_position: 1
---

# Lesson 3.1: Vision & Computer Vision

## Learning Objectives

By the end of this lesson, you will:
- Understand how robots "see" with cameras
- Learn basic computer vision concepts
- Use OpenCV library for image processing
- Detect objects, colors, and shapes
- Build a simple color-detection robot

## How Cameras Work

### RGB Images

A camera captures images as a grid of pixels, each pixel has three values: Red, Green, Blue.

```
Pixel (100, 150):  R=255, G=100, B=50  (Orange)
Pixel (200, 200):  R=0,   G=0,   B=255 (Blue)
```

### Image Resolution

- 320×240 pixels = VGA (small, fast)
- 640×480 pixels = Common resolution
- 1920×1080 pixels = Full HD (detailed, slower)

For robotics, smaller is usually better (faster processing).

## Introduction to OpenCV

OpenCV is the most popular computer vision library.

### Installation

```bash
pip3 install opencv-python
pip3 install opencv-contrib-python
```

### Your First Vision Program

```python
import cv2

# Open camera
cap = cv2.VideoCapture(0)

# Capture frames until 'q' is pressed
while True:
    ret, frame = cap.read()

    if ret:
        # Display frame
        cv2.imshow('Camera Feed', frame)

        # Press 'q' to quit
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

# Cleanup
cap.release()
cv2.destroyAllWindows()
```

## Color Detection

### HSV Color Space

RGB is tricky for color detection. HSV (Hue, Saturation, Value) is better.

```
Hue (0-180):       Color (Red, Blue, Green, Yellow)
Saturation (0-255): How pure the color is
Value (0-255):     Brightness
```

### Detect Red Objects

```python
import cv2
import numpy as np

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()

    if ret:
        # Convert to HSV
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

        # Define red color range
        lower_red = np.array([0, 100, 100])
        upper_red = np.array([10, 255, 255])

        # Create mask for red color
        mask = cv2.inRange(hsv, lower_red, upper_red)

        # Show result
        cv2.imshow('Original', frame)
        cv2.imshow('Red Mask', mask)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
```

### Color Detection with Different Colors

```python
# Define color ranges in HSV
COLORS = {
    'red': ([0, 100, 100], [10, 255, 255]),
    'green': ([35, 100, 100], [85, 255, 255]),
    'blue': ([100, 100, 100], [130, 255, 255]),
    'yellow': ([20, 100, 100], [35, 255, 255]),
}

def detect_color(frame, color_name):
    """Detect a specific color in the frame."""
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    lower, upper = COLORS[color_name]
    lower = np.array(lower)
    upper = np.array(upper)

    mask = cv2.inRange(hsv, lower, upper)
    return mask

# Use it
for color in COLORS.keys():
    mask = detect_color(frame, color)
    if cv2.countNonZero(mask) > 5000:
        print(f"Found {color}!")
```

## Object Detection

### Find Contours (Outlines)

```python
import cv2
import numpy as np

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()

    if ret:
        # Convert to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Threshold to binary
        _, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

        # Find contours
        contours, _ = cv2.findContours(binary, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

        # Draw contours
        cv2.drawContours(frame, contours, -1, (0, 255, 0), 2)

        cv2.imshow('Contours', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
```

### Detect Circles

```python
import cv2
import numpy as np

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()

    if ret:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect circles using Hough Circle Transform
        circles = cv2.HoughCircles(
            gray,
            cv2.HOUGH_GRADIENT,
            dp=1,
            minDist=50,
            param1=50,
            param2=30,
            minRadius=10,
            maxRadius=100
        )

        if circles is not None:
            circles = np.uint16(np.around(circles))

            for i in circles[0, :]:
                center = (i[0], i[1])
                radius = i[2]

                # Draw circle
                cv2.circle(frame, center, radius, (0, 255, 0), 2)
                cv2.circle(frame, center, 2, (0, 0, 255), 3)

                print(f"Circle at {center} with radius {radius}")

        cv2.imshow('Circle Detection', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
```

## Face Detection (Using Pre-trained Model)

```python
import cv2

# Load face detection model
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()

    if ret:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)

        # Draw rectangles around faces
        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
            print(f"Face detected at ({x}, {y})")

        cv2.imshow('Face Detection', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
```

## Robot Application: Color-Following Robot

```python
import cv2
import numpy as np

class ColorFollowingRobot:
    def __init__(self):
        self.cap = cv2.VideoCapture(0)
        self.target_color = 'red'

    def detect_color(self, frame):
        """Detect red object and return position."""
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

        lower_red = np.array([0, 100, 100])
        upper_red = np.array([10, 255, 255])

        mask = cv2.inRange(hsv, lower_red, upper_red)

        # Find contours
        contours, _ = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

        if contours:
            # Get largest contour
            largest_contour = max(contours, key=cv2.contourArea)
            x, y, w, h = cv2.boundingRect(largest_contour)

            # Calculate center
            center_x = x + w // 2
            center_y = y + h // 2

            return center_x, center_y, w, h
        else:
            return None

    def run(self):
        """Run the color-following robot."""
        while True:
            ret, frame = self.cap.read()

            if ret:
                result = self.detect_color(frame)

                if result:
                    center_x, center_y, w, h = result

                    # Draw on frame
                    cv2.circle(frame, (center_x, center_y), 5, (0, 255, 0), -1)
                    cv2.rectangle(frame, (center_x - w//2, center_y - h//2),
                                 (center_x + w//2, center_y + h//2), (0, 255, 0), 2)

                    # Robot logic
                    frame_center = frame.shape[1] // 2

                    if center_x < frame_center - 50:
                        print("Turn LEFT")
                    elif center_x > frame_center + 50:
                        print("Turn RIGHT")
                    else:
                        print("Move FORWARD")

                else:
                    print("Target not found - searching...")

                cv2.imshow('Color Follower', frame)

                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break

        self.cap.release()
        cv2.destroyAllWindows()

# Run it
robot = ColorFollowingRobot()
robot.run()
```

## Challenge Project

### Build a Ball Detector

Detect a colored ball and report its position:

```python
import cv2
import numpy as np

def detect_ball(frame, color='red'):
    """Detect ball by color."""
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    if color == 'red':
        lower = np.array([0, 100, 100])
        upper = np.array([10, 255, 255])
    elif color == 'blue':
        lower = np.array([100, 100, 100])
        upper = np.array([130, 255, 255])
    elif color == 'green':
        lower = np.array([35, 100, 100])
        upper = np.array([85, 255, 255])

    mask = cv2.inRange(hsv, lower, upper)

    # Morphological operations
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)

    # Find contours
    contours, _ = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    if contours:
        largest = max(contours, key=cv2.contourArea)
        (x, y), radius = cv2.minEnclosingCircle(largest)
        return int(x), int(y), int(radius)
    else:
        return None

# Test it
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if ret:
        result = detect_ball(frame, 'red')
        if result:
            x, y, r = result
            cv2.circle(frame, (x, y), r, (0, 255, 0), 2)
            print(f"Ball at ({x}, {y}) with radius {r}")

        cv2.imshow('Ball Detection', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()
```

## Key Concepts

| Concept | Meaning |
|---------|---------|
| **Pixel** | Single dot in image (R, G, B values) |
| **RGB** | Red, Green, Blue color model |
| **HSV** | Hue, Saturation, Value color model |
| **Contour** | Outline of object |
| **Threshold** | Convert grayscale to black/white |
| **Mask** | Binary image used to extract regions |
| **Cascade Classifier** | Pre-trained model for detection |

## Key Takeaways

✅ Cameras capture images as pixels
✅ OpenCV is powerful for image processing
✅ HSV is better than RGB for color detection
✅ Contours detect object outlines
✅ Cascades detect faces and other features

## Resources & Further Reading

- [OpenCV Official Tutorial](https://docs.opencv.org/master/index.html)
- [OpenCV Python Tutorials](https://docs.opencv.org/master/d6/d00/tutorial_py_root.html)
- [Color Space Conversion](https://docs.opencv.org/master/df/d9d/tutorial_py_colorspaces.html)

---

**Next Lesson:** [Lesson 3.2: Distance Sensors & Mapping →](/docs/module-3-sensing/lesson-3-2-distance-sensors)
