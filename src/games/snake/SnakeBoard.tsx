import React from 'react';
import type { Board } from './SnakeLogic';

interface SnakeBoardProps {
  board: Board;
}

const SnakeBoard: React.FC<SnakeBoardProps> = ({ board }) => {
  const boardSize = board.length;
  const cellSize = `min(${60 / boardSize}vw, 30px)`;

  return (
    <div
      className="grid gap-px bg-gray-600 p-2 rounded-lg shadow-inner mx-auto"
      style={{
        gridTemplateColumns: `repeat(${boardSize}, ${cellSize})`,
        gridTemplateRows: `repeat(${boardSize}, ${cellSize})`,
      }}
    >
      {board.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`rounded-sm transition-colors duration-100 ${
              cell === 'snake-head'
                ? 'bg-green-500 shadow-lg shadow-green-500/50'
                : cell === 'snake'
                ? 'bg-green-600'
                : cell === 'food'
                ? 'bg-red-500 shadow-lg shadow-red-500/50'
                : 'bg-gray-800'
            }`}
            style={{ width: cellSize, height: cellSize }}
          >
            {cell === 'food' && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-2/3 h-2/3 bg-red-400 rounded-full animate-pulse" />
              </div>
            )}
            {cell === 'snake-head' && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-1/2 h-1/2 bg-green-400 rounded-full" />
              </div>
            )}
          </div>
        ))
      ))}
    </div>
  );
};

export default SnakeBoard;
