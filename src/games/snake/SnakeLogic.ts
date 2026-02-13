export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Position {
  row: number;
  col: number;
}

export type CellType = 'empty' | 'snake' | 'food' | 'snake-head';

export type Board = CellType[][];

export type GameStatus = 'playing' | 'game_over' | 'paused';

export interface GameSettings {
  boardSize: number;
  initialSpeed: number;
  enableWalls: boolean;
  enablePowerUps: boolean;
}

export interface GameState {
  board: Board;
  snake: Position[];
  direction: Direction;
  nextDirection: Direction;
  food: Position | null;
  score: number;
  highScore: number;
  status: GameStatus;
  speed: number;
  settings: GameSettings;
}

export const INITIAL_SETTINGS: GameSettings = {
  boardSize: 20,
  initialSpeed: 250,
  enableWalls: true,
  enablePowerUps: false,
};

export const initializeBoard = (size: number): Board => {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill('empty'));
};

export const initializeSnake = (size: number): Position[] => {
  const center = Math.floor(size / 2);
  return [
    { row: center, col: center },
    { row: center, col: center + 1 },
    { row: center, col: center + 2 },
  ];
};

export const generateFood = (snake: Position[], boardSize: number, avoidPositions: Position[] = []): Position => {
  let newFood: Position;
  const allOccupied = new Set([...snake, ...avoidPositions].map(p => `${p.row},${p.col}`));
  
  do {
    newFood = {
      row: Math.floor(Math.random() * boardSize),
      col: Math.floor(Math.random() * boardSize),
    };
  } while (allOccupied.has(`${newFood.row},${newFood.col}`));
  
  return newFood;
};

export const initializeGame = (settings: GameSettings): GameState => {
  const board = initializeBoard(settings.boardSize);
  const snake = initializeSnake(settings.boardSize);
  const food = generateFood(snake, settings.boardSize);
  
  return {
    board,
    snake,
    direction: 'left',
    nextDirection: 'left',
    food,
    score: 0,
    highScore: 0,
    status: 'paused',
    speed: settings.initialSpeed,
    settings,
  };
};

export const moveSnake = (gameState: GameState): GameState => {
  if (gameState.status !== 'playing') {
    return gameState;
  }

  const { snake, direction, nextDirection, food, settings, score } = gameState;
  const boardSize = settings.boardSize;
  const newDirection = nextDirection;
  
  // Prevent 180-degree turns
  const oppositeDirection: Record<Direction, Direction> = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left',
  };
  
  const actualDirection = direction === oppositeDirection[nextDirection] ? direction : newDirection;
  
  const head = snake[0];
  let newHead: Position;
  
  switch (actualDirection) {
    case 'up':
      newHead = { row: head.row - 1, col: head.col };
      break;
    case 'down':
      newHead = { row: head.row + 1, col: head.col };
      break;
    case 'left':
      newHead = { row: head.row, col: head.col - 1 };
      break;
    case 'right':
      newHead = { row: head.row, col: head.col + 1 };
      break;
  }
  
  // Check wall collision
  if (settings.enableWalls) {
    if (
      newHead.row < 0 ||
      newHead.row >= boardSize ||
      newHead.col < 0 ||
      newHead.col >= boardSize
    ) {
      return { ...gameState, status: 'game_over', highScore: Math.max(score, gameState.highScore) };
    }
  } else {
    // Wrap around walls
    if (newHead.row < 0) newHead.row = boardSize - 1;
    if (newHead.row >= boardSize) newHead.row = 0;
    if (newHead.col < 0) newHead.col = boardSize - 1;
    if (newHead.col >= boardSize) newHead.col = 0;
  }
  
  // Check self collision
  for (let i = 0; i < snake.length; i++) {
    if (newHead.row === snake[i].row && newHead.col === snake[i].col) {
      return { ...gameState, status: 'game_over', highScore: Math.max(score, gameState.highScore) };
    }
  }
  
  const newSnake = [newHead, ...snake];
  let newFood = food;
  let newScore = score;
  
  // Check food collision
  if (newFood && newHead.row === newFood.row && newHead.col === newFood.col) {
    newScore += 10;
    newFood = generateFood(newSnake, boardSize, [newHead]);
  } else {
    newSnake.pop();
  }
  
  // Update board
  const newBoard = initializeBoard(boardSize);
  newSnake.forEach((segment, index) => {
    if (segment.row >= 0 && segment.row < boardSize && segment.col >= 0 && segment.col < boardSize) {
      newBoard[segment.row][segment.col] = index === 0 ? 'snake-head' : 'snake';
    }
  });
  
  if (newFood) {
    newBoard[newFood.row][newFood.col] = 'food';
  }
  
  return {
    ...gameState,
    board: newBoard,
    snake: newSnake,
    direction: actualDirection,
    nextDirection: actualDirection,
    food: newFood,
    score: newScore,
    highScore: Math.max(newScore, gameState.highScore),
  };
};

export const changeDirection = (gameState: GameState, newDirection: Direction): GameState => {
  return {
    ...gameState,
    nextDirection: newDirection,
  };
};

export const isValidDirectionChange = (current: Direction, next: Direction): boolean => {
  const opposite: Record<Direction, Direction> = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left',
  };
  return opposite[current] !== next;
};
