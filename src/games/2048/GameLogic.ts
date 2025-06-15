export type Grid = number[][];
export type Direction = 'up' | 'down' | 'left' | 'right';

export const GRID_SIZE = 4;

export function initializeGrid(): Grid {
  const grid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
  addRandomTile(grid);
  addRandomTile(grid);
  return grid;
}

export function addRandomTile(grid: Grid): void {
  const emptyCells: [number, number][] = [];
  
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        emptyCells.push([row, col]);
      }
    }
  }

  if (emptyCells.length > 0) {
    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[row][col] = Math.random() < 0.9 ? 2 : 4;
  }
}

export function moveTiles(grid: Grid, direction: Direction): { grid: Grid, score: number } {
  const newGrid = JSON.parse(JSON.stringify(grid));
  let score = 0;

  // Process grid based on direction
  for (let i = 0; i < GRID_SIZE; i++) {
    let rowOrCol = [];
    
    // Extract row or column based on direction
    if (direction === 'left' || direction === 'right') {
      rowOrCol = [...newGrid[i]];
    } else {
      for (let j = 0; j < GRID_SIZE; j++) {
        rowOrCol.push(newGrid[j][i]);
      }
    }

    // Reverse if needed for processing
    if (direction === 'right' || direction === 'down') {
      rowOrCol.reverse();
    }

    // Process tiles (remove zeros, merge, fill zeros)
    const processed = processLine(rowOrCol);
    score += processed.score;

    // Reverse back if needed
    if (direction === 'right' || direction === 'down') {
      processed.line.reverse();
    }

    // Put back into grid
    if (direction === 'left' || direction === 'right') {
      newGrid[i] = processed.line;
    } else {
      for (let j = 0; j < GRID_SIZE; j++) {
        newGrid[j][i] = processed.line[j];
      }
    }
  }

  return { grid: newGrid, score };
}

function processLine(line: number[]): { line: number[], score: number } {
  let score = 0;
  const nonZeros = line.filter(val => val !== 0);
  const result: number[] = [];

  for (let i = 0; i < nonZeros.length; i++) {
    if (i < nonZeros.length - 1 && nonZeros[i] === nonZeros[i + 1]) {
      result.push(nonZeros[i] * 2);
      score += nonZeros[i] * 2;
      i++;
    } else {
      result.push(nonZeros[i]);
    }
  }

  while (result.length < GRID_SIZE) {
    result.push(0);
  }

  return { line: result, score };
}

export function isGameOver(grid: Grid): boolean {
  // Check for any empty cells
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === 0) {
        return false;
      }
    }
  }

  // Check for possible merges
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const current = grid[row][col];
      
      // Check right neighbor
      if (col < GRID_SIZE - 1 && grid[row][col + 1] === current) {
        return false;
      }
      
      // Check bottom neighbor
      if (row < GRID_SIZE - 1 && grid[row + 1][col] === current) {
        return false;
      }
    }
  }

  return true;
}

export function hasWon(grid: Grid): boolean {
  return grid.some(row => row.some(cell => cell === 2048));
}
