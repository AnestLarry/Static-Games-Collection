export type Difficulty = 'easy' | 'medium' | 'hard';

export type CellType = 'wall' | 'path' | 'start' | 'end' | 'visited' | 'player' | 'solution';

export interface Position {
  row: number;
  col: number;
}

export interface MazeState {
  maze: CellType[][];
  playerPos: Position;
  startPos: Position;
  endPos: Position;
  size: number;
  difficulty: Difficulty;
  moves: number;
  startTime: number;
  elapsedTime: number;
  isComplete: boolean;
  showSolution: boolean;
  solutionPath: Position[];
}

export interface GameSettings {
  difficulty: Difficulty;
  showTimer: boolean;
  showMoves: boolean;
}

export const DEFAULT_SETTINGS: GameSettings = {
  difficulty: 'medium',
  showTimer: true,
  showMoves: true,
};

// Get maze size based on difficulty
function getMazeSize(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy':
      return 11; // 11x11 grid
    case 'medium':
      return 21; // 21x21 grid
    case 'hard':
      return 31; // 31x31 grid
    default:
      return 21;
  }
}

// Get cell size hint based on difficulty (for rendering)
export function getCellSizeHint(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'easy':
      return 'clamp(16px, 4vw, 28px)';
    case 'medium':
      return 'clamp(12px, 3vw, 20px)';
    case 'hard':
      return 'clamp(8px, 2vw, 14px)';
    default:
      return 'clamp(12px, 3vw, 20px)';
  }
}

// Create a maze filled with walls
function createEmptyMaze(size: number): CellType[][] {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill('wall'));
}

// Check if a position is valid (within bounds and not visited)
function isValidCell(
  maze: CellType[][],
  row: number,
  col: number,
  visited: boolean[][]
): boolean {
  const size = maze.length;
  return (
    row > 0 && row < size - 1 &&
    col > 0 && col < size - 1 &&
    !visited[row][col]
  );
}

// Get unvisited neighbors (2 cells away to maintain walls between paths)
function getUnvisitedNeighbors(
  maze: CellType[][],
  row: number,
  col: number,
  visited: boolean[][]
): Position[] {
  const neighbors: Position[] = [];
  const directions = [
    { dr: -2, dc: 0 }, // Up
    { dr: 2, dc: 0 },  // Down
    { dr: 0, dc: -2 }, // Left
    { dr: 0, dc: 2 },  // Right
  ];

  for (const { dr, dc } of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    if (isValidCell(maze, newRow, newCol, visited)) {
      neighbors.push({ row: newRow, col: newCol });
    }
  }

  return neighbors;
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate maze using Recursive Backtracking (Depth-First Search)
 * 
 * Algorithm:
 * 1. Start with a grid full of walls
 * 2. Pick a starting cell and mark it as a path
 * 3. Recursively visit neighbors:
 *    - Choose a random unvisited neighbor
 *    - Remove the wall between current cell and chosen neighbor
 *    - Move to the neighbor and repeat
 *    - If no unvisited neighbors, backtrack
 * 4. Continue until all cells are visited
 */
function generateMazeDFS(size: number): CellType[][] {
  const maze = createEmptyMaze(size);
  const visited: boolean[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(false));

  // Stack for backtracking
  const stack: Position[] = [];

  // Start from (1, 1) - top-left corner inside the border
  const startRow = 1;
  const startCol = 1;

  maze[startRow][startCol] = 'path';
  visited[startRow][startCol] = true;
  stack.push({ row: startRow, col: startCol });

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(maze, current.row, current.col, visited);

    if (neighbors.length === 0) {
      // No unvisited neighbors, backtrack
      stack.pop();
    } else {
      // Choose a random neighbor
      const next = shuffleArray(neighbors)[0];

      // Remove the wall between current and next
      const wallRow = current.row + (next.row - current.row) / 2;
      const wallCol = current.col + (next.col - current.col) / 2;

      maze[wallRow][wallCol] = 'path';
      maze[next.row][next.col] = 'path';

      visited[next.row][next.col] = true;
      visited[wallRow][wallCol] = true;

      stack.push(next);
    }
  }

  return maze;
}

