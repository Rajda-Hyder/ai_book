---
sidebar_position: 3
---

# Lesson 2.3: Loops, Conditionals & Logic

## Learning Objectives

By the end of this lesson, you will:
- Master for and while loops
- Use conditionals (if/elif/else) for decision-making
- Understand logical operators (and, or, not)
- Write efficient, reusable robot code
- Debug logic errors

## For Loops (Repeat a Specific Number of Times)

```python
# Simple counting loop
for i in range(5):
    print(f"Step {i}")

# Output:
# Step 0
# Step 1
# Step 2
# Step 3
# Step 4
```

### Robot Application: Sensor Scan

```python
# Take 10 sensor readings
sensor_readings = []

for i in range(10):
    reading = read_ultrasonic_sensor()
    sensor_readings.append(reading)
    print(f"Reading {i+1}: {reading} cm")
```

### Loop Through Collections

```python
# Motor speeds to test
speeds = [50, 75, 100, 125, 150]

for speed in speeds:
    print(f"Testing speed: {speed}%")
    move_robot_forward(speed)
    wait(1)
    stop_robot()
```

## While Loops (Repeat While Condition is True)

```python
# Keep asking until valid input
is_valid = False

while not is_valid:
    choice = input("Enter 1-3: ")
    if choice in ['1', '2', '3']:
        is_valid = True
    else:
        print("Invalid input!")

print(f"You chose: {choice}")
```

### Robot Application: Follow a Line Until Lost

```python
# Continue until we lose the line
while is_on_line():
    sensor_value = read_sensor()
    if sensor_value < 100:
        move_forward(75)
    else:
        turn_left(75)

print("Lost the line!")
```

### Infinite Loop with Break

```python
# Robot patrol loop
while True:
    move_forward(100)
    wait(2)
    check_battery()

    # Exit if battery is too low
    if get_battery() < 10:
        print("Battery critical! Returning to base...")
        break

stop_robot()
```

## Conditionals (If/Elif/Else)

### Basic If Statement

```python
speed = 85

if speed > 100:
    print("Speed too high!")
```

### If/Else

```python
distance = 15

if distance < 20:
    print("Obstacle ahead!")
else:
    print("Path is clear")
```

### If/Elif/Else (Multiple Conditions)

```python
battery = 60

if battery > 80:
    status = "Excellent"
elif battery > 60:
    status = "Good"
elif battery > 40:
    status = "Fair"
elif battery > 20:
    status = "Low"
else:
    status = "Critical!"

print(f"Battery status: {status}")
```

## Logical Operators: and, or, not

### AND Operator (Both Conditions Must Be True)

```python
left_sensor = 100
right_sensor = 80
battery = 75

# Robot can move only if both sensors detect line AND battery is good
if left_sensor < 150 and right_sensor < 150 and battery > 20:
    move_forward(75)
else:
    print("Cannot move!")
```

### OR Operator (At Least One Condition Must Be True)

```python
button_pressed = False
motion_detected = True
timer_expired = False

# Wake up robot if button pressed OR motion detected OR timer expired
if button_pressed or motion_detected or timer_expired:
    print("Robot waking up!")
```

### NOT Operator (Reverse Logic)

```python
is_charging = False

if not is_charging:
    print("Robot is ready to move")

# Equivalent to:
if is_charging == False:
    print("Robot is ready to move")
```

## Complex Robot Logic

### Obstacle Avoidance with Multiple Sensors

```python
def navigate_robot():
    """Complex obstacle avoidance logic."""
    front_distance = read_front_sensor()
    left_distance = read_left_sensor()
    right_distance = read_right_sensor()
    battery = get_battery_percentage()

    # Check if path ahead is clear
    if front_distance > 30:
        move_forward(100)

    # Path blocked - decide which way to turn
    elif left_distance > 20 and right_distance < 20:
        # More space on left
        turn_left(75)

    elif right_distance > 20 and left_distance < 20:
        # More space on right
        turn_right(75)

    elif left_distance > 20 and right_distance > 20:
        # Space on both sides - prefer right
        turn_right(75)

    else:
        # Stuck! Back up
        move_backward(75)
        wait(1)
        turn_around()

    # Check battery and alert if low
    if battery < 15:
        print("⚠ LOW BATTERY - Returning to charger")
        return_to_base()
```

## Nested Loops (Loops Inside Loops)

