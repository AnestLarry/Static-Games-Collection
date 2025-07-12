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
export function toggleFlag(gameState: GameState, row: number, col: number, isAuto = false): GameState {
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
      newCell.state = isAuto ? 'auto_flagged' : 'flagged';
      newGameState.minesRemaining--;
    }
  } else if (newCell.state === 'flagged' || newCell.state === 'auto_flagged') {
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

// Type for tracking constraints
interface Constraint {
  row: number;
  col: number;
  hiddenCells: { row: number, col: number }[];
  remainingMines: number;
}

// Collect all constraints from the board
function collectConstraints(board: Board, rows: number, cols: number): Constraint[] {
  const constraints: Constraint[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = board[r][c];
      if (cell.state === 'revealed' && cell.adjacentMines > 0) {
        const hiddenCells: { row: number, col: number }[] = [];
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].state === 'hidden') {
              hiddenCells.push({ row: nr, col: nc });
            }
          }
        }
        if (hiddenCells.length > 0) {
          const flagCount = countFlaggedAdjacent(board, r, c, rows, cols);
          constraints.push({
            row: r,
            col: c,
            hiddenCells,
            remainingMines: cell.adjacentMines - flagCount
          });
        }
      }
    }
  }
  return constraints;
}

// Find advanced deductions by comparing constraints
function findAdvancedDeductions(constraints: Constraint[]): { safeCells: { row: number, col: number }[], mines: { row: number, col: number }[] } {
  const safeCells: { row: number, col: number }[] = [];
  const mines: { row: number, col: number }[] = [];

  // First pass: Pairwise deductions (original logic)
  for (let i = 0; i < constraints.length; i++) {
    for (let j = i + 1; j < constraints.length; j++) {
      const c1 = constraints[i];
      const c2 = constraints[j];

      const intersection = c1.hiddenCells.filter(cell1 =>
        c2.hiddenCells.some(cell2 => cell1.row === cell2.row && cell1.col === cell2.col)
      );

      if (intersection.length > 0) {
        // Subset checks (original logic)
        if (c1.hiddenCells.every(cell1 =>
          c2.hiddenCells.some(cell2 => cell1.row === cell2.row && cell1.col === cell2.col)
        )) {
          const diff = c2.hiddenCells.filter(cell2 =>
            !c1.hiddenCells.some(cell1 => cell1.row === cell2.row && cell1.col === cell2.col)
          );
          const mineDiff = c2.remainingMines - c1.remainingMines;

          if (mineDiff === 0) {
            safeCells.push(...diff);
          } else if (diff.length === mineDiff) {
            mines.push(...diff);
          }
        }
        else if (c2.hiddenCells.every(cell2 =>
          c1.hiddenCells.some(cell1 => cell1.row === cell2.row && cell1.col === cell2.col)
        )) {
          const diff = c1.hiddenCells.filter(cell1 =>
            !c2.hiddenCells.some(cell2 => cell1.row === cell2.row && cell1.col === cell2.col)
          );
          const mineDiff = c1.remainingMines - c2.remainingMines;

          if (mineDiff === 0) {
            safeCells.push(...diff);
          } else if (diff.length === mineDiff) {
            mines.push(...diff);
          }
        }
      }
    }
  }

  // Second pass: Higher-order constraint combinations (new logic)
  for (let i = 0; i < constraints.length; i++) {
    for (let j = i + 1; j < constraints.length; j++) {
      for (let k = j + 1; k < constraints.length; k++) {
        const c1 = constraints[i];
        const c2 = constraints[j];
        const c3 = constraints[k];

        // Calculate overlapping regions needed for deduction
        const c1Only = c1.hiddenCells.filter(c1Cell =>
          !c2.hiddenCells.some(c2Cell => c2Cell.row === c1Cell.row && c2Cell.col === c1Cell.col) &&
          !c3.hiddenCells.some(c3Cell => c3Cell.row === c1Cell.row && c3Cell.col === c1Cell.col)
        );
        const c2Only = c2.hiddenCells.filter(c2Cell =>
          !c1.hiddenCells.some(c1Cell => c1Cell.row === c2Cell.row && c1Cell.col === c2Cell.col) &&
          !c3.hiddenCells.some(c3Cell => c3Cell.row === c2Cell.row && c3Cell.col === c2Cell.col)
        );
        const c3Only = c3.hiddenCells.filter(c3Cell =>
          !c1.hiddenCells.some(c1Cell => c1Cell.row === c3Cell.row && c1Cell.col === c3Cell.col) &&
          !c2.hiddenCells.some(c2Cell => c2Cell.row === c3Cell.row && c2Cell.col === c3Cell.col)
        );
        const c1c2 = c1.hiddenCells.filter(c1Cell =>
          c2.hiddenCells.some(c2Cell => c2Cell.row === c1Cell.row && c2Cell.col === c1Cell.col) &&
          !c3.hiddenCells.some(c3Cell => c3Cell.row === c1Cell.row && c3Cell.col === c1Cell.col)
        );
        const c1c2c3 = c1.hiddenCells.filter(c1Cell =>
          c2.hiddenCells.some(c2Cell => c2Cell.row === c1Cell.row && c2Cell.col === c1Cell.col) &&
          c3.hiddenCells.some(c3Cell => c3Cell.row === c1Cell.row && c3Cell.col === c1Cell.col)
        );

        // Solve the system of equations
        const overlappingMines = c1c2c3.length > 0 ? 1 : 0; // Simplified assumption

        // Check if we can deduce any cells
        if (c1Only.length === 0 && c2Only.length === 0 && c1c2.length === 0) {
          const remainingMines = c3.remainingMines - c1.remainingMines - c2.remainingMines + overlappingMines;
          const remainingCells = c3Only;

          if (remainingMines === remainingCells.length) {
            mines.push(...remainingCells);
          } else if (remainingMines === 0) {
            safeCells.push(...remainingCells);
          }
        }
      }
    }
  }

  // Remove duplicates
  const uniqueSafeCells = [...new Map(safeCells.map(cell => [`${cell.row},${cell.col}`, cell])).values()];
  const uniqueMines = [...new Map(mines.map(cell => [`${cell.row},${cell.col}`, cell])).values()];

  return { safeCells: uniqueSafeCells, mines: uniqueMines };
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
                  newState = toggleFlag(newState, nr, nc, true);
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

  // Third pass: Advanced deductions
  const constraints = collectConstraints(newState.board, settings.rows, settings.cols);
  const { safeCells, mines } = findAdvancedDeductions(constraints);

  // Flag deduced mines
  for (const mine of mines) {
    if (newState.board[mine.row][mine.col].state === 'hidden') {
      newState = toggleFlag(newState, mine.row, mine.col, true);
      changesMade = true;
    }
  }

  // Reveal safe cells
  for (const safeCell of safeCells) {
    if (newState.board[safeCell.row][safeCell.col].state === 'hidden') {
      newState = revealCell(newState, safeCell.row, safeCell.col);
      changesMade = true;
    }
  }

  // Recursively call if changes were made
  if (changesMade) {
    newState = autoCalc(newState);
  }

  return newState;
}

