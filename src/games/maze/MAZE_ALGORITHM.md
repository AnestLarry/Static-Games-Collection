# Maze Generation Algorithm

This document explains the maze generation algorithm used in this game, ensuring that every generated maze is solvable and has exactly one unique solution.

## Overview

The maze is generated using the **Recursive Backtracking** algorithm, which is based on **Depth-First Search (DFS)**. This algorithm guarantees that:

1. Every generated maze has exactly **one unique solution**
2. Every cell is **reachable** from any other cell
3. The maze is a **perfect maze** (no loops, no isolated areas)

## Algorithm: Recursive Backtracking (DFS)

### Concept

Recursive backtracking creates a maze by "carving" paths through a grid that is initially filled with walls. The algorithm explores the grid systematically, always moving to unvisited cells and removing walls as it goes.

### Step-by-Step Process

```
1. Start with a grid where ALL cells are walls
   
   ███████████
   ███████████
   ███████████
   ███████████
   ███████████

2. Choose a starting cell (typically top-left corner)
   Mark it as a PATH and add to stack
   
   ███████████
   █ P ████████
   ███████████
   ███████████
   ███████████
   
   (P = Player/Start position)

3. While stack is not empty:
   a. Look at the current cell
   b. Find all UNVISITED neighbors (2 cells away)
   c. If neighbors exist:
      - Pick a RANDOM neighbor
      - Remove the wall between current and neighbor
      - Mark the neighbor as visited
      - Push neighbor onto stack
   d. If no unvisited neighbors:
      - Pop from stack (backtrack)

4. Continue until stack is empty
   (All reachable cells have been visited)

5. Set start and end positions
```

### Visual Example

**Initial State (5x5 grid simplified):**
```
███████████
███████████
███████████
███████████
███████████
```

**Step 1: Start at (1,1)**
```
███████████
█ P ███████
███████████
███████████
███████████
```

**Step 2: Carve to random neighbor**
```
███████████
█ P █   ███
█████ █████
███████████
███████████
```

**Step 3: Continue carving...**
```
███████████
█ P █   ███
█ ███ █ ███
█     █ ███
███████████
```

**Step 4: Backtrack when stuck, then continue**
```
███████████
█ P █   ███
█ ███ █ ███
█     █ ███
█████ ███ E
```

**Final Maze (with Start and End):**
```
███████████
█ S █   ███
█ ███ █ ███
█     █ ███
█████ ███ E
```

### Why It Guarantees a Solution

1. **Connected Graph**: The algorithm creates a spanning tree of the maze cells, meaning every path cell is connected to every other path cell.

2. **No Dead Ends Without Purpose**: Every dead end in the maze is intentional - it's where the algorithm had to backtrack.

3. **Single Solution**: Because the algorithm creates a tree structure (no cycles), there is exactly one path between any two points - specifically between start and end.

## Solution Finder: BFS (Breadth-First Search)

While DFS is used for generation, we use **BFS** to find the solution path because:

- BFS finds the **shortest path** between start and end
- BFS is more memory-efficient for pathfinding in mazes
- BFS guarantees finding a solution if one exists

### BFS Algorithm

```
1. Initialize a queue with the start position
2. While queue is not empty:
   a. Dequeue the front position
   b. If this is the end position, reconstruct path
   c. For each valid neighbor (up, down, left, right):
      - If not visited and not a wall:
        - Mark as visited
        - Record parent for path reconstruction
        - Enqueue neighbor
3. Return the path from start to end
```

## Complexity Analysis

### Time Complexity

| Operation | Complexity |
|-----------|------------|
| Maze Generation | O(n²) where n is maze dimension |
| Solution Finding | O(n²) worst case |
| Player Movement | O(1) |

### Space Complexity

| Storage | Complexity |
|---------|------------|
| Maze Grid | O(n²) |
| Visited Array | O(n²) |
| Stack/Queue | O(n²) worst case |

## Difficulty Settings

The maze size varies based on difficulty:

| Difficulty | Grid Size | Approx. Paths |
|------------|-----------|---------------|
| Easy | 11 × 11 | 36 cells |
| Medium | 21 × 21 | 121 cells |
| Hard | 31 × 31 | 256 cells |

**Note**: Grid sizes are always odd numbers to ensure proper wall/path alternation.

## Key Properties of Generated Mazes

1. **Perfect Maze**: No loops, exactly one path between any two points
2. **Biconnected**: Removing any single wall won't create a cycle
3. **Uniform Random**: All perfect mazes of the same size are equally likely
4. **Long Corridors**: DFS tends to create long winding corridors rather than many short branches

## Implementation Notes

### Wall Removal Logic

When moving between two cells that are 2 units apart:
```
Current Cell (row, col)
Target Cell (row ± 2, col) or (row, col ± 2)
Wall to Remove (row ± 1, col) or (row, col ± 1)
```

### Boundary Handling

- Outer perimeter is always walls
- Start position: (1, 1) - guaranteed to be valid
- End position: (size-2, size-2) - guaranteed to be reachable

## References

- [Maze Generation Algorithms - Wikipedia](https://en.wikipedia.org/wiki/Maze_generation_algorithm)
- [Depth-First Search - Wikipedia](https://en.wikipedia.org/wiki/Depth-first_search)
- [Breadth-First Search - Wikipedia](https://en.wikipedia.org/wiki/Breadth-first_search)

---

*This algorithm ensures that every game is fair, solvable, and provides an enjoyable puzzle experience.*
