// ChineseChessLogic.ts

export interface Piece {
  type: '帥' | '仕' | '相' | '傌' | '俥' | '炮' | '兵' | '將' | '卒';
  color: 'red' | 'black';
}

export type Board = (Piece | null)[][];

export const initializeBoard = (): Board => {
  const board: Board = Array(10).fill(null).map(() => Array(9).fill(null));

  // Black pieces
  board[0][0] = { type: '俥', color: 'black' };
  board[0][1] = { type: '傌', color: 'black' };
  board[0][2] = { type: '相', color: 'black' };
  board[0][3] = { type: '仕', color: 'black' };
  board[0][4] = { type: '將', color: 'black' };
  board[0][5] = { type: '仕', color: 'black' };
  board[0][6] = { type: '相', color: 'black' };
  board[0][7] = { type: '傌', color: 'black' };
  board[0][8] = { type: '俥', color: 'black' };
  board[2][1] = { type: '炮', color: 'black' };
  board[2][7] = { type: '炮', color: 'black' };
  board[3][0] = { type: '卒', color: 'black' };
  board[3][2] = { type: '卒', color: 'black' };
  board[3][4] = { type: '卒', color: 'black' };
  board[3][6] = { type: '卒', color: 'black' };
  board[3][8] = { type: '卒', color: 'black' };

  // Red pieces
  board[9][0] = { type: '俥', color: 'red' };
  board[9][1] = { type: '傌', color: 'red' };
  board[9][2] = { type: '相', color: 'red' };
  board[9][3] = { type: '仕', color: 'red' };
  board[9][4] = { type: '帥', color: 'red' };
  board[9][5] = { type: '仕', color: 'red' };
  board[9][6] = { type: '相', color: 'red' };
  board[9][7] = { type: '傌', color: 'red' };
  board[9][8] = { type: '俥', color: 'red' };
  board[7][1] = { type: '炮', color: 'red' };
  board[7][7] = { type: '炮', color: 'red' };
  board[6][0] = { type: '兵', color: 'red' };
  board[6][2] = { type: '兵', color: 'red' };
  board[6][4] = { type: '兵', color: 'red' };
  board[6][6] = { type: '兵', color: 'red' };
  board[6][8] = { type: '兵', color: 'red' };

  return board;
};

// Helper function to check if a position is within the palace
const isInPalace = (row: number, col: number, color: 'red' | 'black'): boolean => {
  if (color === 'red') {
    return row >= 7 && row <= 9 && col >= 3 && col <= 5;
  } else { // black
    return row >= 0 && row <= 2 && col >= 3 && col <= 5;
  }
};

// Helper function to check if a piece has crossed the river
const hasCrossedRiver = (row: number, color: 'red' | 'black'): boolean => {
  return color === 'red' ? row <= 4 : row >= 5;
};

// Find the General's position
const findGeneral = (board: Board, color: 'red' | 'black'): [number, number] | null => {
  const generalType = color === 'red' ? '帥' : '將';
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece && piece.type === generalType && piece.color === color) {
        return [r, c];
      }
    }
  }
  return null;
};

/**
 * Internal helper to get all legal moves for a piece based on its rules,
 * without considering if the move puts the king in check.
 */
const _getRawLegalMoves = (board: Board, startPos: [number, number]): [number, number][] => {
  const [startRow, startCol] = startPos;
  const piece = board[startRow][startCol];
  if (!piece) return [];

  const moves: [number, number][] = [];
  const { type, color } = piece;

  const addMove = (r: number, c: number) => {
    if (r < 0 || r >= 10 || c < 0 || c >= 9) return;
    const target = board[r][c];
    if (!target || target.color !== color) {
      moves.push([r, c]);
    }
  };

  switch (type) {
    case '帥': case '將':
      [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
        const newRow = startRow + dr;
        const newCol = startCol + dc;
        if (isInPalace(newRow, newCol, color)) addMove(newRow, newCol);
      });
      break;

    case '仕':
      [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([dr, dc]) => {
        const newRow = startRow + dr;
        const newCol = startCol + dc;
        if (isInPalace(newRow, newCol, color)) addMove(newRow, newCol);
      });
      break;

    case '相':
      [[2, 2], [2, -2], [-2, 2], [-2, -2]].forEach(([dr, dc]) => {
        const newRow = startRow + dr;
        const newCol = startCol + dc;
        if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 9 && !hasCrossedRiver(newRow, color)) {
            const midRow = startRow + dr / 2;
            const midCol = startCol + dc / 2;
            if (!board[midRow][midCol]) addMove(newRow, newCol);
        }
      });
      break;

    case '傌':
      [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]].forEach(([dr, dc]) => {
        const newRow = startRow + dr;
        const newCol = startCol + dc;
        if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 9) {
          const blockRow = startRow + (Math.abs(dr) === 2 ? dr / 2 : 0);
          const blockCol = startCol + (Math.abs(dc) === 2 ? dc / 2 : 0);
          if (!board[blockRow][blockCol]) addMove(newRow, newCol);
        }
      });
      break;

    case '俥': case '炮':
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      directions.forEach(([dr, dc]) => {
        let r = startRow + dr;
        let c = startCol + dc;
        let screenFound = false;
        while (r >= 0 && r < 10 && c >= 0 && c < 9) {
          const target = board[r][c];
          if (type === '俥') {
            if (target) {
              if (target.color !== color) moves.push([r, c]);
              break;
            }
            moves.push([r, c]);
          } else { // '炮'
            if (!screenFound) {
              if (target) screenFound = true;
              else moves.push([r, c]);
            } else {
              if (target) {
                if (target.color !== color) moves.push([r, c]);
                break;
              }
            }
          }
          r += dr;
          c += dc;
        }
      });
      break;

    case '兵': case '卒':
      const forwardDir = color === 'red' ? -1 : 1;
      addMove(startRow + forwardDir, startCol);
      if (hasCrossedRiver(startRow, color)) {
        addMove(startRow, startCol + 1);
        addMove(startRow, startCol - 1);
      }
      break;
  }
  return moves;
};