```python
# Test all speeds in different directions
directions = ['forward', 'left', 'right', 'backward']
speeds = [50, 75, 100]

for direction in directions:
    print(f"\nTesting {direction}:")
    for speed in speeds:
        print(f"  Speed: {speed}%")
        execute_movement(direction, speed)
        wait(0.5)

print("Testing complete!")
```

### Robot Grid Search

```python
# Search a 3x3 grid
grid_size = 3

for row in range(grid_size):
    for col in range(grid_size):
        print(f"Scanning position ({row}, {col})")
        move_to_position(row, col)
        scan_for_objects()
        wait(1)

print("Grid search complete!")
```

## List Comprehensions (Advanced)

Create lists efficiently:

```python
# Regular way
speeds = []
for i in range(1, 6):
    speeds.append(i * 50)  # [50, 100, 150, 200, 250]

# List comprehension way (more concise)
speeds = [i * 50 for i in range(1, 6)]

# With condition
fast_speeds = [speed for speed in speeds if speed > 100]
# [150, 200, 250]
```

## Truth Tables & Logic

```python
# AND truth table
print(True and True)    # True
print(True and False)   # False
print(False and False)  # False

# OR truth table
print(True or False)    # True
print(False or False)   # False

# NOT truth table
print(not True)         # False
print(not False)        # True
```

## Debugging Common Logic Errors

### Error 1: Using = instead of ==

```python
# WRONG - This sets x to 5
if x = 5:
    print("x is 5")

# CORRECT - This compares x to 5
if x == 5:
    print("x is 5")
```

### Error 2: Forgetting AND/OR

```python
# WRONG - This doesn't work as intended
if battery > 20:
    if distance < 30:
        stop_robot()

# CORRECT - Use AND
if battery > 20 and distance < 30:
    stop_robot()
```

### Error 3: Off-by-One Errors

```python
# Loop goes 0-4 (5 iterations)
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# Loop goes 1-5 (5 iterations)
for i in range(1, 6):
    print(i)  # 1, 2, 3, 4, 5
```

## Challenge Project

### Build a Smart Robot Patrol System

```python
class PatrolRobot:
    def __init__(self):
        self.position = 0
        self.battery = 100
        self.is_on_patrol = False

    def start_patrol(self):
        """Start patrol mode."""
        self.is_on_patrol = True
        patrol_count = 0

        while self.is_on_patrol:
            # Check battery first
            if self.battery < 15:
                print("Battery low! Returning to base...")
                self.return_to_base()
                break

            # Patrol routine
            print(f"\nPatrol cycle {patrol_count + 1}")

            # Forward
            for i in range(10):
                self.move_forward()
                self.battery -= 1
                if self.battery <= 0:
                    self.is_on_patrol = False
                    break

            if not self.is_on_patrol:
                break

            # Turn and come back
            self.turn_around()

            for i in range(10):
                self.move_forward()
                self.battery -= 1
                if self.battery <= 0:
                    self.is_on_patrol = False
                    break

            patrol_count += 1

            # Check if we should continue
            if patrol_count >= 3:
                print("Patrol cycles complete!")
                self.is_on_patrol = False

    def move_forward(self):
        self.position += 1
        print(f"  Position: {self.position}, Battery: {self.battery}%")

    def turn_around(self):
        print("  Turning around...")

    def return_to_base(self):
        print("  Returning to base...")
        self.position = 0

# Run it
robot = PatrolRobot()
robot.start_patrol()
```

## Key Concepts

| Concept | Use Case |
|---------|----------|
| **for loop** | Repeat fixed number of times |
| **while loop** | Repeat until condition changes |
| **if/elif/else** | Make decisions |
| **and/or/not** | Combine conditions |
| **break** | Exit a loop early |
| **continue** | Skip to next iteration |

## Key Takeaways

✅ For loops repeat a set number of times
✅ While loops repeat until a condition is false
✅ If/elif/else makes decisions
✅ Logical operators combine conditions
✅ Nested loops solve complex problems
✅ Test logic carefully to avoid errors

## Resources & Further Reading

- [Python Control Flow](https://docs.python.org/3/tutorial/controlflow.html)
- [Truth Tables & Logic](https://en.wikipedia.org/wiki/Truth_table)
- [Algorithm Design (Khan Academy)](https://www.khanacademy.org/)

---

**Next Module:** [Module 3: Sensing & Perception →](/docs/module-3-sensing/lesson-3-1-computer-vision)
