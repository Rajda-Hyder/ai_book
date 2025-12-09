---
sidebar_position: 2
---

# Lesson 3.2: Distance Sensors & Mapping

## Learning Objectives

By the end of this lesson, you will:
- Understand how distance sensors work
- Use ultrasonic and LiDAR sensors
- Create simple maps from sensor data
- Build a distance-measuring robot
- Understand SLAM basics

## How Distance Sensors Work

### Ultrasonic Sensors

Uses sound waves to measure distance.

```
Sensor:  [Beep] ──────→ Object ←────── [Echo]
         Time: 100 microseconds
         Distance = (Speed of Sound × Time) / 2
         Distance = (343 m/s × 100 µs) / 2 = 17 cm
```

**Accuracy:** ±2 cm
**Range:** 2 cm to 4 meters
**Cost:** $2–5

### LiDAR (Light Detection and Ranging)

Uses laser pulses instead of sound.

```
Sensor:  [Laser] ──────→ Object ←────── [Reflection]
         Much faster and more accurate than ultrasonic
```

**Accuracy:** ±1 cm
**Range:** 1 cm to 100+ meters
**Cost:** $50–500 (or $100/month cloud version)

### Time-of-Flight (ToF) Sensors

Measures time light takes to return.

```
Sensor:  [IR Light] ──→ Object ←─── [Reflection]
         Very accurate over short distances
```

**Accuracy:** ±2–5 mm
**Range:** 10 cm to 2 meters
**Cost:** $10–30

## Reading an Ultrasonic Sensor

### Arduino Example

```cpp
#include <NewPing.h>

#define TRIGGER_PIN 12
#define ECHO_PIN 11
#define MAX_DISTANCE 200

NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);

void setup() {
  Serial.begin(9600);
}

void loop() {
  delay(50);

  // Get distance in cm
  int distance = sonar.ping_cm();

  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");
}
```

### Python (Raspberry Pi) Example

```python
import RPi.GPIO as GPIO
import time

TRIGGER = 17
ECHO = 27

GPIO.setmode(GPIO.BCM)
GPIO.setup(TRIGGER, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)

def measure_distance():
    """Measure distance in cm."""
    GPIO.output(TRIGGER, GPIO.LOW)
    time.sleep(0.3)

    # Send pulse
    GPIO.output(TRIGGER, GPIO.HIGH)
    time.sleep(0.00001)
    GPIO.output(TRIGGER, GPIO.LOW)

    # Measure echo time
    while GPIO.input(ECHO) == 0:
        pulse_start = time.time()

    while GPIO.input(ECHO) == 1:
        pulse_end = time.time()

    pulse_duration = pulse_end - pulse_start

    # Calculate distance
    distance = pulse_duration * 17150  # Speed of sound
    distance = round(distance, 2)

    return distance

try:
    while True:
        dist = measure_distance()
        print(f"Distance: {dist} cm")
        time.sleep(1)

except KeyboardInterrupt:
    GPIO.cleanup()
```

## Multi-Sensor Distance Array

Robot with 5 distance sensors (front, left, right, back, down):

```python
class RobotSensors:
    def __init__(self):
        self.sensors = {
            'front': 17,
            'left': 22,
            'right': 27,
            'back': 14,
            'down': 15
        }
        # Setup GPIO for each sensor...

    def read_all(self):
        """Read all sensors at once."""
        readings = {}
        for name, pin in self.sensors.items():
            readings[name] = self.measure_distance(pin)
        return readings

    def is_obstacle_nearby(self, threshold=20):
        """Check if obstacle is close."""
        readings = self.read_all()
        return any(d < threshold for d in readings.values())

    def get_safe_direction(self):
        """Suggest direction with most space."""
        readings = self.read_all()
        return max(readings, key=readings.get)

# Use it
sensors = RobotSensors()
readings = sensors.read_all()

print(readings)
# {'front': 50, 'left': 100, 'right': 30, 'back': 200, 'down': 5}

print(f"Best direction: {sensors.get_safe_direction()}")
# Best direction: back
```