// Check if the General is in check
export const isKingInCheck = (board: Board, kingColor: 'red' | 'black'): boolean => {
  const kingPos = findGeneral(board, kingColor);
  if (!kingPos) return true;

  const [kingRow, kingCol] = kingPos;
  const opponentColor = kingColor === 'red' ? 'black' : 'red';

  // 1. Check for attacks from opponent pieces
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece && piece.color === opponentColor) {
        const moves = _getRawLegalMoves(board, [r, c]);
        if (moves.some(([endRow, endCol]) => endRow === kingRow && endCol === kingCol)) {
          return true;
        }
      }
    }
  }
  
  // 2. Check for the "Flying General" rule
  const opponentKingPos = findGeneral(board, opponentColor);
  if (opponentKingPos) {
      const [oppKingRow, oppKingCol] = opponentKingPos;
      if (oppKingCol === kingCol) {
          let isPathClear = true;
          for (let r = Math.min(kingRow, oppKingRow) + 1; r < Math.max(kingRow, oppKingRow); r++) {
              if (board[r][kingCol]) {
                  isPathClear = false;
                  break;
              }
          }
          if (isPathClear) return true;
      }
  }

  return false;
};

// Simulates a move on the board
export const movePiece = (board: Board, startPos: [number, number], endPos: [number, number]): Board => {
    const newBoard = board.map(row => [...row]);
    const [startRow, startCol] = startPos;
    const [endRow, endCol] = endPos;
  
    if (newBoard[startRow][startCol]) {
        newBoard[endRow][endCol] = newBoard[startRow][startCol];
        newBoard[startRow][startCol] = null;
    }
  
    return newBoard;
};

// Main function to validate a move, now includes check prevention
export const isValidMove = (board: Board, startPos: [number, number], endPos: [number, number]): boolean => {
  const piece = board[startPos[0]][startPos[1]];
  if (!piece) return false;

  const [endRow, endCol] = endPos;
  
  // 1. Check if the move is valid according to the piece's basic rules
  const rawLegalMoves = _getRawLegalMoves(board, startPos);
  const isRawMoveValid = rawLegalMoves.some(move => move[0] === endRow && move[1] === endCol);

  if (!isRawMoveValid) return false;

  // 2. Check if the move would leave the player's own king in check
  const simulatedBoard = movePiece(board, startPos, endPos);
  if (isKingInCheck(simulatedBoard, piece.color)) return false;

  return true;
};

// =================================================================
// NEW: Game Ending Logic
// =================================================================

/**
 * Checks if a player has any legal moves.
 * A move is legal if it does not result in the player's own king being in check.
 * @param board The current board state.
 * @param color The color of the player to check.
 * @returns {boolean} True if the player has at least one legal move, false otherwise.
 */
export const hasLegalMoves = (board: Board, color: 'red' | 'black'): boolean => {
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece && piece.color === color) {
        const potentialMoves = _getRawLegalMoves(board, [r, c]);
        for (const endPos of potentialMoves) {
          const simulatedBoard = movePiece(board, [r, c], endPos);
          if (!isKingInCheck(simulatedBoard, color)) {
            return true; // Found a legal move, so they are not in checkmate/stalemate
          }
        }
      }
    }
  }
  return false; // No legal moves found
};

/**
 * Checks if the specified player is in checkmate.
 * Checkmate occurs when a player is in check AND has no legal moves.
 * @param board The current board state.
 * @param color The color of the player to check.
 * @returns {boolean} True if the player is in checkmate.
 */
export const isCheckmate = (board: Board, color: 'red' | 'black'): boolean => {
  return isKingInCheck(board, color) && !hasLegalMoves(board, color);
};

/**
 * Checks if the specified player is in stalemate.
 * In Chinese Chess, stalemate is a LOSS for the stalemated player.
 * It occurs when a player is NOT in check but has no legal moves.
 * @param board The current board state.
 * @param color The color of the player to check.
 * @returns {boolean} True if the player is in stalemate.
 */
export const isStalemate = (board: Board, color: 'red' | 'black'): boolean => {
  return !isKingInCheck(board, color) && !hasLegalMoves(board, color);
};