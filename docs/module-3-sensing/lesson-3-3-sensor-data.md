---
sidebar_position: 3
---

# Lesson 3.3: Processing Sensor Data

## Learning Objectives

By the end of this lesson, you will:
- Filter noisy sensor readings
- Smooth and average sensor data
- Detect sensor anomalies
- Log and analyze sensor data
- Build a data processing pipeline

## Why Sensors are Noisy

Real sensors aren't perfect:

```
Real measurement:     65 cm
Noisy sensor reads:   62, 67, 64, 68, 61, 66, 69, 63
Average:              65 cm (much cleaner!)
```

**Sources of noise:**
- Environmental interference
- Vibration
- Electromagnetic fields
- Temperature changes

## Simple Averaging (Moving Average)

Keep a window of recent readings and average them:

```python
class SensorFilter:
    def __init__(self, window_size=5):
        self.window_size = window_size
        self.readings = []

    def add_reading(self, value):
        """Add new reading and return filtered value."""
        self.readings.append(value)

        # Keep only last N readings
        if len(self.readings) > self.window_size:
            self.readings.pop(0)

        # Return average
        return sum(self.readings) / len(self.readings)

# Use it
filter = SensorFilter(window_size=5)

sensor_readings = [62, 67, 64, 68, 61, 66, 69, 63]

for reading in sensor_readings:
    filtered = filter.add_reading(reading)
    print(f"Raw: {reading:3d}, Filtered: {filtered:.1f}")

# Output:
# Raw:  62, Filtered: 62.0
# Raw:  67, Filtered: 64.5
# Raw:  64, Filtered: 64.3
# Raw:  68, Filtered: 65.3
# Raw:  61, Filtered: 64.4
# Raw:  66, Filtered: 65.2
# Raw:  69, Filtered: 65.8
# Raw:  63, Filtered: 65.4
```

## Exponential Moving Average (Better)

Give more weight to recent readings:

```python
class ExponentialFilter:
    def __init__(self, alpha=0.3):
        """
        alpha = smoothing factor (0-1)
        Higher = more responsive to new readings
        Lower = more smoothing
        """
        self.alpha = alpha
        self.previous = None

    def filter(self, value):
        """Apply exponential filter."""
        if self.previous is None:
            self.previous = value
            return value

        # EMA = (alpha × new) + ((1 - alpha) × previous)
        filtered = (self.alpha * value) + ((1 - self.alpha) * self.previous)
        self.previous = filtered
        return filtered

# Test it
ema_filter = ExponentialFilter(alpha=0.3)

for reading in [62, 67, 64, 68, 61, 66, 69, 63]:
    filtered = ema_filter.filter(reading)
    print(f"Raw: {reading:3d}, EMA: {filtered:.1f}")
```

## Median Filter (Robust)

Use middle value instead of average (better for outliers):

```python
import statistics

class MedianFilter:
    def __init__(self, window_size=5):
        self.window_size = window_size
        self.readings = []

    def filter(self, value):
        """Apply median filter."""
        self.readings.append(value)

        if len(self.readings) > self.window_size:
            self.readings.pop(0)

        return statistics.median(self.readings)

# Test with outlier
median_filter = MedianFilter(window_size=5)

sensor_readings = [62, 67, 150, 68, 61, 66, 69, 63]  # 150 is outlier

for reading in sensor_readings:
    filtered = median_filter.filter(reading)
    print(f"Raw: {reading:3d}, Median: {filtered:.1f}")
```

## Sensor Validation

Check if readings make sense:

```python
class ValidatedSensor:
    def __init__(self, min_val=0, max_val=500):
        self.min_val = min_val
        self.max_val = max_val
        self.filter = ExponentialFilter(alpha=0.2)

    def read(self, value):
        """Read and validate sensor."""
        # Check bounds
        if value < self.min_val or value > self.max_val:
            print(f"WARNING: Reading {value} out of bounds!")
            return None

        # Apply filter
        filtered = self.filter.filter(value)
        return filtered

    def read_safe(self, value, default=None):
        """Read with fallback value."""
        result = self.read(value)
        return result if result is not None else default

# Use it
sensor = ValidatedSensor(min_val=10, max_val=400)

readings = [50, 75, -5, 100, 520, 120, 80, 90]

for reading in readings:
    filtered = sensor.read_safe(reading, default=100)
    print(f"Raw: {reading:3d}, Result: {filtered:.1f}")
```

