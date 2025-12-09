---
sidebar_position: 2
---

# Lesson 2.2: Robot Control with Code

## Learning Objectives

By the end of this lesson, you will:
- Control a real robot with Python
- Interface with GPIO (General Purpose Input/Output)
- Use libraries like RPi.GPIO and PySerial
- Write programs to move motors and read sensors
- Understand asynchronous robot control

## Controlling Raspberry Pi GPIO Pins

GPIO pins connect to motors, sensors, and lights.

```
┌─────────────────────────────────────┐
│  Raspberry Pi GPIO Header           │
├─────────────────────────────────────┤
│  Pin 1:  3.3V power                 │
│  Pin 2:  5V power                   │
│  Pin 3:  SDA (I2C data)             │
│  Pin 4:  5V power                   │
│  Pin 5:  SCL (I2C clock)            │
│  ...                                │
│  Pin 11: GPIO 17 (digital out)      │
│  Pin 12: GPIO 18 (PWM capable)      │
│  Pin 13: GPIO 27 (digital out)      │
│  ...                                │
│  Pin 39: GND (ground)               │
└─────────────────────────────────────┘
```

### Installing Required Libraries

```bash
pip3 install RPi.GPIO
pip3 install pigpio
pip3 install pyserial
```

### Your First GPIO Program

Control an LED:

```python
import RPi.GPIO as GPIO
import time

# Set up
GPIO.setmode(GPIO.BCM)  # Use BCM pin numbering
LED_PIN = 17
GPIO.setup(LED_PIN, GPIO.OUT)

# Blink LED
try:
    while True:
        GPIO.output(LED_PIN, GPIO.HIGH)  # Turn ON
        time.sleep(1)
        GPIO.output(LED_PIN, GPIO.LOW)   # Turn OFF
        time.sleep(1)
except KeyboardInterrupt:
    print("Stopped")
finally:
    GPIO.cleanup()
```

## Controlling Motors

### DC Motor Control with PWM

```python
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)

MOTOR_PIN = 18  # PWM-capable pin
GPIO.setup(MOTOR_PIN, GPIO.OUT)

# Create PWM object (frequency = 50 Hz)
pwm = GPIO.PWM(MOTOR_PIN, 50)
pwm.start(0)  # Start at 0% speed

try:
    # Ramp up speed
    for speed in range(0, 101, 10):
        pwm.ChangeDutyCycle(speed)
        print(f"Speed: {speed}%")
        time.sleep(0.5)

    # Hold at full speed
    time.sleep(2)

    # Ramp down speed
    for speed in range(100, -1, -10):
        pwm.ChangeDutyCycle(speed)
        print(f"Speed: {speed}%")
        time.sleep(0.5)

except KeyboardInterrupt:
    pass
finally:
    pwm.stop()
    GPIO.cleanup()
```

### Two-Wheeled Robot Movement

