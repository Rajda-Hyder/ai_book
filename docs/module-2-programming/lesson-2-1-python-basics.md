---
sidebar_position: 1
---

# Lesson 2.1: Introduction to Python

## Learning Objectives

By the end of this lesson, you will:
- Write your first Python programs
- Understand variables, data types, and basic operations
- Use print statements and input
- Know when and why to use Python for robotics

## What is Python?

Python is a programming language that's:
- **Easy to learn** — Simple, readable syntax
- **Powerful** — Used by scientists, AI researchers, robots
- **Popular** — Huge community and libraries
- **Perfect for robotics** — Great for Raspberry Pi, OpenAI, and automation

## Setting Up Python

### Install Python

```bash
# On Windows: Download from python.org
# On Mac/Linux:
sudo apt-get install python3
python3 --version
```

### Your First Program

Open a text editor (or IDE like VS Code) and create `hello_robot.py`:

```python
print("Hello, Robotics World!")
```

Run it:
```bash
python3 hello_robot.py
```

**Output:**
```
Hello, Robotics World!
```

## Variables and Data Types

A **variable** stores information (like a labeled box).

```python
# Strings (text)
robot_name = "Spark"
manufacturer = "TechCorp"

# Integers (whole numbers)
wheel_count = 4
battery_voltage = 9

# Floats (decimal numbers)
robot_weight = 2.5  # kg
motor_speed = 250.75  # RPM

# Booleans (True or False)
is_powered = True
is_moving = False

# Print them
print(f"Robot: {robot_name}")
print(f"Wheels: {wheel_count}")
print(f"Weight: {robot_weight} kg")
print(f"Powered: {is_powered}")
```

**Output:**
```
Robot: Spark
Wheels: 4
Weight: 2.5 kg
Powered: True
```

## Basic Operations

### Math

```python
# Addition
distance = 10 + 5  # 15
speed = 100 - 20   # 80
power = 5 * 4      # 20
time = 60 / 3      # 20.0

# Power
strength = 2 ** 3  # 8 (2 to the power of 3)

# Modulus (remainder)
remainder = 17 % 5  # 2

print(f"Speed: {speed}")
print(f"Power: {power}")
print(f"Remainder: {remainder}")
```

### String Operations

```python
# Concatenation (joining strings)
greeting = "Hello, " + "Robot!"
print(greeting)  # "Hello, Robot!"

# Repetition
emoji = "🤖 " * 3
print(emoji)  # 🤖 🤖 🤖

# String methods
name = "spark"
print(name.upper())      # "SPARK"
print(name.capitalize()) # "Spark"
print(name.replace("spark", "Nova"))  # "Nova"
```

## Input and Output

```python
# Get user input
robot_name = input("What's your robot's name? ")
battery_level = int(input("Battery (0-100)? "))

print(f"Welcome, {robot_name}!")
print(f"Battery: {battery_level}%")
```

**Example Run:**
```
What's your robot's name? Spark
Battery (0-100)? 85
Welcome, Spark!
Battery: 85%
```

## Making Decisions: If-Else

```python
battery = 75

if battery > 80:
    print("Battery is excellent!")
elif battery > 50:
    print("Battery is good.")
elif battery > 20:
    print("Battery is low. Find a charger!")
else:
    print("CRITICAL: Battery will die soon!")
```

## Lists and Loops

### Lists (Collections of Items)

```python
# List of sensor readings
distances = [10, 15, 8, 12, 20]

# Access items
first = distances[0]  # 10
last = distances[-1]  # 20

# Add items
distances.append(18)

# Loop through list
print("Distance readings:")
for distance in distances:
    print(f"  {distance} cm")

# List of motor speeds
motor_speeds = [100, 150, 200, 250, 300]
for speed in motor_speeds:
    if speed > 200:
        print(f"Speed {speed} is HIGH!")
```

## Dictionaries (Key-Value Pairs)

Perfect for storing robot data!