## Creating Simple Maps (Grid-Based)

Scan environment and create a 2D map:

```python
import numpy as np
import matplotlib.pyplot as plt

class RobotMapper:
    def __init__(self, grid_size=10):
        """Create a 10×10 cm grid."""
        self.grid = np.zeros((grid_size, grid_size))
        self.robot_x = grid_size // 2
        self.robot_y = grid_size // 2
        self.grid[self.robot_x, self.robot_y] = 5  # Mark robot

    def scan_360(self, sensor):
        """Scan full circle and update map."""
        for angle in range(0, 360, 30):  # Every 30 degrees
            distance = sensor.measure_at_angle(angle)

            # Calculate object position
            x = self.robot_x + distance * np.cos(np.radians(angle))
            y = self.robot_y + distance * np.sin(np.radians(angle))

            # Mark on grid (1 = obstacle)
            if 0 <= x < self.grid.shape[0] and 0 <= y < self.grid.shape[1]:
                self.grid[int(x), int(y)] = 1

    def display_map(self):
        """Show the map."""
        plt.figure(figsize=(8, 8))
        plt.imshow(self.grid, cmap='gray', origin='lower')
        plt.xlabel('X Position')
        plt.ylabel('Y Position')
        plt.title('Robot Map')
        plt.colorbar()
        plt.show()

# Example usage
mapper = RobotMapper(20)
# mapper.scan_360(sensor)  # In real application
mapper.display_map()
```

## Occupancy Grid Mapping

More sophisticated mapping:

```python
class OccupancyMap:
    def __init__(self, width=20, height=20, resolution=0.1):
        """
        width, height: Map size in meters
        resolution: 0.1m per cell (10cm)
        """
        self.width = width
        self.height = height
        self.resolution = resolution
        self.grid = np.zeros((
            int(height / resolution),
            int(width / resolution)
        ))

    def update_cell(self, x, y, occupied):
        """Mark cell as occupied (1) or free (0)."""
        # Convert world coordinates to grid indices
        grid_x = int(x / self.resolution)
        grid_y = int(y / self.resolution)

        if 0 <= grid_x < self.grid.shape[1] and 0 <= grid_y < self.grid.shape[0]:
            self.grid[grid_y, grid_x] = 1 if occupied else 0

    def is_navigable(self, x, y, safety_margin=0.3):
        """Check if position is safe to move to."""
        grid_x = int(x / self.resolution)
        grid_y = int(y / self.resolution)

        # Check surrounding cells for safety margin
        margin = int(safety_margin / self.resolution)
        region = self.grid[
            max(0, grid_y - margin):min(self.grid.shape[0], grid_y + margin),
            max(0, grid_x - margin):min(self.grid.shape[1], grid_x + margin)
        ]

        return np.sum(region) == 0  # All zeros = navigable

# Use it
occupancy_map = OccupancyMap(width=5, height=5, resolution=0.1)

# Mark some obstacles
occupancy_map.update_cell(2.5, 2.5, occupied=True)  # Wall at center
occupancy_map.update_cell(1.0, 1.0, occupied=True)  # Obstacle

# Check if position is navigable
print(occupancy_map.is_navigable(0.5, 0.5))  # True (no obstacles nearby)
print(occupancy_map.is_navigable(2.5, 2.5))  # False (obstacle)
```

## Introduction to SLAM

SLAM = Simultaneous Localization and Mapping
- Localization: "Where am I?"
- Mapping: "What's around me?"
- Simultaneous: Both at the same time

```
Real-time SLAM:
1. Sensor reads distance
2. Update position estimate
3. Update map
4. Use map to improve position
5. Repeat 1000s of times per second
```

### Simple SLAM Concept

