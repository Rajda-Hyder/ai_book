---
sidebar_position: 3
---

# Lesson 4.3: Multi-Robot Systems

## Learning Objectives

By the end of this lesson, you will:
- Understand multi-robot coordination challenges
- Implement robot communication
- Build swarm behaviors
- Handle robot conflicts
- Design distributed systems

## Why Multi-Robot Systems?

**Single robot limitations:**
- Limited by one battery
- Can only be in one place
- Single point of failure

**Multi-robot advantages:**
- Distributed sensing (see more)
- Parallel task execution (faster)
- Redundancy (one fails, others continue)
- Collaboration (accomplish more together)

```
Single Robot:              Multi-Robot:
┌─────────┐               ┌──┐  ┌──┐  ┌──┐
│ Robot A │  vs           │A │  │B │  │C │
│ Tasks:  │               └──┘  └──┘  └──┘
│ 1,2,3   │               Tasks: 1,2,3 (parallel)
└─────────┘
Time: 3 units             Time: 1 unit
```

## Robot Communication

### Direct Communication (Robots Talk)

```python
import socket
import json

class RobotNode:
    def __init__(self, robot_id, port):
        self.robot_id = robot_id
        self.port = port
        self.peers = {}  # Other robots
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    def send_message(self, peer_id, message):
        """Send message to another robot."""
        if peer_id in self.peers:
            try:
                data = {
                    'from': self.robot_id,
                    'type': message['type'],
                    'data': message['data']
                }

                peer_socket = self.peers[peer_id]
                peer_socket.send(json.dumps(data).encode())

                print(f"Robot {self.robot_id} → {peer_id}: {message['type']}")

            except Exception as e:
                print(f"Communication error: {e}")

    def receive_message(self):
        """Receive message from other robot."""
        try:
            data = self.socket.recv(1024).decode()
            message = json.loads(data)
            return message
        except:
            return None

# Example
robot_a = RobotNode(robot_id='A', port=5000)
robot_b = RobotNode(robot_id='B', port=5001)

# A tells B about obstacle
robot_a.send_message('B', {
    'type': 'OBSTACLE_WARNING',
    'data': {'location': [50, 50], 'size': 'large'}
})
```

### Message Types

```python
# Common message types in multi-robot systems

MESSAGE_TYPES = {
    'OBSTACLE_WARNING': 'Alert about obstacle',
    'POSITION_UPDATE': 'Share current position',
    'TASK_REQUEST': 'Ask for help with task',
    'TASK_COMPLETE': 'Completed assigned task',
    'NEED_ASSISTANCE': 'Request backup',
    'STAY_AWAY': 'Indicate area is occupied',
    'SYNC_REQUEST': 'Synchronize positions',
}
```

## Swarm Behaviors

### Boid Flocking (Simple Swarm)

Simulate bird flocking with three rules:

```python
import numpy as np
import matplotlib.pyplot as plt

class Boid:
    def __init__(self, x, y):
        self.position = np.array([x, y])
        self.velocity = np.array([np.random.uniform(-1, 1),
                                 np.random.uniform(-1, 1)])

    def separation(self, boids, perception=50):
        """Avoid crowding neighbors."""
        steering = np.array([0.0, 0.0])

        for boid in boids:
            distance = np.linalg.norm(self.position - boid.position)

            if 0 < distance < perception:
                # Move away from neighbor
                diff = self.position - boid.position
                diff = diff / distance
                steering += diff

        return steering

    def alignment(self, boids, perception=50):
        """Steer towards average heading of neighbors."""
        steering = np.array([0.0, 0.0])
        count = 0

        for boid in boids:
            distance = np.linalg.norm(self.position - boid.position)

            if 0 < distance < perception:
                steering += boid.velocity
                count += 1

        if count > 0:
            steering = steering / count
            steering = steering - self.velocity

        return steering

    def cohesion(self, boids, perception=50):
        """Steer towards center of mass of neighbors."""
        steering = np.array([0.0, 0.0])
        count = 0

        for boid in boids:
            distance = np.linalg.norm(self.position - boid.position)

            if 0 < distance < perception:
                steering += boid.position
                count += 1

        if count > 0:
            steering = steering / count
            steering = steering - self.position
            steering = (steering / np.linalg.norm(steering)) * 0.1

        return steering

    def update(self, boids, boundaries=(800, 800)):
        """Update boid position."""
        sep = self.separation(boids) * 1.5   # Weight: separation
        ali = self.alignment(boids) * 1.0    # Weight: alignment
        coh = self.cohesion(boids) * 1.0     # Weight: cohesion

        self.velocity += sep + ali + coh

        # Limit speed
        speed = np.linalg.norm(self.velocity)
        if speed > 4:
            self.velocity = (self.velocity / speed) * 4

        self.position += self.velocity

        # Wrap around edges
        self.position[0] = self.position[0] % boundaries[0]
        self.position[1] = self.position[1] % boundaries[1]

# Simulate swarm
swarm = [Boid(np.random.uniform(0, 800), np.random.uniform(0, 800))
         for _ in range(50)]

for step in range(200):
    for boid in swarm:
        boid.update(swarm)

    if step % 50 == 0:
        positions = np.array([boid.position for boid in swarm])
        print(f"Step {step}: Swarm at {positions.mean(axis=0)}")
```