// Auto-flag all certain mines
export function autoFlagCertainMines(gameState: GameState): GameState {
  const { board, settings } = gameState;
  let newState = { ...gameState, board: JSON.parse(JSON.stringify(board)) };

  for (let r = 0; r < settings.rows; r++) {
    for (let c = 0; c < settings.cols; c++) {
      const cell = board[r][c];
      if (cell.state === 'revealed' && cell.adjacentMines > 0) {
        const hiddenCount = countHiddenAdjacent(board, r, c, settings.rows, settings.cols);
        const flagCount = countFlaggedAdjacent(board, r, c, settings.rows, settings.cols);
        if (hiddenCount > 0 && hiddenCount + flagCount === cell.adjacentMines) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < settings.rows && nc >= 0 && nc < settings.cols) {
                const neighbor = newState.board[nr][nc];
                if (neighbor.state === 'hidden') {
                  newState = toggleFlag(newState, nr, nc, true);
                }
              }
            }
          }
        }
      }
    }
  }

  return newState;
}

// Flag one certain mine
export function flagOneCertainMine(gameState: GameState): GameState {
  const { board, settings } = gameState;
  const newState = { ...gameState, board: JSON.parse(JSON.stringify(board)) };

  for (let r = 0; r < settings.rows; r++) {
    for (let c = 0; c < settings.cols; c++) {
      const cell = board[r][c];
      if (cell.state === 'revealed' && cell.adjacentMines > 0) {
        const hiddenCount = countHiddenAdjacent(board, r, c, settings.rows, settings.cols);
        const flagCount = countFlaggedAdjacent(board, r, c, settings.rows, settings.cols);
        if (hiddenCount > 0 && hiddenCount + flagCount === cell.adjacentMines) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < settings.rows && nc >= 0 && nc < settings.cols) {
                const neighbor = newState.board[nr][nc];
                if (neighbor.state === 'hidden') {
                  return toggleFlag(newState, nr, nc, true);
                }
              }
            }
          }
        }
      }
    }
  }

  return newState;
}

// Open all certain empty cells
export function openAllCertainEmptyCells(gameState: GameState): GameState {
  const { board, settings } = gameState;
  let newState = { ...gameState, board: JSON.parse(JSON.stringify(board)) };

  for (let r = 0; r < settings.rows; r++) {
    for (let c = 0; c < settings.cols; c++) {
      const cell = board[r][c];
      if (cell.state === 'revealed' && cell.adjacentMines > 0) {
        const flagCount = countFlaggedAdjacent(board, r, c, settings.rows, settings.cols);
        if (flagCount === cell.adjacentMines) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < settings.rows && nc >= 0 && nc < settings.cols) {
                const neighbor = newState.board[nr][nc];
                if (neighbor.state === 'hidden') {
                  newState = revealCell(newState, nr, nc);
                }
              }
            }
          }
        }
      }
    }
  }

  return newState;
}

// Open one certain empty cell
export function openOneCertainEmptyCell(gameState: GameState): GameState {
  const { board, settings } = gameState;
  const newState = { ...gameState, board: JSON.parse(JSON.stringify(board)) };

  for (let r = 0; r < settings.rows; r++) {
    for (let c = 0; c < settings.cols; c++) {
      const cell = board[r][c];
      if (cell.state === 'revealed' && cell.adjacentMines > 0) {
        const flagCount = countFlaggedAdjacent(board, r, c, settings.rows, settings.cols);
        if (flagCount === cell.adjacentMines) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < settings.rows && nc >= 0 && nc < settings.cols) {
                const neighbor = newState.board[nr][nc];
                if (neighbor.state === 'hidden') {
                  return revealCell(newState, nr, nc);
                }
              }
            }
          }
        }
      }
    }
  }

  return newState;
}
