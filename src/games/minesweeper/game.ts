// Minesweeper Game Logic

export type CellState = 'hidden' | 'revealed' | 'flagged' | 'mine_revealed' | 'wrong_flag';

export interface Cell {
  isMine: boolean;
  state: CellState;
  adjacentMines: number; // Number of mines in adjacent cells
  row: number;
  col: number;
}

export type Board = Cell[][];

export interface GameSettings {
  rows: number;
  cols: number;
  mines: number;
}

export interface GameState {
  board: Board;
  status: 'playing' | 'won' | 'lost';
  minesRemaining: number;
  cellsRevealed: number;
  settings: GameSettings;
  startTime: number | null;
  endTime: number | null;
}

// Function to initialize the game board
export function createBoard(settings: GameSettings): Board {
  const { rows, cols, mines } = settings;
  const board: Board = Array(rows)
    .fill(null)
    .map((_, r) =>
      Array(cols)
        .fill(null)
        .map((_, c) => ({
          isMine: false,
          state: 'hidden',
          adjacentMines: 0,
          row: r,
          col: c,
        }))
    );

  // Place mines randomly
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].isMine) {
      board[r][c].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate adjacent mines for each cell
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isMine) {
            count++;
          }
        }
      }
      board[r][c].adjacentMines = count;
    }
  }
  return board;
}

// Function to initialize game state
export function initializeGame(settings: GameSettings): GameState {
  const board = createBoard(settings);
  return {
    board,
    status: 'playing',
    minesRemaining: settings.mines,
    cellsRevealed: 0,
    settings,
    startTime: null, // Initialize startTime to null
    endTime: null,
  };
}

// Function to reveal a cell
export function revealCell(gameState: GameState, row: number, col: number): GameState {
  const { board, settings } = gameState;
  const cell = board[row][col];

  if (cell.state !== 'hidden' || gameState.status !== 'playing') {
    return gameState;
  }

  let newGameState = { ...gameState, board: JSON.parse(JSON.stringify(board)) as Board }; // Deep copy board
  
  // Start timer on first click
  if (newGameState.startTime === null) {
    newGameState.startTime = Date.now();
  }

  const newCell = newGameState.board[row][col];

  if (newCell.isMine) {
    newCell.state = 'mine_revealed';
    newGameState.status = 'lost';
    newGameState.endTime = Date.now();
    // Reveal all mines
    newGameState.board.forEach(r => r.forEach(c => {
      if (c.isMine && c.state !== 'flagged') c.state = 'mine_revealed';
      if (!c.isMine && c.state === 'flagged') c.state = 'wrong_flag';
    }));
    return newGameState;
  }

  newCell.state = 'revealed';
  newGameState.cellsRevealed++;

  // If cell has 0 adjacent mines, reveal its neighbors (flood fill)
  if (newCell.adjacentMines === 0) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < settings.rows && nc >= 0 && nc < settings.cols) {
          // Recursively reveal, but ensure the state is updated from the result of the recursive call
          const tempState = revealCell(newGameState, nr, nc);
          newGameState = { ...tempState }; // Update game state with changes from recursive calls
        }
      }
    }
  }

  // Check for win condition
  if (newGameState.cellsRevealed === settings.rows * settings.cols - settings.mines) {
    newGameState.status = 'won';
    newGameState.endTime = Date.now();
    // Auto-flag remaining mines
    newGameState.board.forEach(r => r.forEach(c => {
      if (c.isMine && c.state === 'hidden') c.state = 'flagged';
    }));
    newGameState.minesRemaining = 0;
  }

  return newGameState;
}

// Function to toggle a flag on a cell
export function toggleFlag(gameState: GameState, row: number, col: number): GameState {
  const { board } = gameState;
  const cell = board[row][col];

  if (cell.state === 'revealed' || gameState.status !== 'playing') {
    return gameState;
  }

  const newGameState = { ...gameState, board: JSON.parse(JSON.stringify(board)) }; // Deep copy board
  const newCell = newGameState.board[row][col];

  if (newCell.state === 'hidden') {
    if (newGameState.minesRemaining > 0) {
        newCell.state = 'flagged';
        newGameState.minesRemaining--;
    }
  } else if (newCell.state === 'flagged') {
    newCell.state = 'hidden';
    newGameState.minesRemaining++;
  }

  return newGameState;
}

// Helper to count flags (optional, if needed for UI)
export function countFlags(board: Board): number {
  return board.flat().filter(cell => cell.state === 'flagged').length;
}