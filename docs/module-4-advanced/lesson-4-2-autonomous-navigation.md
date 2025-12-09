---
sidebar_position: 2
---

# Lesson 4.2: Autonomous Navigation

## Learning Objectives

By the end of this lesson, you will:
- Understand path planning algorithms
- Implement A* (A-Star) pathfinding
- Handle dynamic obstacles
- Build a real robot navigator
- Know when to use different approaches

## The Navigation Problem

**Goal:** Move from A → B without hitting obstacles

```
START ─┐
       │  Obstacle
       │  ██████
       └─→ GOAL
```

**Approaches:**
1. **Reactive:** Respond to obstacles (no planning)
2. **Deliberative:** Plan path, then follow it
3. **Hybrid:** Plan + react to new obstacles

## Grid-Based Path Planning

Divide environment into grid:

```
  0 1 2 3 4
0 S . . . .
1 . X X . .
2 . X . . .
3 . . . X .
4 . . . . G

S = Start
G = Goal
X = Obstacle
. = Free space
```

## Dijkstra's Algorithm (Simple)

Find shortest path, expanding outward:

```python
from collections import deque

class GridNavigator:
    def __init__(self, grid):
        """
        grid = 2D array (0=free, 1=obstacle)
        """
        self.grid = grid
        self.height = len(grid)
        self.width = len(grid[0])

    def dijkstra(self, start, goal):
        """Find shortest path using Dijkstra."""
        import heapq

        # Priority queue: (cost, position)
        queue = [(0, start)]
        visited = set()
        parent = {start: None}
        cost = {start: 0}

        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]  # Right, Down, Left, Up

        while queue:
            current_cost, current = heapq.heappop(queue)

            if current == goal:
                # Reconstruct path
                path = []
                node = goal
                while node is not None:
                    path.append(node)
                    node = parent[node]
                return path[::-1]

            if current in visited:
                continue

            visited.add(current)
            y, x = current

            # Try all directions
            for dy, dx in directions:
                ny, nx = y + dy, x + dx

                # Check bounds and obstacles
                if (0 <= ny < self.height and
                    0 <= nx < self.width and
                    self.grid[ny][nx] == 0 and
                    (ny, nx) not in visited):

                    new_cost = current_cost + 1

                    if (ny, nx) not in cost or new_cost < cost[(ny, nx)]:
                        cost[(ny, nx)] = new_cost
                        parent[(ny, nx)] = current
                        heapq.heappush(queue, (new_cost, (ny, nx)))

        return None  # No path found

# Test it
grid = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0],
]

nav = GridNavigator(grid)
path = nav.dijkstra((0, 0), (4, 4))
print(f"Path: {path}")
# Path: [(0, 0), (1, 0), (2, 0), (3, 0), (4, 0), (4, 1), (4, 2), (4, 3), (4, 4)]
```

## A* Algorithm (Smarter)

Like Dijkstra, but uses heuristic to guide search:

```python
def heuristic(pos, goal):
    """Manhattan distance heuristic."""
    return abs(pos[0] - goal[0]) + abs(pos[1] - goal[1])

class AStarNavigator:
    def __init__(self, grid):
        self.grid = grid
        self.height = len(grid)
        self.width = len(grid[0])

    def astar(self, start, goal):
        """A* pathfinding algorithm."""
        import heapq

        # Priority queue: (f_score, counter, position)
        # f_score = g_score + h_score
        counter = 0
        queue = [(0, counter, start)]
        counter += 1

        g_score = {start: 0}
        visited = set()
        parent = {start: None}

        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

        while queue:
            _, _, current = heapq.heappop(queue)

            if current == goal:
                # Reconstruct path
                path = []
                node = goal
                while node is not None:
                    path.append(node)
                    node = parent[node]
                return path[::-1]

            if current in visited:
                continue

            visited.add(current)
            y, x = current

            for dy, dx in directions:
                ny, nx = y + dy, x + dx

                if (0 <= ny < self.height and
                    0 <= nx < self.width and
                    self.grid[ny][nx] == 0 and
                    (ny, nx) not in visited):

                    tentative_g = g_score[current] + 1

                    if (ny, nx) not in g_score or tentative_g < g_score[(ny, nx)]:
                        parent[(ny, nx)] = current
                        g_score[(ny, nx)] = tentative_g

                        h_score = heuristic((ny, nx), goal)
                        f_score = tentative_g + h_score

                        heapq.heappush(queue, (f_score, counter, (ny, nx)))
                        counter += 1

        return None

# Test it
nav = AStarNavigator(grid)
path = nav.astar((0, 0), (4, 4))
print(f"A* Path: {path}")
```

