
import type { Board, Piece } from './ChineseChessLogic';
import React from 'react';

interface ChineseChessBoardProps {
  board: Board;
  selectedPiece: { position: [number, number], piece: Piece } | null;
  onSquareClick: (row: number, col: number) => void;
  isFocusMode?: boolean;
  rotateBlackPieces?: boolean;
}

const ChineseChessBoard: React.FC<ChineseChessBoardProps> = ({ board, selectedPiece, onSquareClick, isFocusMode, rotateBlackPieces }) => {
  const numRows = 10;
  const numCols = 9;
  const squareSize = isFocusMode ? Math.min(window.innerWidth / numCols, window.innerHeight / numRows) : 50;
  const boardWidth = (numCols - 1) * squareSize;
  const boardHeight = (numRows - 1) * squareSize;

  const renderBoard = () => {
    const lines = [];
    // Draw rows
    for (let i = 0; i < numRows; i++) {
      lines.push(<line key={`row-${i}`} x1="0" y1={i * squareSize} x2={boardWidth} y2={i * squareSize} stroke="black" />);
    }
    // Draw columns
    for (let i = 0; i < numCols; i++) {
      lines.push(<line key={`col-${i}`} x1={i * squareSize} y1="0" x2={i * squareSize} y2={boardHeight} stroke="black" />);
    }

    // Draw river
    lines.push(<text key="river-text" x={boardWidth / 2} y={4.5 * squareSize + 15} textAnchor="middle" fontSize="20">楚河 漢界</text>);

    // Draw palaces
    lines.push(<line key="palace-1" x1={3 * squareSize} y1={0} x2={5 * squareSize} y2={2 * squareSize} stroke="black" />);
    lines.push(<line key="palace-2" x1={5 * squareSize} y1={0} x2={3 * squareSize} y2={2 * squareSize} stroke="black" />);
    lines.push(<line key="palace-3" x1={3 * squareSize} y1={7 * squareSize} x2={5 * squareSize} y2={9 * squareSize} stroke="black" />);
    lines.push(<line key="palace-4" x1={5 * squareSize} y1={7 * squareSize} x2={3 * squareSize} y2={9 * squareSize} stroke="black" />);

    return lines;
  };

  return (
    <div className={`chinese-chess-board relative bg-yellow-100 border-2 border-gray-800 ${isFocusMode ? 'w-screen h-screen flex items-center justify-center' : ''}`}>
      <svg width={boardWidth} height={boardHeight} viewBox={`-10 -10 ${boardWidth + 20} ${boardHeight + 20}`}>
        {renderBoard()}
        {/* Clickable areas */}
        {board.map((row, rowIndex) =>
          row.map((_, colIndex) => (
            <circle
              key={`clickable-${rowIndex}-${colIndex}`}
              cx={colIndex * squareSize}
              cy={rowIndex * squareSize}
              r={squareSize / 2}
              fill="transparent"
              onClick={() => onSquareClick(rowIndex, colIndex)}
              className="cursor-pointer"
            />
          ))
        )}
        {/* Pieces */}
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            if (piece) {
              const isSelected = selectedPiece && selectedPiece.position[0] === rowIndex && selectedPiece.position[1] === colIndex;
              const rotation = piece.color === 'black' && rotateBlackPieces ? 180 : 0;
              return (
                <g
                  key={`piece-${rowIndex}-${colIndex}`}
                  transform={`translate(${colIndex * squareSize}, ${rowIndex * squareSize})`}
                  style={{ pointerEvents: 'none' }} // Disable pointer events on pieces to allow clicking on the underlying circle
                >
                  <circle cx="0" cy="0" r={squareSize / 2.5} fill={isSelected ? 'lightblue' : piece.color === 'red' ? '#fde047' : '#d1d5db'} stroke="black" strokeWidth="2" />
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={squareSize / 3}
                    fontWeight="bold"
                    fill={piece.color === 'red' ? 'red' : 'black'}
                    transform={`rotate(${rotation})`}
                  >
                    {piece.type}
                  </text>
                </g>
              );
            }
            return null;
          })
        )}
      </svg>
    </div>
  );
};

export default ChineseChessBoard;
