export type Difficulty = 'easy' | 'medium' | 'hard';

export type CellState = {
  value: number; // 0 means empty
  isFixed: boolean; // true if it's a pre-filled cell
  isValid: boolean; // true if the current value doesn't conflict
  notes: number[]; // pencil marks
};

export type Board = CellState[][];

export type GameState = {
  board: Board;
  solution: number[][];
  difficulty: Difficulty;
  mistakes: number;
  maxMistakes: number;
  isComplete: boolean;
  startTime: number;
  elapsedTime: number;
  hintsUsed: number;
};

export interface GameSettings {
  difficulty: Difficulty;
  maxMistakes: number;
  showTimer: boolean;
  highlightConflicts: boolean;
}

export const DEFAULT_SETTINGS: GameSettings = {
  difficulty: 'medium',
  maxMistakes: 3,
  showTimer: true,
  highlightConflicts: true,
};

// Get number of cells to remove based on difficulty
function getCellsToRemove(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy':
      return 35; // 46 cells filled
    case 'medium':
      return 45; // 36 cells filled
    case 'hard':
      return 55; // 26 cells filled
    default:
      return 45;
  }
}

// Create an empty board
function createEmptyBoard(): number[][] {
  return Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));
}

// Check if a number can be placed at a position
function isValidPlacement(
  board: number[][],
  row: number,
  col: number,
  num: number
): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check column
  for (let y = 0; y < 9; y++) {
    if (board[y][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let y = boxRow; y < boxRow + 3; y++) {
    for (let x = boxCol; x < boxCol + 3; x++) {
      if (board[y][x] === num) return false;
    }
  }

  return true;
}

// Shuffle an array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Solve Sudoku using backtracking
function solveSudoku(board: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of numbers) {
          if (isValidPlacement(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
              return true;
            }
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Generate a complete valid Sudoku solution
function generateSolution(): number[][] {
  const board = createEmptyBoard();
  solveSudoku(board);
  return board;
}

// Count the number of solutions (for checking uniqueness)
function countSolutions(board: number[][], limit: number = 2): number {
  let count = 0;

  function solve(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(board, row, col, num)) {
              board[row][col] = num;
              if (solve()) {
                board[row][col] = 0;
                if (count >= limit) return true;
              } else {
                board[row][col] = 0;
              }
            }
          }
          return false;
        }
      }
    }
    count++;
    return count >= limit;
  }

  solve();
  return count;
}

// Generate a puzzle with a unique solution
function generatePuzzle(
  solution: number[][],
  difficulty: Difficulty
): number[][] {
  const puzzle = solution.map(row => [...row]);
  const cellsToRemove = getCellsToRemove(difficulty);

  // Get all cell positions and shuffle them
  const positions: [number, number][] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push([row, col]);
    }
  }
  const shuffledPositions = shuffleArray(positions);

  let removed = 0;
  for (const [row, col] of shuffledPositions) {
    if (removed >= cellsToRemove) break;

    const backup = puzzle[row][col];
    puzzle[row][col] = 0;

    // Check if the puzzle still has a unique solution
    const testBoard = puzzle.map(r => [...r]);
    if (countSolutions(testBoard, 2) !== 1) {
      puzzle[row][col] = backup; // Restore if not unique
    } else {
      removed++;
    }
  }

  return puzzle;
}

// Convert number board to CellState board
function createCellBoard(puzzle: number[][]): Board {
  return puzzle.map(row =>
    row.map(value => ({
      value,
      isFixed: value !== 0,
      isValid: true,
      notes: [],
    }))
  );
}

// Initialize a new game
export function initGame(difficulty: Difficulty): GameState {
  const solution = generateSolution();
  const puzzle = generatePuzzle(solution, difficulty);
  const board = createCellBoard(puzzle);

  return {
    board,
    solution,
    difficulty,
    mistakes: 0,
    maxMistakes: 3,
    isComplete: false,
    startTime: Date.now(),
    elapsedTime: 0,
    hintsUsed: 0,
  };
}