## Potential Field Method (Continuous)

Treat environment as hills and valleys:

```python
import numpy as np
import matplotlib.pyplot as plt

class PotentialFieldNavigator:
    def __init__(self, grid_size=(10, 10)):
        self.grid_size = grid_size

    def compute_potential_field(self, goal, obstacles, attractive_gain=1.0, repulsive_gain=10.0):
        """Create potential field: goal attracts, obstacles repel."""
        height, width = self.grid_size
        field = np.zeros((height, width))

        for y in range(height):
            for x in range(width):
                # Attractive potential (goal)
                goal_dist = np.sqrt((x - goal[1])**2 + (y - goal[0])**2)
                attractive = attractive_gain * goal_dist**2

                # Repulsive potential (obstacles)
                repulsive = 0
                for obs in obstacles:
                    obs_dist = np.sqrt((x - obs[1])**2 + (y - obs[0])**2)
                    if obs_dist < 3:
                        repulsive += repulsive_gain / (obs_dist + 0.1)**2

                field[y, x] = attractive + repulsive

        return field

    def find_gradient(self, field, position):
        """Find direction of steepest descent."""
        y, x = position
        if y > 0 and y < field.shape[0]-1 and x > 0 and x < field.shape[1]-1:
            grad_y = field[y+1, x] - field[y-1, x]
            grad_x = field[y, x+1] - field[y, x-1]
            return -(grad_y, grad_x)  # Go downhill
        return (0, 0)

# Use it
nav = PotentialFieldNavigator((10, 10))
field = nav.compute_potential_field(
    goal=(9, 9),
    obstacles=[(3, 3), (3, 4), (3, 5), (6, 6)]
)

# Visualize
plt.figure(figsize=(8, 8))
plt.contourf(field, levels=20)
plt.colorbar()
plt.title('Potential Field')
plt.show()
```

## RRT* (Rapid Random Tree) - Advanced

Probabilistically explore space:

```python
import random
import math

class RRTStar:
    def __init__(self, grid, step_size=1.0):
        self.grid = grid
        self.step_size = step_size
        self.height = len(grid)
        self.width = len(grid[0])

    def distance(self, p1, p2):
        return math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2)

    def is_free(self, p1, p2):
        """Check if line between p1 and p2 is obstacle-free."""
        steps = int(self.distance(p1, p2))
        for i in range(steps):
            t = i / max(steps, 1)
            x = int(p1[0] * (1-t) + p2[0] * t)
            y = int(p1[1] * (1-t) + p2[1] * t)
            if x < 0 or x >= self.width or y < 0 or y >= self.height:
                return False
            if self.grid[y][x] == 1:
                return False
        return True

    def plan(self, start, goal, max_iterations=5000):
        """Plan path using RRT*."""
        nodes = [start]
        parent = {start: None}

        for _ in range(max_iterations):
            # Random point
            rand_point = (random.uniform(0, self.height),
                         random.uniform(0, self.width))

            # Find nearest node
            nearest = min(nodes, key=lambda n: self.distance(n, rand_point))

            # Step toward random point
            direction = (rand_point[0] - nearest[0], rand_point[1] - nearest[1])
            dist = self.distance((0, 0), direction)
            if dist > 0:
                direction = (direction[0]/dist, direction[1]/dist)

            new_point = (nearest[0] + direction[0] * self.step_size,
                        nearest[1] + direction[1] * self.step_size)

            # Check if path is free
            if self.is_free(nearest, new_point):
                nodes.append(new_point)
                parent[new_point] = nearest

                # Check if we're close to goal
                if self.distance(new_point, goal) < self.step_size * 2:
                    parent[goal] = new_point

                    # Reconstruct path
                    path = [goal]
                    node = new_point
                    while node is not None:
                        path.append(node)
                        node = parent[node]
                    return path[::-1]

        return None
```

## Real Robot Navigator