```python
class SimpleSlam:
    def __init__(self):
        self.position = (0, 0)
        self.orientation = 0  # degrees
        self.map = OccupancyMap()

    def move_forward(self, distance, sensors):
        """Move forward and update map."""
        # Update position
        x_delta = distance * np.cos(np.radians(self.orientation))
        y_delta = distance * np.sin(np.radians(self.orientation))

        self.position = (
            self.position[0] + x_delta,
            self.position[1] + y_delta
        )

        # Scan surroundings
        for angle in range(0, 360, 30):
            sensor_distance = sensors.measure_at_angle(angle)
            abs_angle = self.orientation + angle

            # Calculate obstacle position
            obs_x = (self.position[0] +
                     sensor_distance * np.cos(np.radians(abs_angle)))
            obs_y = (self.position[1] +
                     sensor_distance * np.sin(np.radians(abs_angle)))

            # Update map
            self.map.update_cell(obs_x, obs_y, occupied=True)

    def turn(self, degrees):
        """Turn robot."""
        self.orientation = (self.orientation + degrees) % 360

    def plan_path(self, goal_x, goal_y):
        """Simple path planning using map."""
        # Check if goal is navigable
        if not self.map.is_navigable(goal_x, goal_y):
            print("Goal is blocked!")
            return None

        # Simple straight-line distance
        distance = np.sqrt(
            (goal_x - self.position[0])**2 +
            (goal_y - self.position[1])**2
        )

        return distance
```

## Robot Navigation Example

```python
def navigate_room(robot, width=5, height=5):
    """Have robot scan and map a room."""
    print("Starting room mapping...")

    # Scan at starting position
    robot.scan_360()

    # Move to center
    robot.move_forward(width/2)
    robot.scan_360()

    # Create lawnmower pattern
    for row in range(0, height, 1):
        robot.move_forward(width)
        robot.scan_360()

        # Turn and return
        robot.turn(90)
        robot.move_forward(1)
        robot.turn(90)
        robot.scan_360()

    print("Mapping complete!")
    robot.map.display_map()
```

## Challenge Project

### Build a Room Scanner

```python
class RoomScanner:
    def __init__(self, sensor):
        self.sensor = sensor
        self.scans = []

    def take_scan(self):
        """Take 360-degree scan."""
        scan = {}
        for angle in range(0, 360, 5):  # Every 5 degrees
            distance = self.sensor.measure_at_angle(angle)
            scan[angle] = distance
        return scan

    def analyze_scan(self, scan):
        """Analyze scan to find walls, doors, etc."""
        results = {
            'obstacles': [],
            'clear_paths': [],
            'average_distance': 0
        }

        distances = list(scan.values())
        results['average_distance'] = np.mean(distances)

        for angle, distance in scan.items():
            if distance < 50:
                results['obstacles'].append(angle)
            else:
                results['clear_paths'].append(angle)

        return results

    def map_room(self):
        """Scan and analyze room."""
        scan = self.take_scan()
        analysis = self.analyze_scan(scan)

        print(f"Average distance: {analysis['average_distance']:.1f} cm")
        print(f"Clear paths: {len(analysis['clear_paths'])}")
        print(f"Obstacles: {len(analysis['obstacles'])}")

        return analysis

# Use it
scanner = RoomScanner(sensor)
analysis = scanner.map_room()
```

## Key Concepts

| Sensor | Accuracy | Range | Cost |
|--------|----------|-------|------|
| **Ultrasonic** | ±2 cm | 2cm–4m | $2–5 |
| **LiDAR** | ±1 cm | 1cm–100m | $50–500 |
| **ToF** | ±2–5mm | 10cm–2m | $10–30 |

## Key Takeaways

✅ Ultrasonic sensors measure with sound waves
✅ LiDAR is faster and more accurate
✅ Maps can be created from sensor data
✅ Occupancy grids store environmental information
✅ SLAM combines mapping and localization

## Resources & Further Reading

- [ROS SLAM Tutorial](http://wiki.ros.org/slam_gmapping)
- [Occupancy Grid Mapping](https://www.probabilisticrobotics.org/)
- [LiDAR Technology](https://www.teledyne-e2v.com/lidar/)

---

**Next Lesson:** [Lesson 3.3: Processing Sensor Data →](/docs/module-3-sensing/lesson-3-3-sensor-data)