### Formation Flying

Make robots maintain specific formation:

```python
class Formation:
    def __init__(self, robots, formation_type='line'):
        self.robots = robots
        self.formation_type = formation_type
        self.leader = robots[0]
        self.target_positions = self.calculate_formation()

    def calculate_formation(self):
        """Calculate target positions based on formation type."""
        positions = {}

        if self.formation_type == 'line':
            # Single line behind leader
            for i, robot in enumerate(self.robots):
                positions[robot.id] = (i * 2, 0)

        elif self.formation_type == 'wedge':
            # V-shaped formation
            for i, robot in enumerate(self.robots[1:], 1):
                positions[robot.id] = (i * 1.5, (i % 2) * 2 - 1)

        elif self.formation_type == 'circle':
            # Circle around leader
            n = len(self.robots)
            for i, robot in enumerate(self.robots[1:], 1):
                angle = 2 * np.pi * i / (n - 1)
                positions[robot.id] = (3 * np.cos(angle), 3 * np.sin(angle))

        return positions

    def get_target_for_robot(self, robot):
        """Get target position for specific robot."""
        if robot == self.leader:
            return robot.position

        # Target = leader position + offset
        offset = self.target_positions[robot.id]
        target = self.leader.position + np.array(offset)

        return target

    def update_all(self):
        """Update all robots to maintain formation."""
        for robot in self.robots:
            target = self.get_target_for_robot(robot)
            robot.move_towards(target)

# Use it
class Robot:
    def __init__(self, robot_id, x, y):
        self.id = robot_id
        self.position = np.array([x, y])

    def move_towards(self, target):
        direction = target - self.position
        if np.linalg.norm(direction) > 0.1:
            direction = direction / np.linalg.norm(direction)
            self.position += direction * 0.5

robots = [Robot(f'R{i}', i*2, 0) for i in range(5)]
formation = Formation(robots, formation_type='line')

for _ in range(50):
    formation.update_all()
```

## Distributed Task Allocation

Assign tasks among robots dynamically:

```python
class TaskQueue:
    def __init__(self):
        self.tasks = []
        self.assigned_tasks = {}

    def add_task(self, task_id, priority, difficulty):
        self.tasks.append({
            'id': task_id,
            'priority': priority,
            'difficulty': difficulty,
            'assigned': False
        })

    def allocate_tasks(self, robots):
        """Assign tasks to available robots."""
        # Sort by priority
        self.tasks.sort(key=lambda t: t['priority'], reverse=True)

        for task in self.tasks:
            if task['assigned']:
                continue

            # Find most suitable robot
            best_robot = None
            best_cost = float('inf')

            for robot in robots:
                if robot.available:
                    # Cost = how hard task is for this robot
                    cost = task['difficulty'] / robot.capability

                    if cost < best_cost:
                        best_cost = cost
                        best_robot = robot

            if best_robot:
                task['assigned'] = True
                best_robot.assign_task(task)
                self.assigned_tasks[task['id']] = best_robot.id

                print(f"Task {task['id']} assigned to {best_robot.id}")

# Use it
class Robot:
    def __init__(self, robot_id, capability=1.0):
        self.id = robot_id
        self.capability = capability
        self.available = True
        self.task = None

    def assign_task(self, task):
        self.task = task
        self.available = False

    def complete_task(self):
        print(f"{self.id} completed {self.task['id']}")
        self.task = None
        self.available = True

robots = [Robot('R1', 1.0), Robot('R2', 1.5), Robot('R3', 0.8)]
queue = TaskQueue()

queue.add_task('T1', priority=10, difficulty=2.0)
queue.add_task('T2', priority=5, difficulty=1.0)
queue.add_task('T3', priority=8, difficulty=3.0)

queue.allocate_tasks(robots)

# Simulate completing tasks
for robot in robots:
    if robot.task:
        robot.complete_task()
```