```python
class AutonomousRobot:
    def __init__(self, grid, start, goal):
        self.navigator = AStarNavigator(grid)
        self.current_pos = start
        self.goal = goal
        self.path = self.navigator.astar(start, goal)
        self.path_index = 0

    def get_next_waypoint(self):
        """Get next position to move toward."""
        if self.path and self.path_index < len(self.path):
            waypoint = self.path[self.path_index]
            self.path_index += 1
            return waypoint
        return None

    def move_to_waypoint(self, waypoint, sensors):
        """Move robot toward waypoint."""
        if not waypoint:
            return "GOAL_REACHED"

        current_y, current_x = self.current_pos
        target_y, target_x = waypoint

        # Determine direction
        if target_x > current_x:
            action = "MOVE_RIGHT"
        elif target_x < current_x:
            action = "MOVE_LEFT"
        elif target_y > current_y:
            action = "MOVE_DOWN"
        elif target_y < current_y:
            action = "MOVE_UP"
        else:
            action = "NONE"

        # Check for unexpected obstacles (sensor data)
        if self.is_obstacle_detected(sensors):
            return "OBSTACLE_DETECTED - REPLANNING"

        self.current_pos = waypoint
        return action

    def is_obstacle_detected(self, sensors):
        """Check if sensors detect new obstacles."""
        distance_forward = sensors.get('distance', 100)
        return distance_forward < 20

    def replan(self, grid):
        """Replan path if obstacle detected."""
        self.path = self.navigator.astar(self.current_pos, self.goal)
        self.path_index = 0

# Use it
grid = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0],
]

robot = AutonomousRobot(grid, (0, 0), (4, 4))

# Execute plan
while True:
    waypoint = robot.get_next_waypoint()
    if not waypoint:
        print("Navigation complete!")
        break

    sensors = {'distance': 50}
    action = robot.move_to_waypoint(waypoint, sensors)
    print(f"Action: {action}, Position: {robot.current_pos}")
```

## Challenge Project

### Build a Dynamic Path Planner

```python
class DynamicRobot:
    def __init__(self, grid, start, goal):
        self.grid = grid
        self.start = start
        self.current = start
        self.goal = goal
        self.navigator = AStarNavigator(grid)
        self.path = self.navigator.astar(start, goal)

    def sense_and_plan(self, new_obstacles):
        """Update grid and replan if needed."""
        for obs in new_obstacles:
            y, x = obs
            if 0 <= y < len(self.grid) and 0 <= x < len(self.grid[0]):
                if self.grid[y][x] == 0:  # Was free
                    self.grid[y][x] = 1   # Now obstacle
                    print(f"New obstacle detected at {obs} - replanning...")

                    # Replan
                    self.path = self.navigator.astar(self.current, self.goal)

                    if not self.path:
                        print("ERROR: Goal unreachable!")
                    else:
                        print(f"New path length: {len(self.path)}")

    def move(self):
        """Move one step along path."""
        if self.path and len(self.path) > 1:
            self.current = self.path[1]
            self.path = self.path[1:]
            return self.current
        return None

# Use it
grid = [[0]*5 for _ in range(5)]
robot = DynamicRobot(grid, (0, 0), (4, 4))

# Obstacle appears
robot.sense_and_plan([(2, 2), (2, 3), (2, 4)])

# Continue moving
for _ in range(5):
    pos = robot.move()
    print(f"Moved to {pos}")
```

## Key Algorithms Comparison

| Algorithm | Pros | Cons | Best For |
|-----------|------|------|----------|
| **Dijkstra** | Optimal, complete | Slow for large spaces | Guaranteed solution |
| **A*** | Faster, optimal | Heuristic dependent | Most robotics apps |
| **RRT** | Good for high dimensions | Not optimal | Complex spaces |
| **Potential Field** | Simple, real-time | Local minima | Obstacle avoidance |

## Key Takeaways

✅ Grid-based planning for discrete spaces
✅ A* is most practical for robotics
✅ RRT explores complex spaces efficiently
✅ Replan when new obstacles appear
✅ Choose algorithm based on problem

## Resources & Further Reading

- [Motion Planning (Wikipedia)](https://en.wikipedia.org/wiki/Motion_planning)
- [ROS Navigation Stack](http://wiki.ros.org/navigation)
- [A* Visualization](https://www.redblobgames.com/pathfinding/a-star/introduction.html)

---

**Next Lesson:** [Lesson 4.3: Multi-Robot Systems →](/docs/module-4-advanced/lesson-4-3-multi-robot-systems)