```python
# Robot specification
robot = {
    "name": "Spark",
    "wheels": 4,
    "weight": 2.5,
    "powered": True
}

# Access values
print(f"Name: {robot['name']}")
print(f"Wheels: {robot['wheels']}")

# Update values
robot['powered'] = False

# Add new data
robot['color'] = "red"
robot['speed'] = 250

# Loop through all data
for key, value in robot.items():
    print(f"{key}: {value}")
```

## Functions (Reusable Code)

Functions let you write code once and use it many times.

```python
# Define a function
def move_forward(distance):
    """Tell robot to move forward."""
    print(f"Moving forward {distance} cm")

def turn(direction):
    """Turn the robot."""
    if direction == "left":
        print("Turning LEFT")
    elif direction == "right":
        print("Turning RIGHT")

# Use the functions
move_forward(50)
turn("left")
move_forward(30)
turn("right")

# Function with return value
def calculate_battery_percentage(current, max_voltage):
    """Calculate battery percentage."""
    return (current / max_voltage) * 100

percentage = calculate_battery_percentage(7.5, 9.0)
print(f"Battery: {percentage:.1f}%")
```

## Real Robot Example: Battery Monitor

```python
def check_battery(voltage):
    """Check and report battery status."""
    max_voltage = 9.0

    percentage = (voltage / max_voltage) * 100

    if percentage > 80:
        status = "✓ Excellent"
    elif percentage > 50:
        status = "✓ Good"
    elif percentage > 20:
        status = "⚠ Low"
    else:
        status = "✗ CRITICAL"

    print(f"Battery: {voltage}V ({percentage:.1f}%) - {status}")

# Test it
check_battery(8.5)   # ✓ Excellent
check_battery(6.0)   # ✓ Good
check_battery(2.5)   # ✗ CRITICAL
```

## Challenge Project

### Build a Robot Menu System

**Goal:** Create a program that lets users control a robot through a menu

```python
def robot_menu():
    """Interactive robot control menu."""
    print("\n=== ROBOT CONTROL MENU ===")
    print("1. Move forward")
    print("2. Turn left")
    print("3. Turn right")
    print("4. Stop")
    print("5. Check battery")
    print("6. Exit")

    choice = input("Choose (1-6): ")

    if choice == "1":
        distance = int(input("Distance (cm): "))
        print(f"Moving forward {distance} cm...")
    elif choice == "2":
        print("Turning LEFT...")
    elif choice == "3":
        print("Turning RIGHT...")
    elif choice == "4":
        print("STOPPING...")
    elif choice == "5":
        voltage = float(input("Current voltage: "))
        percentage = (voltage / 9.0) * 100
        print(f"Battery: {percentage:.1f}%")
    elif choice == "6":
        print("Goodbye!")
    else:
        print("Invalid choice!")

# Run the menu
robot_menu()
```

## Key Concepts

| Concept | Example |
|---------|---------|
| **Variable** | `robot_name = "Spark"` |
| **Data Type** | String, int, float, boolean |
| **String** | `"Hello"` (text) |
| **Integer** | `42` (whole number) |
| **Float** | `3.14` (decimal) |
| **List** | `[1, 2, 3]` (collection) |
| **Dictionary** | `{"name": "Spark"}` (key-value) |
| **Loop** | `for x in list:` (repeat) |
| **Condition** | `if x > 5:` (decision) |
| **Function** | `def move():` (reusable code) |

## Key Takeaways

✅ Python is perfect for robotics
✅ Variables store data
✅ If-else makes decisions
✅ Loops repeat code
✅ Functions organize code
✅ Lists and dicts store collections

## Resources & Further Reading

- [Python Official Tutorial](https://docs.python.org/3/tutorial/)
- [Python for Beginners (python.org)](https://www.python.org/about/gettingstarted/)
- [Real Python Tutorials](https://realpython.com/)

---

**Next Lesson:** [Lesson 2.2: Robot Control with Code →](/docs/module-2-programming/lesson-2-2-robot-control)