## Consensus and Coordination

All robots agree on shared goal:

```python
class ConsensusRobot:
    def __init__(self, robot_id, initial_position):
        self.id = robot_id
        self.position = initial_position
        self.consensus_position = initial_position
        self.neighbors = []  # Connected robots

    def receive_positions(self, neighbor_positions):
        """Get positions from neighbors."""
        # Average all positions (consensus)
        all_positions = [self.position] + neighbor_positions
        self.consensus_position = np.mean(all_positions, axis=0)

        return self.consensus_position

    def move_towards_consensus(self, step_size=0.1):
        """Move robot towards consensus."""
        direction = self.consensus_position - self.position
        if np.linalg.norm(direction) > 0.01:
            direction = direction / np.linalg.norm(direction)
            self.position += direction * step_size

# Simulate consensus algorithm
robots = [
    ConsensusRobot('R1', np.array([0.0, 0.0])),
    ConsensusRobot('R2', np.array([10.0, 0.0])),
    ConsensusRobot('R3', np.array([5.0, 8.66])),
]

# Connect all robots (fully connected network)
for robot in robots:
    robot.neighbors = [r for r in robots if r != robot]

print("Reaching consensus...")
for iteration in range(50):
    new_positions = []

    for robot in robots:
        neighbor_positions = [r.position for r in robot.neighbors]
        robot.receive_positions(neighbor_positions)
        robot.move_towards_consensus()
        new_positions.append(robot.position.copy())

    if iteration % 10 == 0:
        avg_pos = np.mean(new_positions, axis=0)
        print(f"Iteration {iteration}: Consensus near {avg_pos}")

print(f"Final consensus: {robots[0].consensus_position}")
```

## Collision Avoidance Between Robots

```python
class SafeRobot:
    def __init__(self, robot_id, x, y):
        self.id = robot_id
        self.position = np.array([x, y])
        self.velocity = np.array([0.0, 0.0])
        self.radius = 0.5

    def avoid_collision(self, other_robots):
        """Calculate avoidance velocity."""
        collision_vector = np.array([0.0, 0.0])

        for other in other_robots:
            distance = np.linalg.norm(self.position - other.position)

            # Minimum safe distance
            min_distance = self.radius + other.radius + 1.0

            if 0 < distance < min_distance:
                # Push away from other robot
                push = (self.position - other.position) / distance
                collision_vector += push

        return collision_vector

    def move(self, target, other_robots):
        """Move towards target while avoiding collisions."""
        # Direction to target
        target_vector = target - self.position
        if np.linalg.norm(target_vector) > 0.01:
            target_vector = target_vector / np.linalg.norm(target_vector)

        # Avoidance vector
        avoid_vector = self.avoid_collision(other_robots)

        # Combine (70% target, 30% avoidance)
        combined = 0.7 * target_vector + 0.3 * avoid_vector

        if np.linalg.norm(combined) > 0.01:
            combined = combined / np.linalg.norm(combined)

        self.position += combined * 0.5

# Test collision avoidance
robots = [
    SafeRobot('R1', 0, 0),
    SafeRobot('R2', 5, 5),
    SafeRobot('R3', 10, 0),
]

# Move towards goals while avoiding each other
goals = [np.array([10, 10]), np.array([0, 10]), np.array([5, 0])]

for step in range(100):
    for i, robot in enumerate(robots):
        other_robots = [r for r in robots if r != robot]
        robot.move(goals[i], other_robots)

print("Robots avoided collisions and reached goals!")
```

