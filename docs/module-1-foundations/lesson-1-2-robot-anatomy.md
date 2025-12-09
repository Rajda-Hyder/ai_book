---
sidebar_position: 2
---

# Lesson 1.2: Robot Anatomy & Components

## Learning Objectives

By the end of this lesson, you will:
- Know the main parts of a robot and their functions
- Understand sensors, actuators, and controllers
- See how different components work together
- Learn about microcontrollers like Arduino and Raspberry Pi

## The Four Main Systems of a Robot

### 1. **Sensing System** 👁️

Robots need to know what's happening around them.

**Common Sensors:**

| Sensor | What It Measures | Example Use |
|--------|-----------------|-------------|
| **Camera** | Visual information (images, colors, objects) | Navigation, object recognition |
| **Ultrasonic** | Distance to objects | Avoiding obstacles |
| **Infrared (IR)** | Heat and proximity | Detecting motion |
| **Accelerometer** | Movement and tilt | Detecting falls or bumps |
| **Gyroscope** | Rotation and angle | Balancing, rotation detection |
| **Touch/Button** | Physical contact | User input, collision detection |
| **Temperature** | Heat levels | Environmental monitoring |
| **Light Sensor** | Brightness levels | Night/day detection |

### 2. **Processing System** 🧠

The "brain" of the robot—a computer that makes decisions.

**Common Processors:**

#### **Arduino**
```
┌──────────────────┐
│     Arduino      │
│   Microcontroller│
│  - 16 MHz CPU    │
│  - Memory: 32KB  │
│  - Simple, cheap │
│  - Great for    │
│    beginners    │
└──────────────────┘
```
- Best for: Simple robots, learning
- Cost: ~$20–30
- Language: C/C++

#### **Raspberry Pi**
```
┌──────────────────┐
│  Raspberry Pi    │
│  Mini Computer   │
│  - 1.5 GHz CPU   │
│  - Memory: 4GB   │
│  - Runs Linux    │
│  - More power    │
└──────────────────┘
```
- Best for: Complex robots, AI/vision
- Cost: ~$35–70
- Language: Python, C++, others

#### **Jetson Nano**
- Best for: AI and machine learning
- Cost: ~$99
- Language: Python, C++

### 3. **Actuation System** ⚙️

The parts that move and act—the "hands and feet."

**Common Actuators:**

| Actuator | What It Does | Speed | Power |
|----------|-------------|-------|-------|
| **DC Motor** | Spins continuously | Fast | Medium |
| **Servo Motor** | Moves to specific angles (0–180°) | Slow | Low |
| **Stepper Motor** | Precise step-by-step rotation | Medium | Medium |
| **Linear Actuator** | Pushes or pulls | Slow | High |
| **Solenoid** | Click, lock, or release | Instant | Low |

### 4. **Power System** 🔋

Robots need energy!

**Common Power Sources:**

| Source | Voltage | Best For | Pros | Cons |
|--------|---------|----------|------|------|
| **AA Batteries** | 1.5V each | Small robots | Cheap, available | Low power |
| **9V Battery** | 9V | Medium robots | Decent power | Heavy |
| **LiPo Battery** | 3.7V–14.8V | Drones, mobile robots | High power, lightweight | Needs care |
| **Solar Panel** | Variable | Outdoor robots | Unlimited energy | Weather dependent |

## How These Systems Connect

```
┌─────────────────────────────────────────────┐
│             ROBOT SYSTEM FLOW               │
├─────────────────────────────────────────────┤
│  SENSE          THINK         ACT           │
│    │              │            │            │
│  Camera ──→ Raspberry Pi ──→ Motor          │
│  Sensor ──→ (Decision Logic) ──→ Servo      │
│    │              │            │            │
│   Input        Process        Output        │
└─────────────────────────────────────────────┘
```

## Example: A Simple Line-Following Robot

**Components:**
- Raspberry Pi (processor)
- 2× IR sensors (detect black line)
- 2× DC motors + wheels (movement)
- Battery pack (power)

**How it works:**
1. **Sense:** IR sensors see if robot is on the line
2. **Think:** Processor decides: "Left? Right? Straight?"
3. **Act:** Motors adjust to follow the line

## Building Your First Robot

### What You'll Need (Starter Kit)

1. **Microcontroller:** Arduino ($25) or Raspberry Pi ($50)
2. **Motors:** 2 small DC motors ($10)
3. **Sensors:** 1 camera or IR sensor ($15)
4. **Wheels & Chassis:** $15
5. **Battery:** 9V or battery pack ($10)
6. **Wires, USB cables, breadboard:** $20

**Total: ~$100 for a basic robot**

### Your First Program (Arduino Example)

```cpp
// Simple motor control
int motorPin = 3;

void setup() {
  pinMode(motorPin, OUTPUT);
}

void loop() {
  digitalWrite(motorPin, HIGH);  // Turn motor ON
  delay(1000);                   // Wait 1 second

  digitalWrite(motorPin, LOW);   // Turn motor OFF
  delay(1000);                   // Wait 1 second
}
```

## Key Concepts

| Term | Definition |
|------|-----------|
| **Microcontroller** | Small computer that runs robot programs |
| **I/O (Input/Output)** | Sensors (input) and motors (output) |
| **PWM** | Pulse-Width Modulation (controls motor speed) |
| **Voltage** | Electrical pressure (measured in Volts, V) |
| **Current** | Flow of electricity (measured in Amps, A) |
| **Resistance** | Opposition to electrical flow (measured in Ohms, Ω) |

## Challenge Project

### Build a Simple Circuit

**Goal:** Control an LED with a button

**What You'll Need:**
- Arduino board
- 1 LED
- 1 button
- 1 resistor (220Ω)
- Breadboard + wires

**Steps:**
1. Connect button to Arduino input pin
2. Connect LED to Arduino output pin
3. Write code: "If button pressed, light LED"
4. Test!

## Key Takeaways

✅ Robots have four main systems: sensing, processing, actuation, power
✅ Arduino is great for learning; Raspberry Pi for complex projects
✅ Sensors give the robot information about the world
✅ Actuators (motors) make the robot move and act
✅ You can build a simple robot for under $100

## Resources & Further Reading

- [Arduino Official Site](https://www.arduino.cc)
- [Raspberry Pi Learning](https://www.raspberrypi.org/learn)
- [Components Explained (Adafruit)](https://learn.adafruit.com)

---

**Next Lesson:** [Lesson 1.3: Motors, Sensors & Control →](/docs/module-1-foundations/lesson-1-3-motors-sensors-control)
