import React from 'react';

interface GameIconProps {
  className?: string;
}

// Home Icon
export const HomeIcon: React.FC<GameIconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

// 2048 Icon (number 2048 without background)
export const Game2048Icon: React.FC<GameIconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <text
      x="12"
      y="5.5"
      textAnchor="middle"
      fontSize="7"
      fontWeight="bold"
      fill="currentColor"
      dy="0.3em"
    >
      20
    </text>
    <text
      x="12"
      y="19.5"
      textAnchor="middle"
      fontSize="7"
      fontWeight="bold"
      fill="currentColor"
      dy="0.3em"
    >
      48
    </text>
  </svg>
);

// Minesweeper Icon (bomb)
export const MinesweeperIcon: React.FC<GameIconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <circle cx="12" cy="12" r="7.5" />
    <path d="M12 1v3.5M12 19.5v3M1 12h3.5M19.5 12h3M3.5 3.5l2.5 2.5M18 18l2.5 2.5M3.5 20.5l2.5-2.5M18 6l2.5-2.5" stroke="currentColor" strokeWidth="1" fill="none" />
    <circle cx="12" cy="10" r="1.5" />
    <path d="M10 15l1-2.5 1 2.5-1 2.5z" />
  </svg>
);

// Go Icon (stone)
export const GoIcon: React.FC<GameIconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm3 10a3 3 0 1 1-3-3 3 3 0 0 1 3 3z" opacity="0.3" />
    <path d="M5 12a7 7 0 0 1 7-7 7 7 0 0 1 7 7 7 7 0 0 1-7 7 7 7 0 0 1-7-7zm7-4a4 4 0 1 0 4 4 4 4 0 0 0-4-4z" />
  </svg>
);

// Chinese Chess Icon
export const ChineseChessIcon: React.FC<GameIconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    <text
      x="12"
      y="13"
      textAnchor="middle"
      fontSize="9"
      fontWeight="bold"
      fill="black"
      stroke="currentColor"
      strokeWidth="0.3"
      dy="0.3em"
    >
      帅
    </text>
  </svg>
);

// Snake Icon (S-shaped snake with tongue)
export const SnakeIcon: React.FC<GameIconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M6 6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3H9a1 1 0 0 0-1 1v1a3 3 0 0 1 3 3h6a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" />
    <circle cx="17.5" cy="6.5" r="2.5" />
    <circle cx="7.5" cy="18" r="1" />
    <circle cx="16.5" cy="6" r="0.5" fill="white" />
    <circle cx="18.5" cy="6" r="0.5" fill="white" />
    <path d="M17.5 8l1 1.5 1 0.5" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round" />
  </svg>
);

// Tetris Icon (stacked blocks)
export const TetrisIcon: React.FC<GameIconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <rect x="4" y="14" width="5" height="5" rx="1" />
    <rect x="9.5" y="14" width="5" height="5" rx="1" />
    <rect x="9.5" y="8.5" width="5" height="5" rx="1" />
    <rect x="15" y="14" width="5" height="5" rx="1" />
    <rect x="9.5" y="3" width="5" height="5" rx="1" />
  </svg>
);

// Sudoku Icon (9-grid with numbers)
export const SudokuIcon: React.FC<GameIconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" strokeWidth="1" />
    <line x1="15" y1="3" x2="15" y2="21" stroke="currentColor" strokeWidth="1" />
    <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="1" />
    <line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" strokeWidth="1" />
    <text x="6" y="7" textAnchor="middle" fontSize="4" fontWeight="bold" fill="currentColor">1</text>
    <text x="12" y="7" textAnchor="middle" fontSize="4" fontWeight="bold" fill="currentColor">2</text>
    <text x="18" y="7" textAnchor="middle" fontSize="4" fontWeight="bold" fill="currentColor">3</text>
    <text x="6" y="13" textAnchor="middle" fontSize="4" fontWeight="bold" fill="currentColor">4</text>
    <text x="12" y="13" textAnchor="middle" fontSize="4" fontWeight="bold" fill="currentColor">5</text>
    <text x="18" y="13" textAnchor="middle" fontSize="4" fontWeight="bold" fill="currentColor">6</text>
    <text x="6" y="19" textAnchor="middle" fontSize="4" fontWeight="bold" fill="currentColor">7</text>
    <text x="12" y="19" textAnchor="middle" fontSize="4" fontWeight="bold" fill="currentColor">8</text>
    <text x="18" y="19" textAnchor="middle" fontSize="4" fontWeight="bold" fill="currentColor">9</text>
  </svg>
);

// Maze Icon (labyrinth path)
export const MazeIcon: React.FC<GameIconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M3 7h12v4H7v4h10v4" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="5" cy="5" r="1.5" fill="currentColor" />
    <circle cx="19" cy="19" r="1.5" fill="currentColor" />
  </svg>
);

// More Games Icon
export const MoreGamesIcon: React.FC<GameIconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <circle cx="12" cy="5" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="12" cy="19" r="1.5" />
  </svg>
);