## Real Multi-Robot System Example

```python
class MultiRobotSystem:
    def __init__(self, num_robots=3):
        self.robots = [ConsensusRobot(f'R{i}',
                                      np.array([i*5.0, 0.0]))
                      for i in range(num_robots)]
        self.task_queue = TaskQueue()
        self.communication_network = {}

    def sense_environment(self):
        """All robots sense and share information."""
        for robot in self.robots:
            # Sense obstacles, goals, etc.
            robot.last_sense = {
                'position': robot.position,
                'obstacles': [],
                'timestamp': time.time()
            }

    def communicate(self):
        """Robots share sensed information."""
        positions = [r.position for r in self.robots]

        for robot in self.robots:
            neighbor_positions = positions.copy()
            neighbor_positions.remove(robot.position)
            robot.receive_positions(neighbor_positions)

    def coordinate(self):
        """Reach consensus on goals."""
        self.communicate()

        for robot in self.robots:
            robot.move_towards_consensus()

    def execute(self, duration=100):
        """Run system for given time."""
        for step in range(duration):
            self.sense_environment()
            self.coordinate()

            if step % 20 == 0:
                avg_pos = np.mean([r.position for r in self.robots], axis=0)
                print(f"Step {step}: System position {avg_pos}")

# Run it
system = MultiRobotSystem(3)
system.execute(100)
```

## Challenge Project

### Build a Search and Rescue Team

```python
class SearchRescueRobot(SafeRobot):
    def __init__(self, robot_id, x, y):
        super().__init__(robot_id, x, y)
        self.search_area = []
        self.victim_found = False

    def search_pattern(self, grid_size):
        """Generate grid search pattern."""
        pattern = []
        step = 2.0

        for y in np.arange(0, grid_size, step):
            for x in np.arange(0, grid_size, step):
                pattern.append(np.array([x, y]))

        return pattern

    def search_for_victim(self, victim_position):
        """Move through search pattern."""
        closest_point = min(self.search_area,
                           key=lambda p: np.linalg.norm(p - self.position))

        if np.linalg.norm(self.position - victim_position) < 1.0:
            self.victim_found = True
            return "VICTIM_FOUND"

        return closest_point

# Use it
searchers = [SearchRescueRobot(f'S{i}', i*5.0, 0) for i in range(3)]
victim_location = np.array([15, 8])

for robot in searchers:
    robot.search_area = robot.search_pattern(20)

for step in range(200):
    for robot in searchers:
        if not robot.victim_found:
            target = robot.search_for_victim(victim_location)
            others = [r for r in searchers if r != robot]
            robot.move(target, others)

print(f"Victim found by: {[r.id for r in searchers if r.victim_found]}")
```

## Key Challenges in Multi-Robot Systems

| Challenge | Solution |
|-----------|----------|
| **Communication latency** | Predictive models, assume failure |
| **Conflicting goals** | Consensus algorithms |
| **Collisions** | Local collision avoidance |
| **Task allocation** | Distributed decision-making |
| **Scalability** | Hierarchical organization |
| **Failures** | Redundancy, handoff protocols |

## Key Takeaways

✅ Multi-robot systems accomplish more than single robots
✅ Communication is critical for coordination
✅ Swarm behaviors emerge from simple local rules
✅ Distributed algorithms avoid single points of failure
✅ Collision avoidance enables safe cooperation

## Resources & Further Reading

- [Multi-Robot Systems (Wikipedia)](https://en.wikipedia.org/wiki/Multi-robot_system)
- [ROS Multi-Robot Navigation](http://wiki.ros.org/multirobot_navigation)
- [Swarm Robotics (Springer)](https://www.springer.com/series/8381)
- [Craig Reynolds' Boids](http://www.red3d.com/cwr/boids/)

---

**Congratulations!** You've completed the Physical AI & Humanoid Robotics Textbook! 🎉

### What's Next?

- Build your own robot
- Join a robotics competition
- Explore ROS (Robot Operating System)
- Contribute to open-source robotics projects
- Share your projects with the community

**Happy building! 🤖**
