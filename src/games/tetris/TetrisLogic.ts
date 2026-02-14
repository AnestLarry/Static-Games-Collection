export type CellType = 'empty' | 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type Board = CellType[][];

export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Position {
  row: number;
  col: number;
}

export interface Piece {
  type: PieceType;
  shape: number[][];
  position: Position;
}

export type GameStatus = 'playing' | 'paused' | 'game_over';

export interface GameSettings {
  boardWidth: number;
  boardHeight: number;
  initialSpeed: number;
  showGhost: boolean;
}

export interface GameState {
  board: Board;
  currentPiece: Piece | null;
  nextPiece: PieceType | null;
  score: number;
  level: number;
  lines: number;
  highScore: number;
  status: GameStatus;
  speed: number;
  settings: GameSettings;
}

// Tetromino shapes (4x4 grid representation)
export const PIECE_SHAPES: Record<PieceType, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

// Piece colors (Tailwind classes)
export const PIECE_COLORS: Record<PieceType, string> = {
  I: 'bg-cyan-400',
  O: 'bg-yellow-400',
  T: 'bg-purple-400',
  S: 'bg-green-400',
  Z: 'bg-red-400',
  J: 'bg-blue-400',
  L: 'bg-orange-400',
};

export const INITIAL_SETTINGS: GameSettings = {
  boardWidth: 10,
  boardHeight: 20,
  initialSpeed: 800,
  showGhost: true,
};

export const initializeBoard = (width: number, height: number): Board => {
  return Array(height)
    .fill(null)
    .map(() => Array(width).fill('empty'));
};

export const createPiece = (type: PieceType): Piece => {
  const shape = PIECE_SHAPES[type].map(row => [...row]);
  return {
    type,
    shape,
    position: { row: 0, col: 3 },
  };
};

export const getRandomPieceType = (): PieceType => {
  const types: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  return types[Math.floor(Math.random() * types.length)];
};

export const rotatePiece = (piece: Piece): Piece => {
  const { shape } = piece;
  const size = shape.length;
  const rotated: number[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(0));

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      rotated[c][size - 1 - r] = shape[r][c];
    }
  }

  return {
    ...piece,
    shape: rotated,
  };
};

export const isValidPosition = (
  board: Board,
  piece: Piece,
  offset: Position = { row: 0, col: 0 }
): boolean => {
  const { shape, position } = piece;
  const newRow = position.row + offset.row;
  const newCol = position.col + offset.col;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const boardRow = newRow + r;
        const boardCol = newCol + c;

        // Check boundaries
        if (
          boardRow < 0 ||
          boardRow >= board.length ||
          boardCol < 0 ||
          boardCol >= board[0].length
        ) {
          return false;
        }

        // Check collision with placed pieces
        if (board[boardRow][boardCol] !== 'empty') {
          return false;
        }
      }
    }
  }

  return true;
};

export const placePiece = (board: Board, piece: Piece): Board => {
  const newBoard = board.map(row => [...row]);
  const { type, shape, position } = piece;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const boardRow = position.row + r;
        const boardCol = position.col + c;
        if (boardRow >= 0 && boardRow < newBoard.length) {
          newBoard[boardRow][boardCol] = type;
        }
      }
    }
  }

  return newBoard;
};

export const clearLines = (board: Board): { newBoard: Board; linesCleared: number } => {
  const newBoard: Board = [];
  let linesCleared = 0;

  for (let r = 0; r < board.length; r++) {
    if (board[r].every(cell => cell !== 'empty')) {
      linesCleared++;
    } else {
      newBoard.push([...board[r]]);
    }
  }

  // Add empty lines at the top
  while (newBoard.length < board.length) {
    newBoard.unshift(Array(board[0].length).fill('empty'));
  }

  return { newBoard, linesCleared };
};

export const calculateScore = (linesCleared: number, level: number): number => {
  const lineScores = [0, 100, 300, 500, 800];
  return lineScores[linesCleared] * level;
};

export const getGhostPosition = (board: Board, piece: Piece): Position => {
  let ghostRow = piece.position.row;

  while (isValidPosition(board, { ...piece, position: { ...piece.position, row: ghostRow + 1 } })) {
    ghostRow++;
  }

  return { row: ghostRow, col: piece.position.col };
};

export const initializeGame = (settings: GameSettings): GameState => {
  const board = initializeBoard(settings.boardWidth, settings.boardHeight);
  const firstPieceType = getRandomPieceType();
  const nextPieceType = getRandomPieceType();

  return {
    board,
    currentPiece: createPiece(firstPieceType),
    nextPiece: nextPieceType,
    score: 0,
    level: 1,
    lines: 0,
    highScore: 0,
    status: 'paused',
    speed: settings.initialSpeed,
    settings,
  };
};

