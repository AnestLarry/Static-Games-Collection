import React from 'react';
import type { Board, CellType, PieceType } from './TetrisLogic';
import { PIECE_COLORS } from './TetrisLogic';

interface TetrisBoardProps {
  board: Board;
}

const getCellColor = (cell: CellType): string => {
  if (cell === 'empty') {
    return 'bg-gray-800';
  }
  return PIECE_COLORS[cell as PieceType];
};

const TetrisBoard: React.FC<TetrisBoardProps> = ({ board }) => {
  const cellSize = `min(2.5vw, 24px)`;

  return (
    <div className="bg-gray-900 p-1 rounded-lg shadow-inner">
      <div
        className="grid gap-px"
        style={{
          gridTemplateColumns: `repeat(${board[0].length}, ${cellSize})`,
          gridTemplateRows: `repeat(${board.length}, ${cellSize})`,
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`${getCellColor(cell)} transition-colors duration-75 ${
                cell !== 'empty' ? 'border border-white/20' : ''
              }`}
              style={{ width: cellSize, height: cellSize }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TetrisBoard;
