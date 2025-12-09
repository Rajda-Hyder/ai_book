---
sidebar_position: 1
---

# Lesson 4.1: Machine Learning Basics

## Learning Objectives

By the end of this lesson, you will:
- Understand what machine learning is
- Know the difference between supervised and unsupervised learning
- Train a simple ML model with Python
- Use ML for robot decision-making
- Understand limitations of ML

## What is Machine Learning?

Traditional programming:
```
Rules + Data = Output
If distance < 20: stop()
```

Machine learning:
```
Data + Output = Rules (learned automatically)
Robot learns what to do from experience
```

**Example:** Instead of hard-coding "If seeing red ball, go left", the robot learns this rule from examples.

## Types of Machine Learning

### 1. **Supervised Learning**
You provide examples with correct answers:

```
Training Data:
  Image of ball → "Go forward"
  Image of obstacle → "Stop"
  Image of wall → "Turn left"

ML learns pattern from examples
```

**Use cases:** Object detection, classification, control

### 2. **Unsupervised Learning**
No correct answers—find patterns in data:

```
Training Data:
  [100 sensor readings from similar situations]

ML groups similar readings together
```

**Use cases:** Clustering, anomaly detection

### 3. **Reinforcement Learning**
Robot learns from rewards/penalties:

```
Action → Reward
Move forward → +10 (good!)
Hit wall → -100 (bad!)

Robot learns to maximize reward
```

**Use cases:** Game playing, robot control

## Simple Classification with Scikit-Learn

Classify robot states (moving, stopped, charging):

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Training data: [speed, battery, temperature] → State
training_data = [
    [50, 75, 25],    # Moving normally
    [50, 75, 25],
    [50, 70, 24],
    [0, 100, 20],    # Stopped
    [0, 100, 20],
    [0, 95, 22],
    [10, 90, 30],    # Charging
    [10, 92, 31],
]

# Labels: 0=moving, 1=stopped, 2=charging
labels = [0, 0, 0, 1, 1, 1, 2, 2]

# Split into training and testing
X_train, X_test, y_train, y_test = train_test_split(
    training_data, labels, test_size=0.2, random_state=42
)

# Create and train model
model = DecisionTreeClassifier()
model.fit(X_train, y_train)

# Test accuracy
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"Accuracy: {accuracy:.2%}")

# Use it to classify new data
new_reading = [[45, 72, 26]]
state = model.predict(new_reading)[0]
state_names = {0: "Moving", 1: "Stopped", 2: "Charging"}
print(f"Robot state: {state_names[state]}")
```

## Neural Networks for Robotics

A simple neural network for gesture recognition:

```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# Training data: [gesture_features] → gesture_type
# Example: Hand position (x, y, z) → gesture (forward, stop, turn)

training_data = [
    [0.1, 0.2, 0.3],    # Forward gesture
    [0.15, 0.25, 0.35],
    [0.5, 0.5, 0.5],    # Stop gesture
    [0.55, 0.55, 0.55],
    [0.9, 0.1, 0.2],    # Turn gesture
    [0.95, 0.15, 0.25],
]

labels = [1, 1, 0, 0, 2, 2]  # 0=stop, 1=forward, 2=turn

# Build neural network
model = Sequential([
    Dense(10, activation='relu', input_dim=3),   # Input layer
    Dense(5, activation='relu'),                  # Hidden layer
    Dense(3, activation='softmax')                # Output layer
])

# Compile
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy')

# Train
model.fit(training_data, labels, epochs=100, verbose=0)

# Predict
new_gesture = [[0.12, 0.22, 0.32]]
prediction = model.predict(new_gesture)
print(f"Gesture: {prediction.argmax()}")
```

## Clustering with K-Means

Group similar sensor readings:

```python
from sklearn.cluster import KMeans
import numpy as np

# Sensor readings: (distance, light_level)
readings = [
    [20, 100],   # Close to bright object
    [25, 105],
    [200, 50],   # Far from dark area
    [210, 45],
    [100, 200],  # Medium distance, bright
    [110, 210],
]

# Use K-Means to find 3 clusters
kmeans = KMeans(n_clusters=3)
clusters = kmeans.fit_predict(readings)

print("Cluster assignments:")
for i, cluster in enumerate(clusters):
    print(f"  Reading {i}: {readings[i]} → Cluster {cluster}")

# Find cluster centers
centers = kmeans.cluster_centers_
print(f"\nCluster centers: {centers}")
```

## Decision Trees (Easy to Understand)

Create human-readable decision rules:

```python
from sklearn.tree import DecisionTreeClassifier, plot_tree
import matplotlib.pyplot as plt

# Robot behavior training data
# [distance_to_obstacle, battery_level] → action
X = [
    [10, 80],   # Close obstacle, good battery → Stop
    [15, 90],
    [50, 20],   # Far, low battery → Find charger
    [100, 10],
    [100, 100], # Far, good battery → Continue forward
    [80, 95],
]

y = [0, 0, 1, 1, 2, 2]  # 0=stop, 1=find charger, 2=forward

model = DecisionTreeClassifier(max_depth=3)
model.fit(X, y)

# Visualize decision tree
plt.figure(figsize=(12, 8))
plot_tree(model, feature_names=['Distance', 'Battery'],
          class_names=['Stop', 'Find Charger', 'Forward'], filled=True)
plt.show()

