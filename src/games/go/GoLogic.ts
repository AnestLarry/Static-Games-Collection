// GoLogic.ts - Core game logic for Go

export type Player = 'black' | 'white';
export type Board = (Player | null)[][];

export interface GoGameState {
  board: Board;
  currentPlayer: Player;
  size: number;
  komi: number;
  handicap: number;
  capturedBlack: number;
  capturedWhite: number;
  history: Board[]; // To implement Ko rule and undo
}

export const createInitialBoard = (size: number): Board => {
  return Array(size).fill(null).map(() => Array(size).fill(null));
};

export const initializeGameState = (size: number, komi: number, handicap: number): GoGameState => {
  const board = createInitialBoard(size);
  // Apply handicap stones for black
  if (handicap > 0) {
    // Simple handicap placement for now, can be improved later
    // For example, on a 9x9 board, handicap 2 could be (2,2) and (6,6)
    // This is a placeholder and needs proper implementation based on Go rules
    for (let i = 0; i < handicap; i++) {
      // Place handicap stones in a simple pattern for now
      // This needs to be refined based on standard handicap stone placement
      const row = Math.floor(size / 4) + i;
      const col = Math.floor(size / 4) + i;
      if (row < size && col < size) {
        board[row][col] = 'black';
      }
    }
  }

  return {
    board,
    currentPlayer: 'black',
    size,
    komi,
    handicap,
    capturedBlack: 0,
    capturedWhite: 0,
    history: [JSON.parse(JSON.stringify(board))], // Save initial board state
  };
};

// Helper function to get neighbors of a cell
const getNeighbors = (row: number, col: number, size: number): [number, number][] => {
  const neighbors: [number, number][] = [];
  if (row > 0) neighbors.push([row - 1, col]);
  if (row < size - 1) neighbors.push([row + 1, col]);
  if (col > 0) neighbors.push([row, col - 1]);
  if (col < size - 1) neighbors.push([row, col + 1]);
  return neighbors;
};

// Helper function to find a group of connected stones of the same color
const findGroup = (
  board: Board,
  row: number,
  col: number,
  player: Player,
  size: number,
  visited: boolean[][]
): [number, number][] => {
  const group: [number, number][] = [];
  const stack: [number, number][] = [[row, col]];
  visited[row][col] = true;

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    group.push([r, c]);

    for (const [nr, nc] of getNeighbors(r, c, size)) {
      if (!visited[nr][nc] && board[nr][nc] === player) {
        visited[nr][nc] = true;
        stack.push([nr, nc]);
      }
    }
  }
  return group;
};

// Helper function to check if a group has any liberties
const hasLiberties = (
  board: Board,
  group: [number, number][],
  size: number
): boolean => {
  const visitedLiberties: { [key: string]: boolean } = {};
  for (const [r, c] of group) {
    for (const [nr, nc] of getNeighbors(r, c, size)) {
      if (board[nr][nc] === null && !visitedLiberties[`${nr},${nc}`]) {
        return true; // Found a liberty
      }
      visitedLiberties[`${nr},${nc}`] = true;
    }
  }
  return false;
};

// Helper function to remove a group of stones from the board
const removeGroup = (board: Board, group: [number, number][]): number => {
  let removedCount = 0;
  for (const [r, c] of group) {
    board[r][c] = null;
    removedCount++;
  }
  return removedCount;
};

