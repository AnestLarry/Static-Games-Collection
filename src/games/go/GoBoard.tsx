import React from 'react';
import type { Board } from './GoLogic';

interface GoBoardProps {
  board: Board;
  onCellClick: (row: number, col: number) => void;
  size: number;
}

const GoBoard: React.FC<GoBoardProps> = ({ board, onCellClick, size }) => {
  const cellSize = 30; // px
  const boardSizePx = size * cellSize;

  return (
    <div
      className="relative bg-amber-700 border-4 border-amber-900 rounded-lg shadow-xl"
      style={{
        width: boardSizePx,
        height: boardSizePx,
      }}
    >
      {/* Render grid lines */}
      {Array.from({ length: size }).map((_, i) => (
        <React.Fragment key={`row-col-lines-${i}`}>
          <div
            className="absolute bg-gray-800"
            style={{
              left: 0,
              top: (i + 0.5) * cellSize - 1,
              width: '100%',
              height: 2,
            }}
          />
          <div
            className="absolute bg-gray-800"
            style={{
              left: (i + 0.5) * cellSize - 1,
              top: 0,
              width: 2,
              height: '100%',
            }}
          />
        </React.Fragment>
      ))}

      {/* Render board cells and stones */}
      {board.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="absolute flex items-center justify-center cursor-pointer"
            style={{
              left: colIndex * cellSize,
              top: rowIndex * cellSize,
              width: cellSize,
              height: cellSize,
            }}
            onClick={() => onCellClick(rowIndex, colIndex)}
          >
            {cell && (
              <div
                className={`w-6 h-6 rounded-full ${cell === 'black' ? 'bg-gray-900' : 'bg-white border border-gray-400'}`}
              />
            )}
          </div>
        ))
      ))}
    </div>
  );
};

export default GoBoard;
