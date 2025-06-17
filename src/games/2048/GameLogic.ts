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

export function moveTiles(grid: Grid, direction: Direction): { grid: Grid, score: number, mergedCells: [number, number][] } {
  const newGrid = JSON.parse(JSON.stringify(grid));
  let score = 0;
  const mergedCells: [number, number][] = [];

  // Process grid based on direction
  for (let i = 0; i < GRID_SIZE; i++) {
    let rowOrCol: number[] = [];
    const currentLineCoords: [number, number][] = [];
    
    // Extract row or column based on direction and store original coordinates
    if (direction === 'left' || direction === 'right') {
      rowOrCol = [...newGrid[i]];
      for (let k = 0; k < GRID_SIZE; k++) currentLineCoords.push([i, k]);
    } else {
      for (let j = 0; j < GRID_SIZE; j++) {
        rowOrCol.push(newGrid[j][i]);
        currentLineCoords.push([j, i]);
      }
    }

    // Reverse if needed for processing (and reverse coordinates accordingly)
    if (direction === 'right' || direction === 'down') {
      rowOrCol.reverse();
      currentLineCoords.reverse();
    }

    // Process tiles (remove zeros, merge, fill zeros)
    const processed = processLine(rowOrCol);
    score += processed.score;

    // Collect merged cell coordinates
    processed.mergedIndices.forEach(mergedIndex => {
      mergedCells.push(currentLineCoords[mergedIndex]);
    });

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

  return { grid: newGrid, score, mergedCells };
}

function processLine(line: number[]): { line: number[], score: number, mergedIndices: number[] } {
  let score = 0;
  const nonZeros = line.filter(val => val !== 0);
  const result: number[] = [];
  const mergedIndices: number[] = [];
  let resultIndex = 0;

  for (let i = 0; i < nonZeros.length; i++) {
    if (i < nonZeros.length - 1 && nonZeros[i] === nonZeros[i + 1]) {
      const mergedValue = nonZeros[i] * 2;
      result.push(mergedValue);
      score += mergedValue;
      // Find original index in the 'line' array for the merged tile position
      // This is tricky because 'result' array has different indexing due to merges and zero removal.
      // We need to map the position in 'result' back to 'line' considering the direction of processing.
      // The `mergedIndices` should refer to the position in the `result` array after merges.
      mergedIndices.push(resultIndex);
      i++; // Skip next element as it's merged
    } else {
      result.push(nonZeros[i]);
    }
    resultIndex++;
  }

  while (result.length < GRID_SIZE) {
    result.push(0);
  }

  return { line: result, score, mergedIndices };
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