export const isValidMove = (
  board: Board,
  row: number,
  col: number,
  player: Player,
  size: number,
  history: Board[] // For Ko rule
): boolean => {
  // Basic check: cell must be empty
  if (board[row][col] !== null) {
    return false;
  }

  // Simulate the move
  const tempBoard = JSON.parse(JSON.stringify(board));
  tempBoard[row][col] = player;

  // Check for self-capture (suicide)
  // Find the group of the newly placed stone
  const visited = Array(size).fill(null).map(() => Array(size).fill(false));
  const newStoneGroup = findGroup(tempBoard, row, col, player, size, visited);

  if (!hasLiberties(tempBoard, newStoneGroup, size)) {
    // If the new stone's group has no liberties, it's a suicide move
    // UNLESS it captures an opponent's stone(s)
    let capturesOpponent = false;
    const opponent = player === 'black' ? 'white' : 'black';
    for (const [nr, nc] of getNeighbors(row, col, size)) {
      if (tempBoard[nr][nc] === opponent) {
        const opponentVisited = Array(size).fill(null).map(() => Array(size).fill(false));
        const opponentGroup = findGroup(tempBoard, nr, nc, opponent, size, opponentVisited);
        if (!hasLiberties(tempBoard, opponentGroup, size)) {
          capturesOpponent = true;
          break;
        }
      }
    }
    if (!capturesOpponent) {
      return false; // Illegal suicide move
    }
  }

  // Ko rule check (simplified for now: prevent immediate repetition of board state)
  // This is a basic check and might need more sophisticated implementation for full Ko rule
  const boardAfterMove = JSON.stringify(tempBoard);
  for (const prevBoard of history) {
    if (JSON.stringify(prevBoard) === boardAfterMove) {
      return false; // Ko rule violation
    }
  }

  return true;
};

export const applyMove = (
  state: GoGameState,
  row: number,
  col: number
): GoGameState => {
  const newBoard = JSON.parse(JSON.stringify(state.board));
  newBoard[row][col] = state.currentPlayer;

  let capturedStones = 0;
  const opponent = state.currentPlayer === 'black' ? 'white' : 'black';
  const size = state.size;

  // Check for captured opponent stones
  for (const [nr, nc] of getNeighbors(row, col, size)) {
    if (newBoard[nr][nc] === opponent) {
      const visited = Array(size).fill(null).map(() => Array(size).fill(false));
      const opponentGroup = findGroup(newBoard, nr, nc, opponent, size, visited);
      if (!hasLiberties(newBoard, opponentGroup, size)) {
        capturedStones += removeGroup(newBoard, opponentGroup);
      }
    }
  }

  // Update captured counts
  const newCapturedBlack = state.currentPlayer === 'white' ? state.capturedBlack + capturedStones : state.capturedBlack;
  const newCapturedWhite = state.currentPlayer === 'black' ? state.capturedWhite + capturedStones : state.capturedWhite;

  const nextPlayer = state.currentPlayer === 'black' ? 'white' : 'black';

  return {
    ...state,
    board: newBoard,
    currentPlayer: nextPlayer,
    capturedBlack: newCapturedBlack,
    capturedWhite: newCapturedWhite,
    history: [...state.history, JSON.parse(JSON.stringify(newBoard))],
  };
};

export const passTurn = (state: GoGameState): GoGameState => {
  const nextPlayer = state.currentPlayer === 'black' ? 'white' : 'black';
  return {
    ...state,
    currentPlayer: nextPlayer,
    history: [...state.history, JSON.parse(JSON.stringify(state.board))], // Passing also adds to history
  };
};

export const checkGameEnd = (
  // state: GoGameState // Will be used for full game end conditions
): 'playing' | 'black_wins' | 'white_wins' | 'draw' => {
  // This is a simplified check. Real Go game end conditions are complex (e.g., two consecutive passes).
  // For now, we'll assume game ends when no more valid moves or players pass.
  // This needs to be expanded with proper scoring and end-game conditions.
  return 'playing';
};

export const calculateScore = (board: Board, komi: number): { black: number; white: number } => {
  // This is a highly simplified scoring. Real Go scoring is complex.
  // This needs to be implemented properly to count territory and captured stones.
  let blackTerritory = 0;
  let whiteTerritory = 0;

  board.forEach(row => {
    row.forEach(cell => {
      if (cell === 'black') {
        blackTerritory++;
      } else if (cell === 'white') {
        whiteTerritory++;
      }
    });
  });

  return {
    black: blackTerritory,
    white: whiteTerritory + komi, // Komi is added to white's score
  };
};