export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[][];
export type GameStatus = 'playing' | 'X_wins' | 'O_wins' | 'draw';

export const initializeBoard = (size: number): Board => {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));
};

export const makeMove = (
  currentBoard: Board,
  row: number,
  col: number,
  player: Player,
  piecesPerPlayer: number | null,
  playerMovesCount: number
): Board | null => {
  if (currentBoard[row][col] !== null) {
    return null; // Cell already taken
  }

  const newBoard = currentBoard.map(r => [...r]);

  if (piecesPerPlayer !== null && playerMovesCount >= piecesPerPlayer) {
    // Find and remove the oldest piece of the current player
    let oldestPieceRemoved = false;
    for (let r = 0; r < newBoard.length; r++) {
      for (let c = 0; c < newBoard[r].length; c++) {
        if (newBoard[r][c] === player) {
          newBoard[r][c] = null;
          oldestPieceRemoved = true;
          break;
        }
      }
      if (oldestPieceRemoved) break;
    }
  }

  newBoard[row][col] = player;
  return newBoard;
};

export const checkWin = (board: Board, player: Player, winCondition: number): boolean => {
  const size = board.length;

  // Check rows
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - winCondition; c++) {
      let count = 0;
      for (let i = 0; i < winCondition; i++) {
        if (board[r][c + i] === player) {
          count++;
        }
      }
      if (count === winCondition) return true;
    }
  }

  // Check columns
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - winCondition; r++) {
      let count = 0;
      for (let i = 0; i < winCondition; i++) {
        if (board[r + i][c] === player) {
          count++;
        }
      }
      if (count === winCondition) return true;
    }
  }

  // Check diagonals (top-left to bottom-right)
  for (let r = 0; r <= size - winCondition; r++) {
    for (let c = 0; c <= size - winCondition; c++) {
      let count = 0;
      for (let i = 0; i < winCondition; i++) {
        if (board[r + i][c + i] === player) {
          count++;
        }
      }
      if (count === winCondition) return true;
    }
  }

  // Check diagonals (top-right to bottom-left)
  for (let r = 0; r <= size - winCondition; r++) {
    for (let c = winCondition - 1; c < size; c++) {
      let count = 0;
      for (let i = 0; i < winCondition; i++) {
        if (board[r + i][c - i] === player) {
          count++;
        }
      }
      if (count === winCondition) return true;
    }
  }

  return false;
};

export const checkDraw = (board: Board): boolean => {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] === null) {
        return false; // There's an empty cell, so not a draw yet
      }
    }
  }
  return true; // All cells are filled, and no winner (checked before calling this)
};