## Rate of Change Detection

Detect sudden changes:

```python
class ChangeDetector:
    def __init__(self, max_change=10):
        """max_change = largest acceptable change between readings."""
        self.max_change = max_change
        self.previous = None

    def detect_anomaly(self, value):
        """Check if value changed too suddenly."""
        if self.previous is None:
            self.previous = value
            return False

        change = abs(value - self.previous)

        if change > self.max_change:
            print(f"ANOMALY: Change of {change} detected!")
            self.previous = value
            return True

        self.previous = value
        return False

# Use it
detector = ChangeDetector(max_change=15)

readings = [60, 65, 62, 68, 100, 70, 75, 72]  # 100 is anomaly

for reading in readings:
    is_anomaly = detector.detect_anomaly(reading)
    print(f"Reading: {reading:3d}, Anomaly: {is_anomaly}")
```

## Data Logging

Save sensor data for later analysis:

```python
import csv
import datetime

class SensorDataLogger:
    def __init__(self, filename='sensor_log.csv'):
        self.filename = filename
        self.start_time = datetime.datetime.now()

        # Create file with header
        with open(filename, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['Time (s)', 'Raw Reading', 'Filtered', 'Status'])

    def log_reading(self, raw, filtered, status='OK'):
        """Log a sensor reading."""
        elapsed = (datetime.datetime.now() - self.start_time).total_seconds()

        with open(self.filename, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([f'{elapsed:.2f}', raw, f'{filtered:.2f}', status])

# Use it
logger = SensorDataLogger('robot_log.csv')

for i in range(10):
    raw = 60 + i * 2
    filtered = 61 + i * 1.8
    logger.log_reading(raw, filtered, 'OK')

print(f"Data logged to robot_log.csv")
```

## Real-Time Data Display

Visualize sensor data as it comes in:

```python
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

class RealTimePlot:
    def __init__(self, max_points=100):
        self.times = []
        self.values = []
        self.max_points = max_points

        self.fig, self.ax = plt.subplots()

    def update(self, timestamp, value):
        """Add data point and update plot."""
        self.times.append(timestamp)
        self.values.append(value)

        # Keep only last N points
        if len(self.times) > self.max_points:
            self.times.pop(0)
            self.values.pop(0)

        # Clear and redraw
        self.ax.clear()
        self.ax.plot(self.times, self.values, 'b-', label='Distance')
        self.ax.axhline(y=50, color='r', linestyle='--', label='Threshold')
        self.ax.set_xlabel('Time')
        self.ax.set_ylabel('Distance (cm)')
        self.ax.set_title('Real-Time Sensor Data')
        self.ax.legend()
        self.ax.set_ylim([0, 200])

        plt.pause(0.01)

# Use it
plot = RealTimePlot()

for t in range(20):
    value = 100 + 30 * np.sin(t / 5)
    plot.update(t, value)
```

## Complete Sensor Pipeline

Combine all techniques:

```python
class RobustSensorSystem:
    def __init__(self):
        self.ema_filter = ExponentialFilter(alpha=0.2)
        self.change_detector = ChangeDetector(max_change=20)
        self.validator = ValidatedSensor(min_val=10, max_val=400)
        self.logger = SensorDataLogger('sensor_data.csv')
        self.raw_count = 0

    def process_reading(self, raw_value):
        """Process single sensor reading through pipeline."""
        self.raw_count += 1

        # 1. Validate
        if raw_value < 10 or raw_value > 400:
            print(f"Reading {self.raw_count}: INVALID ({raw_value})")
            return None

        # 2. Detect anomalies
        if self.change_detector.detect_anomaly(raw_value):
            status = "ANOMALY"
        else:
            status = "OK"

        # 3. Filter
        filtered = self.ema_filter.filter(raw_value)

        # 4. Log
        self.logger.log_reading(raw_value, filtered, status)

        return filtered

    def get_status(self):
        """Get system status."""
        return {
            'readings_processed': self.raw_count,
            'last_value': self.ema_filter.previous
        }

# Use it
system = RobustSensorSystem()

# Simulate readings
readings = [100, 102, 101, 103, 200, 105, 104, 106, 108, 105]

for reading in readings:
    filtered = system.process_reading(reading)
    if filtered:
        print(f"  Filtered: {filtered:.1f}")

print(system.get_status())
```