# Use it
new_situation = [[35, 50]]
action = model.predict(new_situation)[0]
actions = {0: "Stop", 1: "Find Charger", 2: "Forward"}
print(f"Action: {actions[action]}")
```

## Feature Extraction

Convert raw data into useful features:

```python
def extract_features_from_image(image):
    """Extract features from camera image."""
    # Raw image: 640×480×3 = 921,600 values (too much!)
    # Features: 20 useful values

    # Color histogram
    red_pixels = np.count_nonzero(image[:,:,0] > 200)
    green_pixels = np.count_nonzero(image[:,:,1] > 200)
    blue_pixels = np.count_nonzero(image[:,:,2] > 200)

    # Edge detection
    edges = cv2.Canny(cv2.cvtColor(image, cv2.COLOR_BGR2GRAY), 100, 200)
    edge_count = np.count_nonzero(edges)

    # Object size
    contours, _ = cv2.findContours(edges, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    object_sizes = [cv2.contourArea(c) for c in contours]
    max_size = max(object_sizes) if object_sizes else 0

    # Return 5 features instead of 921,600 values
    return [red_pixels, green_pixels, blue_pixels, edge_count, max_size]

# Use it
features = extract_features_from_image(frame)
classification = model.predict([features])
```

## Real Robot Example: Learning Navigation

```python
class LearningRobot:
    def __init__(self):
        self.model = DecisionTreeClassifier()
        self.experience = []

    def gather_experience(self):
        """Record robot behavior and outcomes."""
        # Simulate collecting data
        for _ in range(100):
            # Sensor readings
            distance = random.randint(10, 200)
            speed = random.randint(0, 200)
            battery = random.randint(10, 100)

            # Action taken
            action = self.choose_action(distance, battery)

            # Outcome (good/bad)
            outcome = self.evaluate_outcome(distance, battery, speed)

            self.experience.append({
                'features': [distance, speed, battery],
                'action': action,
                'outcome': outcome
            })

    def train_model(self):
        """Train ML model from experience."""
        X = [e['features'] for e in self.experience]
        y = [e['outcome'] for e in self.experience]

        self.model.fit(X, y)

    def choose_action(self, distance, battery):
        """Use ML model to choose action."""
        features = [[distance, 0, battery]]
        return self.model.predict(features)[0]

    def evaluate_outcome(self, distance, battery, speed):
        """Rate the outcome of last action."""
        score = 0
        if distance > 50:
            score += 10  # Good - avoided obstacle
        if battery > 30:
            score += 5   # Good - conserving battery
        if speed > 100:
            score += 3   # Good - making progress
        return score

# Use it
robot = LearningRobot()
robot.gather_experience()
robot.train_model()

# Now robot makes smarter decisions
new_state = [60, 150, 75]
action = robot.choose_action(new_state[0], new_state[2])
print(f"Chosen action: {action}")
```

## Limitations & Dangers of ML

### Not Enough Data
Need 100s or 1000s of examples for good accuracy

### Overfitting
Model memorizes training data instead of learning patterns

```python
# Bad: Accuracy 100% on training, 40% on new data
model.fit(training_data, labels)

# Better: Use cross-validation
from sklearn.model_selection import cross_val_score
scores = cross_val_score(model, X, y, cv=5)
print(f"Average accuracy: {scores.mean():.2%}")
```

### Bias in Training Data
If training data is biased, model becomes biased

```
If trained only on sunny days,
robot fails when it rains
```

### Black Box Problem
Can't always explain WHY model made a decision

## Challenge Project

### Build a Robot Learning System

```python
class SmartRobot:
    def __init__(self):
        from sklearn.ensemble import RandomForestClassifier
        self.model = RandomForestClassifier(n_estimators=10)
        self.training_data = []

    def record_experience(self, sensors, action, success):
        """
        sensors = [distance, light, temperature]
        action = which motor command
        success = did it work?
        """
        self.training_data.append({
            'sensors': sensors,
            'action': action,
            'success': success
        })

    def train(self):
        """Learn from experience."""
        if len(self.training_data) > 10:
            X = [e['sensors'] for e in self.training_data]
            y = [1 if e['success'] else 0 for e in self.training_data]

            self.model.fit(X, y)
            print(f"Trained on {len(X)} examples")

    def decide_action(self, sensors):
        """Use ML to choose best action."""
        # Estimate success probability for each action
        probabilities = self.model.predict_proba([sensors])

        if probabilities[0][1] > 0.7:  # High success probability
            return "FORWARD"
        else:
            return "EXPLORE"

# Use it
robot = SmartRobot()

# Simulate learning
for i in range(50):
    sensors = [random.randint(10, 200), random.randint(0, 255), random.randint(20, 40)]
    action = random.choice(["FORWARD", "TURN", "BACK"])
    success = random.random() > 0.3

    robot.record_experience(sensors, action, success)

robot.train()

# Test
new_sensors = [100, 150, 25]
decision = robot.decide_action(new_sensors)
print(f"Decision: {decision}")
```

## Key Concepts

| Concept | Definition |
|---------|-----------|
| **Training** | Teaching ML model with examples |
| **Accuracy** | How often model's predictions are correct |
| **Overfitting** | Model memorizes instead of learning |
| **Feature** | Input variable for ML model |
| **Classification** | Predicting category (e.g., "stop" or "go") |
| **Regression** | Predicting number (e.g., speed) |

## Key Takeaways

✅ ML lets robots learn from data
✅ Supervised learning needs labeled examples
✅ Decision trees are interpretable
✅ Neural networks are powerful but complex
✅ More data = better models

## Resources & Further Reading

- [Scikit-Learn Documentation](https://scikit-learn.org/)
- [TensorFlow for Robotics](https://www.tensorflow.org/)
- [Andrew Ng's ML Course](https://www.coursera.org/learn/machine-learning)

---

**Next Lesson:** [Lesson 4.2: Autonomous Navigation →](/docs/module-4-advanced/lesson-4-2-autonomous-navigation)
