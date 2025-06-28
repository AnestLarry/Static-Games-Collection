
import type { Board, Piece } from './ChineseChessLogic';
import React from 'react';

interface ChineseChessBoardProps {
  board: Board;
  selectedPiece: { position: [number, number], piece: Piece } | null;
  onSquareClick: (row: number, col: number) => void;
  isFocusMode?: boolean; // New prop
}

const ChineseChessBoard: React.FC<ChineseChessBoardProps> = ({ board, selectedPiece, onSquareClick, isFocusMode }) => {
  const squareSizeClass = isFocusMode ? 'w-[calc(100vw/9)] h-[calc(100vh/10)]' : 'w-12 h-12';

  return (
    <div className={`chinese-chess-board grid grid-cols-9 gap-0 border-2 border-gray-800 bg-yellow-100 ${isFocusMode ? 'w-screen h-screen' : ''}`}>
      {board.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {row.map((piece, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`${squareSizeClass} flex items-center justify-center border border-gray-400
                ${selectedPiece && selectedPiece.position[0] === rowIndex && selectedPiece.position[1] === colIndex ? 'bg-blue-300' : ''}
              `}
              onClick={() => onSquareClick(rowIndex, colIndex)}
            >
              {piece && (
                <span className={`text-xl font-bold ${piece.color === 'red' ? 'text-red-600' : 'text-black'}`}>
                  {piece.type}
                </span>
              )}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ChineseChessBoard;