## Statistical Analysis

Analyze processed data:

```python
import statistics
import numpy as np

class SensorStatistics:
    def __init__(self, readings):
        self.readings = readings

    def mean(self):
        return statistics.mean(self.readings)

    def median(self):
        return statistics.median(self.readings)

    def stdev(self):
        return statistics.stdev(self.readings)

    def min_max(self):
        return min(self.readings), max(self.readings)

    def percentile(self, p):
        """Get percentile (0-100)."""
        sorted_data = sorted(self.readings)
        index = int((p / 100) * len(sorted_data))
        return sorted_data[index]

    def report(self):
        print(f"Statistics Report")
        print(f"  Mean:        {self.mean():.2f}")
        print(f"  Median:      {self.median():.2f}")
        print(f"  Std Dev:     {self.stdev():.2f}")
        print(f"  Min/Max:     {self.min_max()}")
        print(f"  25th %ile:   {self.percentile(25):.2f}")
        print(f"  75th %ile:   {self.percentile(75):.2f}")

# Use it
readings = [100, 102, 101, 103, 105, 104, 106, 108, 105, 107]
stats = SensorStatistics(readings)
stats.report()
```

## Challenge Project

### Build a Complete Sensor System

```python
class AdvancedRobot:
    def __init__(self):
        self.sensors = {
            'distance': RobustSensorSystem(),
            'temperature': RobustSensorSystem(),
            'battery': RobustSensorSystem()
        }

    def update(self, sensor_data):
        """
        sensor_data = {
            'distance': 85,
            'temperature': 25,
            'battery': 75
        }
        """
        results = {}
        for sensor_name, value in sensor_data.items():
            filtered = self.sensors[sensor_name].process_reading(value)
            results[sensor_name] = filtered

        # Make decisions based on processed data
        self.make_decision(results)

        return results

    def make_decision(self, sensor_data):
        """Make robot decisions based on sensor data."""
        if sensor_data['distance'] and sensor_data['distance'] < 30:
            print("OBSTACLE AHEAD - Turning")

        if sensor_data['temperature'] and sensor_data['temperature'] > 60:
            print("WARNING - Overheating!")

        if sensor_data['battery'] and sensor_data['battery'] < 20:
            print("LOW BATTERY - Return to base")

# Use it
robot = AdvancedRobot()

sensor_readings = [
    {'distance': 100, 'temperature': 25, 'battery': 85},
    {'distance': 95, 'temperature': 26, 'battery': 84},
    {'distance': 200, 'temperature': 30, 'battery': 82},
    {'distance': 30, 'temperature': 35, 'battery': 80},
]

for reading in sensor_readings:
    print(f"\nReading: {reading}")
    results = robot.update(reading)
    print(f"Processed: {results}")
```

## Key Concepts

| Technique | Use Case |
|-----------|----------|
| **Moving Average** | Simple smoothing |
| **EMA** | Responsive filtering |
| **Median** | Robust to outliers |
| **Validation** | Check sensor bounds |
| **Change Detection** | Find anomalies |
| **Logging** | Record data for analysis |

## Key Takeaways

✅ Filter noisy sensor data
✅ Validate readings before use
✅ Detect anomalies
✅ Log data for analysis
✅ Use statistics to understand patterns

## Resources & Further Reading

- [Digital Filtering](https://en.wikipedia.org/wiki/Digital_filter)
- [Time Series Analysis](https://www.statsmodels.org/)
- [Kalman Filters (Advanced)](https://en.wikipedia.org/wiki/Kalman_filter)

---

**Next Module:** [Module 4: Advanced Robotics →](/docs/module-4-advanced/lesson-4-1-machine-learning)
