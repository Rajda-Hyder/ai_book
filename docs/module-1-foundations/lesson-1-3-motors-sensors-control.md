---
sidebar_position: 3
---

# Lesson 1.3: Motors, Sensors & Control

## Learning Objectives

By the end of this lesson, you will:
- Understand how motors work and control motor speed
- Learn how to read sensor data
- Write code to make decisions based on sensor input
- Build a robot that responds to its environment

## How Motors Work

### DC (Direct Current) Motor

A DC motor spins when electricity flows through it.

```
┌─────────────────────────────────────┐
│  DC MOTOR                           │
│  ┌─────────────────────────────┐   │
│  │  Magnetic Field             │   │
│  │  ┌─────────────────────┐    │   │
│  │  │   Coil (spins)      │    │   │
│  │  │     ↻ ↻ ↻           │    │   │
│  │  └─────────────────────┘    │   │
│  │  Power: + and - terminals   │   │
│  └─────────────────────────────┘   │
│  Reverse polarity = Reverse spin    │
└─────────────────────────────────────┘
```

**Key points:**
- More voltage = faster spin
- Reverse polarity = opposite direction
- Current determines torque (power)

### Motor Control: PWM (Pulse-Width Modulation)

We can't easily change motor voltage, so we use **PWM**—turning power ON and OFF rapidly.

```
100% Speed:  ████████████ (always ON)
 75% Speed:  ███████░░░░░ (75% ON, 25% OFF)
 50% Speed:  ██████░░░░░░ (50% ON, 50% OFF)
 25% Speed:  ███░░░░░░░░░ (25% ON, 75% OFF)
  0% Speed:  ░░░░░░░░░░░░ (always OFF)
```

### Servo Motor

A servo motor rotates to a specific angle (usually 0–180 degrees).

**Advantages:**
- Precise position control
- No need for feedback sensors
- Perfect for robot arms and joints

**Code Example (Arduino):**

```cpp
#include <Servo.h>

Servo myServo;
int servoPin = 9;

void setup() {
  myServo.attach(servoPin);
}

void loop() {
  myServo.write(0);      // Move to 0 degrees
  delay(1000);
  myServo.write(90);     // Move to 90 degrees
  delay(1000);
  myServo.write(180);    // Move to 180 degrees
  delay(1000);
}
```

## How Sensors Work

### Ultrasonic Sensor (Distance Detection)

Measures distance by sending sound waves.

```
SEND:     [Beep] ──────→
                      Object
RECEIVE:              ←────── [Echo]

Time = (Send + Receive) / 2
Distance = Speed of Sound × Time
```

**Code Example:**

```cpp
const int trigPin = 5;
const int echoPin = 6;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  // Send pulse
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Measure echo time
  long duration = pulseIn(echoPin, HIGH);

  // Convert to distance (in cm)
  long distance = duration * 0.034 / 2;

  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  delay(100);
}
```

### IR (Infrared) Sensor

Detects obstacles or lines by measuring reflected light.

```
        Sensor
           │
      ┌────┴────┐
      │ IR LED  │ (sends IR light)
      │ Receiver│ (detects reflection)
      └────┬────┘
           │
           v
      ┌─────────┐
      │ Surface │
      └─────────┘
```

**Code Example:**

```cpp
int irSensor = A0;  // Analog input

void setup() {
  Serial.begin(9600);
}

void loop() {
  int value = analogRead(irSensor);

  if (value > 500) {
    Serial.println("Object detected!");
  } else {
    Serial.println("No object");
  }

  delay(100);
}
```

## Making Decisions: If-Else Logic

Now we combine sensors and motors:

```cpp
// Obstacle avoidance robot

int distanceSensor = A0;
int leftMotor = 3;
int rightMotor = 5;

void setup() {
  pinMode(leftMotor, OUTPUT);
  pinMode(rightMotor, OUTPUT);
}

void loop() {
  int distance = readDistance();

  if (distance > 20) {
    // Clear path ahead - move forward
    moveForward();
  } else if (distance < 20) {
    // Obstacle nearby - turn right
    turnRight();
  }

  delay(100);
}

void moveForward() {
  analogWrite(leftMotor, 255);   // Full speed
  analogWrite(rightMotor, 255);  // Full speed
}

void turnRight() {
  analogWrite(leftMotor, 255);   // Left fast
  analogWrite(rightMotor, 0);    // Right stop
  delay(500);
}

int readDistance() {
  // Returns distance in cm (simplified)
  return analogRead(distanceSensor) / 4;
}
```

## Sensor Fusion: Combining Multiple Sensors

Real robots use **many sensors** to make better decisions.

**Example: Line-Following Robot**

```cpp
int leftIR = A0;
int rightIR = A1;
int leftMotor = 3;
int rightMotor = 5;

void loop() {
  int left = analogRead(leftIR);
  int right = analogRead(rightIR);

  if (left < 300 && right < 300) {
    // Both on line - go forward
    moveForward();
  } else if (left > 300) {
    // Drifting left - turn left
    turnLeft();
  } else if (right > 300) {
    // Drifting right - turn right
    turnRight();
  }
}
```

## Control Systems

### Open-Loop Control
Robot acts without feedback.

```
Command → Motor → Action
(No checking if it worked)
```

**Example:** "Spin motor for 1 second"

### Closed-Loop Control
Robot checks results and adjusts.

```
Command → Motor → Action → Sensor → Check
                                      ↓
                          (Adjust if needed)
```

**Example:** Line-following robot continuously corrects its path

## Challenge Project

### Build an Obstacle Avoidance Robot

**Goal:** Robot moves forward but stops/turns when it detects an obstacle

**Components Needed:**
- Arduino
- 2 DC motors + wheels
- 1 ultrasonic sensor
- Motor driver (like L298N)
- 9V battery

**Code:**

```cpp
const int trigPin = 5;
const int echoPin = 6;
const int leftMotor = 3;
const int rightMotor = 5;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(leftMotor, OUTPUT);
  pinMode(rightMotor, OUTPUT);
}

void loop() {
  long distance = measureDistance();

  if (distance > 20) {
    moveForward();
  } else {
    stop();
    delay(500);
    turnRight();
    delay(600);
  }
}

long measureDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  return duration * 0.034 / 2;
}

void moveForward() {
  analogWrite(leftMotor, 200);
  analogWrite(rightMotor, 200);
}

void turnRight() {
  analogWrite(leftMotor, 200);
  analogWrite(rightMotor, 50);
}

void stop() {
  analogWrite(leftMotor, 0);
  analogWrite(rightMotor, 0);
}
```

## Key Concepts

| Concept | Explanation |
|---------|-------------|
| **PWM** | Controls motor speed by turning power on/off quickly |
| **Servo** | Motor that rotates to specific angles |
| **Sensor Fusion** | Using multiple sensors for better decisions |
| **Feedback Loop** | Using sensor data to correct robot behavior |
| **Threshold** | A value that triggers a decision (e.g., "if distance < 20cm") |

## Key Takeaways

✅ DC motors spin based on voltage and polarity
✅ PWM controls motor speed
✅ Sensors measure the environment
✅ Code combines sensors and motors to make smart robots
✅ Closed-loop control (with feedback) works better than open-loop

## Resources & Further Reading

- [Arduino Motor Control](https://www.arduino.cc/en/Reference/PWM)
- [Sensor Guide (Adafruit)](https://learn.adafruit.com/series/sensor-tutorials)
- [Obstacle Avoidance Tutorial](https://create.arduino.cc)

---

**Next Module:** [Module 2: Programming Your First Robot →](/docs/module-2-programming/lesson-2-1-python-basics)