```python
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)

# Define pins
LEFT_MOTOR = 18
RIGHT_MOTOR = 23
LEFT_DIR = 24    # Direction control
RIGHT_DIR = 25

# Setup
GPIO.setup([LEFT_MOTOR, RIGHT_MOTOR, LEFT_DIR, RIGHT_DIR], GPIO.OUT)

# Create PWM objects
left_pwm = GPIO.PWM(LEFT_MOTOR, 50)
right_pwm = GPIO.PWM(RIGHT_MOTOR, 50)

left_pwm.start(0)
right_pwm.start(0)

def move_forward(speed=75):
    """Move robot forward at given speed."""
    GPIO.output(LEFT_DIR, GPIO.HIGH)
    GPIO.output(RIGHT_DIR, GPIO.HIGH)
    left_pwm.ChangeDutyCycle(speed)
    right_pwm.ChangeDutyCycle(speed)
    print(f"Moving forward at {speed}%")

def move_backward(speed=75):
    """Move robot backward."""
    GPIO.output(LEFT_DIR, GPIO.LOW)
    GPIO.output(RIGHT_DIR, GPIO.LOW)
    left_pwm.ChangeDutyCycle(speed)
    right_pwm.ChangeDutyCycle(speed)
    print(f"Moving backward at {speed}%")

def turn_left(speed=75):
    """Turn robot left."""
    GPIO.output(LEFT_DIR, GPIO.LOW)
    GPIO.output(RIGHT_DIR, GPIO.HIGH)
    left_pwm.ChangeDutyCycle(speed)
    right_pwm.ChangeDutyCycle(speed)
    print("Turning left")

def turn_right(speed=75):
    """Turn robot right."""
    GPIO.output(LEFT_DIR, GPIO.HIGH)
    GPIO.output(RIGHT_DIR, GPIO.LOW)
    left_pwm.ChangeDutyCycle(speed)
    right_pwm.ChangeDutyCycle(speed)
    print("Turning right")

def stop():
    """Stop all motors."""
    left_pwm.ChangeDutyCycle(0)
    right_pwm.ChangeDutyCycle(0)
    print("Stopped")

try:
    # Test movements
    move_forward(100)
    time.sleep(2)

    turn_right(75)
    time.sleep(1)

    move_forward(50)
    time.sleep(2)

    stop()

except KeyboardInterrupt:
    stop()
finally:
    left_pwm.stop()
    right_pwm.stop()
    GPIO.cleanup()
```

## Reading Sensors

### Reading a Digital Sensor (Button/Switch)

```python
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)

SENSOR_PIN = 17
GPIO.setup(SENSOR_PIN, GPIO.IN)

print("Waiting for sensor input...")

try:
    while True:
        if GPIO.input(SENSOR_PIN) == GPIO.HIGH:
            print("Sensor triggered!")
            time.sleep(0.5)  # Debounce
        else:
            print("No signal")
        time.sleep(0.1)

except KeyboardInterrupt:
    pass
finally:
    GPIO.cleanup()
```

### Reading an Analog Sensor

```python
import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn

# I2C setup
i2c = busio.I2C(board.SCL, board.SDA)
ads = ADS.ADS1115(i2c)

# Create analog input channel (pin A0)
channel = AnalogIn(ads, ADS.P0)

print("Reading analog sensor...")

while True:
    voltage = channel.voltage
    value = channel.value
    print(f"Raw: {value}, Voltage: {voltage:.2f}V")
    time.sleep(0.5)
```

## Complete Robot Example: Line Follower

```python
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)

# Motor pins
LEFT_MOTOR = 18
RIGHT_MOTOR = 23
LEFT_DIR = 24
RIGHT_DIR = 25

# Sensor pins
LEFT_SENSOR = 27
RIGHT_SENSOR = 22

# Setup
GPIO.setup([LEFT_MOTOR, RIGHT_MOTOR, LEFT_DIR, RIGHT_DIR], GPIO.OUT)
GPIO.setup([LEFT_SENSOR, RIGHT_SENSOR], GPIO.IN)

left_pwm = GPIO.PWM(LEFT_MOTOR, 50)
right_pwm = GPIO.PWM(RIGHT_MOTOR, 50)
left_pwm.start(0)
right_pwm.start(0)

def forward(speed=75):
    GPIO.output(LEFT_DIR, GPIO.HIGH)
    GPIO.output(RIGHT_DIR, GPIO.HIGH)
    left_pwm.ChangeDutyCycle(speed)
    right_pwm.ChangeDutyCycle(speed)

def turn_left(speed=75):
    GPIO.output(LEFT_DIR, GPIO.LOW)
    GPIO.output(RIGHT_DIR, GPIO.HIGH)
    left_pwm.ChangeDutyCycle(speed)
    right_pwm.ChangeDutyCycle(speed)

def turn_right(speed=75):
    GPIO.output(LEFT_DIR, GPIO.HIGH)
    GPIO.output(RIGHT_DIR, GPIO.LOW)
    left_pwm.ChangeDutyCycle(speed)
    right_pwm.ChangeDutyCycle(speed)

def stop():
    left_pwm.ChangeDutyCycle(0)
    right_pwm.ChangeDutyCycle(0)

try:
    print("Starting line follower...")

    while True:
        left = GPIO.input(LEFT_SENSOR)
        right = GPIO.input(RIGHT_SENSOR)

        if left == 0 and right == 0:  # Both on line
            forward(75)
        elif left == 1 and right == 0:  # Drifting right
            turn_left(75)
        elif left == 0 and right == 1:  # Drifting left
            turn_right(75)
        else:  # Lost the line
            forward(50)  # Slow search

        time.sleep(0.05)

except KeyboardInterrupt:
    print("Stopped!")
finally:
    stop()
    left_pwm.stop()
    right_pwm.stop()
    GPIO.cleanup()
```

