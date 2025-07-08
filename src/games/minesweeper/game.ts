export type CellState = 'hidden' | 'revealed' | 'flagged' | 'auto_flagged' | 'mine_revealed' | 'wrong_flag';

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
  safeFirstClick: boolean;
}

export interface GameState {
  board: Board;
  status: 'playing' | 'won' | 'lost' | 'not_started';
  minesRemaining: number;
  cellsRevealed: number;
  settings: GameSettings;
  startTime: number | null;
  endTime: number | null;
}

// Function to initialize the game board
export function createBoard(settings: GameSettings, firstClick: { row: number, col: number } | null = null): Board {
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

  // Place mines randomly, avoiding the first click location
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].isMine && !(firstClick && firstClick.row === r && firstClick.col === c)) {
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
  return {
    board: [], // Board is created on first click
    status: 'not_started',
    minesRemaining: settings.mines,
    cellsRevealed: 0,
    settings,
    startTime: null,
    endTime: null,
  };
}

// Function to reveal a cell
export function revealCell(gameState: GameState, row: number, col: number): GameState {
  const { board, settings, status } = gameState;

  // If the game hasn't started, create the board and reveal first cell
  if (status === 'not_started') {
    const newBoard = createBoard(settings, { row, col });
    const newGameState: GameState = { 
      ...gameState, 
      board: newBoard, 
      status: 'playing',
      startTime: Date.now(),
      cellsRevealed: 1,
      endTime: null
    };
    // Reveal the clicked cell
    newGameState.board[row][col].state = 'revealed';
    return newGameState;
  }
  
  const cell = board[row][col];

  if (cell.state !== 'hidden' || status !== 'playing') {
    return { ...gameState, board, status };
  }

  let newGameState: GameState = { 
    ...gameState, 
    board: JSON.parse(JSON.stringify(board)) as Board, 
    status: 'playing' as const
  }; // Deep copy board

  const newCell = newGameState.board[row][col];

  if (newCell.isMine) {
    newCell.state = 'mine_revealed';
    return {
      ...newGameState,
      status: 'lost',
      endTime: Date.now(),
      board: newGameState.board.map(r => r.map(c => {
        if (c.isMine && c.state !== 'flagged') return { ...c, state: 'mine_revealed' };
        if (!c.isMine && c.state === 'flagged') return { ...c, state: 'wrong_flag' };
        return c;
      }))
    };
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
          const tempState = revealCell(newGameState, nr, nc);
          newGameState = { ...tempState };
        }
      }
    }
  }

  // Check for win condition
  if (newGameState.cellsRevealed === settings.rows * settings.cols - settings.mines) {
    return {
      ...newGameState,
      status: 'won',
      endTime: Date.now(),
      minesRemaining: 0,
      board: newGameState.board.map(r => r.map(c => {
        if (c.isMine && c.state === 'hidden') return { ...c, state: 'flagged' };
        return c;
      }))
    };
  }

  return newGameState;
}

// Function to toggle a flag on a cell
export function toggleFlag(gameState: GameState, row: number, col: number): GameState {
  const { board, status } = gameState;

  if (status !== 'playing' || !board.length) {
    return gameState;
  }
  
  const cell = board[row][col];

  if (cell.state === 'revealed') {
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

// Helper to count hidden adjacent cells
function countHiddenAdjacent(board: Board, row: number, col: number, rows: number, cols: number): number {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        if (board[nr][nc].state === 'hidden') count++;
      }
    }
  }
  return count;
}

// Helper to count flagged adjacent cells
function countFlaggedAdjacent(board: Board, row: number, col: number, rows: number, cols: number): number {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        if (board[nr][nc].state === 'flagged' || board[nr][nc].state === 'auto_flagged') {
          count++;
        }
      }
    }
  }
  return count;
}

// Helper to check win condition (optional, if revealCell handles it)
export function checkWinCondition(gameState: GameState): boolean {
  const { board, settings } = gameState;
  if (!board.length) return false;
  const revealedCount = board.flat().filter(cell => cell.state === 'revealed').length;
  return revealedCount === settings.rows * settings.cols - settings.mines;
}

// Auto-calculate safe moves with recursive flagging and revealing
export function autoCalc(gameState: GameState): GameState {
  const { board, settings } = gameState;
  let newState = { ...gameState, board: JSON.parse(JSON.stringify(board)) };
  let changesMade = false;

  // First pass: Flag obvious mines
  for (let r = 0; r < settings.rows; r++) {
    for (let c = 0; c < settings.cols; c++) {
      const cell = board[r][c];
      if (cell.state === 'revealed' && cell.adjacentMines > 0) {
        const hiddenCount = countHiddenAdjacent(board, r, c, settings.rows, settings.cols);
        const flagCount = countFlaggedAdjacent(board, r, c, settings.rows, settings.cols);
        if (hiddenCount + flagCount === cell.adjacentMines) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < settings.rows && nc >= 0 && nc < settings.cols) {
                const neighbor = newState.board[nr][nc];
                if (neighbor.state === 'hidden') {
                  newState.board[nr][nc].state = 'auto_flagged'; // Visual feedback
                  newState = toggleFlag(newState, nr, nc);
                  changesMade = true;
                }
              }
            }
          }
        }
      }
    }
  }

  // Second pass: Reveal safe cells
  for (let r = 0; r < settings.rows; r++) {
    for (let c = 0; c < settings.cols; c++) {
      const cell = newState.board[r][c];
      if (cell.state === 'revealed' && cell.adjacentMines > 0) {
        const flagCount = countFlaggedAdjacent(newState.board, r, c, settings.rows, settings.cols);
        const hiddenCount = countHiddenAdjacent(newState.board, r, c, settings.rows, settings.cols);
        
        if (flagCount === cell.adjacentMines && hiddenCount > 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < settings.rows && nc >= 0 && nc < settings.cols) {
                const neighbor = newState.board[nr][nc];
                if (neighbor.state === 'hidden') {
                  newState = revealCell(newState, nr, nc);
                  changesMade = true;
                }
              }
            }
          }
        }
      }
    }
  }

  // Recursively call if changes were made
  if (changesMade) {
    newState = autoCalc(newState);
  }

  return newState;
}