// Find path using BFS (Breadth-First Search)
function findPath(
  maze: CellType[][],
  start: Position,
  end: Position
): Position[] {
  const size = maze.length;
  const visited: boolean[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(false));

  const parent: (Position | null)[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));

  const queue: Position[] = [start];
  visited[start.row][start.col] = true;

  const directions = [
    { dr: -1, dc: 0 }, // Up
    { dr: 1, dc: 0 },  // Down
    { dr: 0, dc: -1 }, // Left
    { dr: 0, dc: 1 },  // Right
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.row === end.row && current.col === end.col) {
      // Reconstruct path
      const path: Position[] = [];
      let pos: Position | null = current;

      while (pos !== null) {
        path.unshift(pos);
        pos = parent[pos.row][pos.col];
      }

      return path;
    }

    for (const { dr, dc } of directions) {
      const newRow = current.row + dr;
      const newCol = current.col + dc;

      if (
        newRow >= 0 && newRow < size &&
        newCol >= 0 && newCol < size &&
        !visited[newRow][newCol] &&
        (maze[newRow][newCol] === 'path' || maze[newRow][newCol] === 'end')
      ) {
        visited[newRow][newCol] = true;
        parent[newRow][newCol] = current;
        queue.push({ row: newRow, col: newCol });
      }
    }
  }

  return []; // No path found (should never happen with proper maze generation)
}

// Initialize a new game
export function initGame(difficulty: Difficulty): MazeState {
  const size = getMazeSize(difficulty);
  const maze = generateMazeDFS(size);

  // Set start position (top-left area)
  const startPos: Position = { row: 1, col: 1 };
  maze[startPos.row][startPos.col] = 'start';

  // Set end position (bottom-right area)
  const endPos: Position = { row: size - 2, col: size - 2 };
  maze[endPos.row][endPos.col] = 'end';

  // Find solution path
  const solutionPath = findPath(maze, startPos, endPos);

  return {
    maze,
    playerPos: { ...startPos },
    startPos,
    endPos,
    size,
    difficulty,
    moves: 0,
    startTime: Date.now(),
    elapsedTime: 0,
    isComplete: false,
    showSolution: false,
    solutionPath,
  };
}

// Move player in a direction
export function movePlayer(
  state: MazeState,
  direction: 'up' | 'down' | 'left' | 'right'
): MazeState {
  if (state.isComplete) return state;

  const { maze, playerPos } = state;
  const directions = {
    up: { dr: -1, dc: 0 },
    down: { dr: 1, dc: 0 },
    left: { dr: 0, dc: -1 },
    right: { dr: 0, dc: 1 },
  };

  const { dr, dc } = directions[direction];
  const newRow = playerPos.row + dr;
  const newCol = playerPos.col + dc;

  // Check if move is valid (within bounds and not a wall)
  if (
    newRow >= 0 && newRow < state.size &&
    newCol >= 0 && newCol < state.size &&
    maze[newRow][newCol] !== 'wall'
  ) {
    // Check if reached the end
    const isComplete = newRow === state.endPos.row && newCol === state.endPos.col;

    // Update maze visualization
    const newMaze = state.maze.map(row => [...row]);

    // Mark previous position as visited (if not start)
    if (playerPos.row !== state.startPos.row || playerPos.col !== state.startPos.col) {
      newMaze[playerPos.row][playerPos.col] = 'visited';
    } else {
      newMaze[playerPos.row][playerPos.col] = 'start';
    }

    // Mark new position
    if (isComplete) {
      newMaze[newRow][newCol] = 'end';
    } else {
      newMaze[newRow][newCol] = 'player';
    }

    return {
      ...state,
      maze: newMaze,
      playerPos: { row: newRow, col: newCol },
      moves: state.moves + 1,
      isComplete,
    };
  }

  return state;
}

// Toggle solution visibility
export function toggleSolution(state: MazeState): MazeState {
  const newMaze = state.maze.map(row => [...row]);

  if (!state.showSolution) {
    // Show solution path
    for (const pos of state.solutionPath) {
      if (
        (pos.row !== state.playerPos.row || pos.col !== state.playerPos.col) &&
        (pos.row !== state.startPos.row || pos.col !== state.startPos.col) &&
        (pos.row !== state.endPos.row || pos.col !== state.endPos.col)
      ) {
        newMaze[pos.row][pos.col] = 'solution';
      }
    }
  } else {
    // Hide solution path
    for (const pos of state.solutionPath) {
      if (
        newMaze[pos.row][pos.col] === 'solution' ||
        newMaze[pos.row][pos.col] === 'visited'
      ) {
        newMaze[pos.row][pos.col] = 'path';
      }
    }
    // Restore player position
    newMaze[state.playerPos.row][state.playerPos.col] = 'player';
    newMaze[state.startPos.row][state.startPos.col] = 'start';
    newMaze[state.endPos.row][state.endPos.col] = 'end';
  }

  return {
    ...state,
    maze: newMaze,
    showSolution: !state.showSolution,
  };
}

// Format time as MM:SS
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Get optimal moves (minimum possible moves)
export function getOptimalMoves(state: MazeState): number {
  return state.solutionPath.length - 1;
}