// Validate a single cell against the board
export function validateCell(
  board: Board,
  row: number,
  col: number,
  value: number
): boolean {
  if (value === 0) return true;

  // Check row
  for (let x = 0; x < 9; x++) {
    if (x !== col && board[row][x].value === value) return false;
  }

  // Check column
  for (let y = 0; y < 9; y++) {
    if (y !== row && board[y][col].value === value) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let y = boxRow; y < boxRow + 3; y++) {
    for (let x = boxCol; x < boxCol + 3; x++) {
      if ((y !== row || x !== col) && board[y][x].value === value) {
        return false;
      }
    }
  }

  return true;
}

// Update all cell validations
export function updateValidations(board: Board): Board {
  return board.map((row, rowIndex) =>
    row.map((cell, colIndex) => ({
      ...cell,
      isValid:
        cell.value === 0 || validateCell(board, rowIndex, colIndex, cell.value),
    }))
  );
}

// Set a cell value
export function setCellValue(
  state: GameState,
  row: number,
  col: number,
  value: number
): GameState {
  if (state.board[row][col].isFixed) return state;

  const newBoard = state.board.map(r => r.map(c => ({ ...c })));
  const isCorrect = value === 0 || value === state.solution[row][col];

  newBoard[row][col] = {
    ...newBoard[row][col],
    value,
    isValid: isCorrect,
    notes: [],
  };

  // Check for completion
  const isComplete = checkCompletion(newBoard);

  return {
    ...state,
    board: newBoard,
    mistakes: isCorrect ? state.mistakes : state.mistakes + 1,
    isComplete,
  };
}

// Toggle a note in a cell
export function toggleNote(
  state: GameState,
  row: number,
  col: number,
  note: number
): GameState {
  if (state.board[row][col].isFixed) return state;
  if (state.board[row][col].value !== 0) return state;

  const newBoard = state.board.map(r => r.map(c => ({ ...c })));
  const currentNotes = newBoard[row][col].notes;
  const newNotes = currentNotes.includes(note)
    ? currentNotes.filter(n => n !== note)
    : [...currentNotes, note].sort();

  newBoard[row][col] = {
    ...newBoard[row][col],
    notes: newNotes,
  };

  return {
    ...state,
    board: newBoard,
  };
}

// Check if the puzzle is complete and correct
export function checkCompletion(board: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col].value === 0) return false;
      if (!board[row][col].isValid) return false;
    }
  }
  return true;
}

// Get a hint for a specific cell
export function getHint(state: GameState, row: number, col: number): GameState {
  if (state.board[row][col].isFixed) return state;
  if (state.board[row][col].value === state.solution[row][col]) return state;

  const newBoard = state.board.map(r => r.map(c => ({ ...c })));
  newBoard[row][col] = {
    value: state.solution[row][col],
    isFixed: false,
    isValid: true,
    notes: [],
  };

  const isComplete = checkCompletion(newBoard);

  return {
    ...state,
    board: newBoard,
    hintsUsed: state.hintsUsed + 1,
    isComplete,
  };
}

// Get all cells with the same value (for highlighting)
export function getRelatedCells(board: Board, value: number): [number, number][] {
  if (value === 0) return [];

  const cells: [number, number][] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col].value === value) {
        cells.push([row, col]);
      }
    }
  }
  return cells;
}

// Get cells in the same row, column, and box
export function getHighlightCells(row: number, col: number): [number, number][] {
  const cells: [number, number][] = [];

  // Same row
  for (let x = 0; x < 9; x++) {
    cells.push([row, x]);
  }

  // Same column
  for (let y = 0; y < 9; y++) {
    cells.push([y, col]);
  }

  // Same box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let y = boxRow; y < boxRow + 3; y++) {
    for (let x = boxCol; x < boxCol + 3; x++) {
      cells.push([y, x]);
    }
  }

  // Remove duplicates
  const unique = new Set(cells.map(([r, c]) => `${r},${c}`));
  return Array.from(unique).map(s => {
    const [r, c] = s.split(',').map(Number);
    return [r, c];
  });
}

// Format time as MM:SS
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Auto-notes: fill notes for all empty cells
export function autoNotes(state: GameState): GameState {
  const newBoard = state.board.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      if (cell.value !== 0) return cell;

      const possibleNotes: number[] = [];
      for (let num = 1; num <= 9; num++) {
        if (validateCell(state.board, rowIndex, colIndex, num)) {
          possibleNotes.push(num);
        }
      }

      return {
        ...cell,
        notes: possibleNotes,
      };
    })
  );

  return {
    ...state,
    board: newBoard,
  };
}
