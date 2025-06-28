import React from 'react';
import type { Board } from './TicTacToeLogic';

interface TicTacToeBoardProps {
  board: Board;
  onCellClick: (row: number, col: number) => void;
}

const TicTacToeBoard: React.FC<TicTacToeBoardProps> = ({ board, onCellClick }) => {
  const boardSize = board.length;
  const cellSize = `min(16vw, 120px)`; // Responsive cell size

  return (
    <div
      className="grid gap-1 bg-gray-700 p-2 rounded-lg shadow-inner"
      style={{
        gridTemplateColumns: `repeat(${boardSize}, ${cellSize})`,
        gridTemplateRows: `repeat(${boardSize}, ${cellSize})`,
      }}
    >
      {board.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <button
            key={`${rowIndex}-${colIndex}`}
            className="flex items-center justify-center bg-gray-900 text-white text-5xl font-bold rounded-md hover:bg-gray-700 transition-colors duration-200"
            style={{ width: cellSize, height: cellSize }}
            onClick={() => onCellClick(rowIndex, colIndex)}
          >
            {cell}
          </button>
        ))
      ))}
    </div>
  );
};

export default TicTacToeBoard;