export const movePiece = (gameState: GameState, direction: 'left' | 'right' | 'down'): GameState => {
  if (gameState.status !== 'playing' || !gameState.currentPiece) {
    return gameState;
  }

  const offsets: Record<string, Position> = {
    left: { row: 0, col: -1 },
    right: { row: 0, col: 1 },
    down: { row: 1, col: 0 },
  };

  const offset = offsets[direction];
  const newPiece: Piece = {
    ...gameState.currentPiece,
    position: {
      row: gameState.currentPiece.position.row + offset.row,
      col: gameState.currentPiece.position.col + offset.col,
    },
  };

  if (isValidPosition(gameState.board, newPiece)) {
    return {
      ...gameState,
      currentPiece: newPiece,
    };
  }

  // If moving down and can't move, place the piece
  if (direction === 'down') {
    const placedBoard = placePiece(gameState.board, gameState.currentPiece);
    const { newBoard, linesCleared } = clearLines(placedBoard);
    const points = calculateScore(linesCleared, gameState.level);
    const newLines = gameState.lines + linesCleared;
    const newLevel = Math.floor(newLines / 10) + 1;
    const newSpeed = Math.max(100, gameState.settings.initialSpeed - (newLevel - 1) * 50);

    const nextPieceType = gameState.nextPiece || getRandomPieceType();
    const newCurrentPiece = createPiece(nextPieceType);

    // Check if new piece can be placed (game over)
    if (!isValidPosition(newBoard, newCurrentPiece)) {
      return {
        ...gameState,
        board: newBoard,
        currentPiece: null,
        status: 'game_over',
        highScore: Math.max(gameState.score + points, gameState.highScore),
        score: gameState.score + points,
        lines: newLines,
        level: newLevel,
      };
    }

    return {
      ...gameState,
      board: newBoard,
      currentPiece: newCurrentPiece,
      nextPiece: getRandomPieceType(),
      score: gameState.score + points,
      lines: newLines,
      level: newLevel,
      speed: newSpeed,
      highScore: Math.max(gameState.score + points, gameState.highScore),
    };
  }

  return gameState;
};

export const rotateCurrentPiece = (gameState: GameState): GameState => {
  if (gameState.status !== 'playing' || !gameState.currentPiece) {
    return gameState;
  }

  const rotated = rotatePiece(gameState.currentPiece);

  // Try rotation with wall kicks
  const kicks: Position[] = [
    { row: 0, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
    { row: -1, col: 0 },
    { row: -1, col: -1 },
    { row: -1, col: 1 },
  ];

  for (const kick of kicks) {
    const newPiece: Piece = {
      ...rotated,
      position: {
        row: gameState.currentPiece.position.row + kick.row,
        col: gameState.currentPiece.position.col + kick.col,
      },
    };

    if (isValidPosition(gameState.board, newPiece)) {
      return {
        ...gameState,
        currentPiece: newPiece,
      };
    }
  }

  return gameState;
};

export const hardDrop = (gameState: GameState): GameState => {
  if (gameState.status !== 'playing' || !gameState.currentPiece) {
    return gameState;
  }

  const ghostPos = getGhostPosition(gameState.board, gameState.currentPiece);
  const droppedPiece: Piece = {
    ...gameState.currentPiece,
    position: ghostPos,
  };

  // Calculate drop distance for bonus points
  const dropDistance = ghostPos.row - gameState.currentPiece.position.row;

  const placedBoard = placePiece(gameState.board, droppedPiece);
  const { newBoard, linesCleared } = clearLines(placedBoard);
  const points = calculateScore(linesCleared, gameState.level) + dropDistance * 2;
  const newLines = gameState.lines + linesCleared;
  const newLevel = Math.floor(newLines / 10) + 1;
  const newSpeed = Math.max(100, gameState.settings.initialSpeed - (newLevel - 1) * 50);

  const nextPieceType = gameState.nextPiece || getRandomPieceType();
  const newCurrentPiece = createPiece(nextPieceType);

  // Check if new piece can be placed (game over)
  if (!isValidPosition(newBoard, newCurrentPiece)) {
    return {
      ...gameState,
      board: newBoard,
      currentPiece: null,
      status: 'game_over',
      highScore: Math.max(gameState.score + points, gameState.highScore),
      score: gameState.score + points,
      lines: newLines,
      level: newLevel,
    };
  }

  return {
    ...gameState,
    board: newBoard,
    currentPiece: newCurrentPiece,
    nextPiece: getRandomPieceType(),
    score: gameState.score + points,
    lines: newLines,
    level: newLevel,
    speed: newSpeed,
    highScore: Math.max(gameState.score + points, gameState.highScore),
  };
};

export const getBoardWithCurrentPiece = (gameState: GameState, showGhost: boolean): Board => {
  const displayBoard = gameState.board.map(row => [...row]);

  if (!gameState.currentPiece) {
    return displayBoard;
  }

  // Draw ghost piece
  if (showGhost) {
    const ghostPos = getGhostPosition(gameState.board, gameState.currentPiece);
    const { shape, type } = gameState.currentPiece;

    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const boardRow = ghostPos.row + r;
          const boardCol = ghostPos.col + c;
          if (
            boardRow >= 0 &&
            boardRow < displayBoard.length &&
            boardCol >= 0 &&
            boardCol < displayBoard[0].length &&
            displayBoard[boardRow][boardCol] === 'empty'
          ) {
            displayBoard[boardRow][boardCol] = type;
          }
        }
      }
    }
  }

  // Draw current piece
  const { shape, type, position } = gameState.currentPiece;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const boardRow = position.row + r;
        const boardCol = position.col + c;
        if (
          boardRow >= 0 &&
          boardRow < displayBoard.length &&
          boardCol >= 0 &&
          boardCol < displayBoard[0].length
        ) {
          displayBoard[boardRow][boardCol] = type;
        }
      }
    }
  }

  return displayBoard;
};