## Organizing Robot Code

Use classes for cleaner code:

```python
import RPi.GPIO as GPIO
import time

class Robot:
    def __init__(self, left_motor=18, right_motor=23,
                 left_dir=24, right_dir=25):
        self.left_motor = left_motor
        self.right_motor = right_motor
        self.left_dir = left_dir
        self.right_dir = right_dir

        GPIO.setmode(GPIO.BCM)
        GPIO.setup([left_motor, right_motor, left_dir, right_dir], GPIO.OUT)

        self.left_pwm = GPIO.PWM(left_motor, 50)
        self.right_pwm = GPIO.PWM(right_motor, 50)
        self.left_pwm.start(0)
        self.right_pwm.start(0)

    def move_forward(self, speed=75):
        GPIO.output(self.left_dir, GPIO.HIGH)
        GPIO.output(self.right_dir, GPIO.HIGH)
        self.left_pwm.ChangeDutyCycle(speed)
        self.right_pwm.ChangeDutyCycle(speed)

    def turn_left(self, speed=75):
        GPIO.output(self.left_dir, GPIO.LOW)
        GPIO.output(self.right_dir, GPIO.HIGH)
        self.left_pwm.ChangeDutyCycle(speed)
        self.right_pwm.ChangeDutyCycle(speed)

    def stop(self):
        self.left_pwm.ChangeDutyCycle(0)
        self.right_pwm.ChangeDutyCycle(0)

    def cleanup(self):
        self.left_pwm.stop()
        self.right_pwm.stop()
        GPIO.cleanup()

# Use it
robot = Robot()
robot.move_forward(75)
time.sleep(2)
robot.turn_left()
time.sleep(1)
robot.stop()
robot.cleanup()
```

## Challenge Project

### Build an Interactive Robot Controller

Create a program that reads keyboard input and controls the robot in real-time.

```python
from robot import Robot
import time
import sys

def main():
    robot = Robot()

    print("Robot Control - Press keys:")
    print("  W = Forward")
    print("  S = Backward")
    print("  A = Turn Left")
    print("  D = Turn Right")
    print("  Space = Stop")
    print("  Q = Quit")

    try:
        while True:
            command = input("> ").strip().upper()

            if command == 'W':
                robot.move_forward(75)
            elif command == 'S':
                robot.move_backward(75)
            elif command == 'A':
                robot.turn_left(75)
            elif command == 'D':
                robot.turn_right(75)
            elif command == ' ':
                robot.stop()
            elif command == 'Q':
                break

            time.sleep(0.1)

    finally:
        robot.stop()
        robot.cleanup()

if __name__ == "__main__":
    main()
```

## Key Takeaways

✅ GPIO pins connect sensors and motors to Raspberry Pi
✅ PWM controls motor speed
✅ Read sensors to make robot decisions
✅ Classes organize robot code
✅ Loops keep robot responsive

## Resources & Further Reading

- [Raspberry Pi GPIO Documentation](https://www.raspberrypi.org/documentation/usage/gpio/)
- [RPi.GPIO Python Library](https://sourceforge.net/projects/raspberry-gpio-python/)
- [Adafruit Motor Library](https://learn.adafruit.com/adafruit-dc-and-stepper-motor-hat-for-raspberry-pi)

---

**Next Lesson:** [Lesson 2.3: Loops, Conditionals & Logic →](/docs/module-2-programming/lesson-2-3-logic-loops)
