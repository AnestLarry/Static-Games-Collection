import React from 'react';

interface SudokuBoardProps {
  board: {
    value: number;
    isFixed: boolean;
    isValid: boolean;
    notes: number[];
  }[][];
  selectedCell: [number, number] | null;
  highlightCells: [number, number][];
  sameValueCells: [number, number][];
  onCellClick: (row: number, col: number) => void;
  highlightConflicts: boolean;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  selectedCell,
  highlightCells,
  sameValueCells,
  onCellClick,
  highlightConflicts,
}) => {
  const getCellClass = (row: number, col: number) => {
    const cell = board[row][col];
    const isSelected = selectedCell?.[0] === row && selectedCell?.[1] === col;
    const isHighlighted = highlightCells.some(([r, c]) => r === row && c === col);
    const isSameValue = sameValueCells.some(([r, c]) => r === row && c === col);

    // Box borders (3x3 boxes)
    const borderRight = (col + 1) % 3 === 0 && col < 8 ? 'border-r-2 border-r-gray-400' : '';
    const borderBottom = (row + 1) % 3 === 0 && row < 8 ? 'border-b-2 border-b-gray-400' : '';

    let classes = 'aspect-square flex items-center justify-center text-lg font-semibold cursor-pointer transition-colors border border-gray-600 ';

    classes += borderRight + ' ' + borderBottom + ' ';

    // Fixed cells styling
    if (cell.isFixed) {
      classes += 'bg-gray-700 text-white font-bold ';
    }

    // Selected cell
    if (isSelected) {
      classes += 'bg-blue-600 text-white ';
    } else if (isHighlighted) {
      // Highlighted cells (same row/col/box)
      classes += 'bg-blue-900/30 ';
    } else if (isSameValue) {
      // Same value cells
      classes += 'bg-blue-900/10 ';
    } else if (!cell.isFixed) {
      classes += 'hover:bg-gray-700 ';
    }

    // Invalid cells
    if (highlightConflicts && !cell.isValid && cell.value !== 0 && !isSelected) {
      classes += 'bg-red-900/50 text-red-400 ';
    }

    return classes;
  };

  return (
    <div className="w-full max-w-[min(90vw,400px)] mx-auto">
      <div className="grid grid-cols-9 border-2 border-gray-400 rounded-lg overflow-hidden">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellClass(rowIndex, colIndex)}
              onClick={() => onCellClick(rowIndex, colIndex)}
            >
              {cell.value !== 0 ? (
                <span>{cell.value}</span>
              ) : cell.notes.length > 0 ? (
                <div className="w-full h-full grid grid-cols-3 grid-rows-3 text-[0.5rem] text-gray-400 p-0.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <span
                      key={num}
                      className={`flex items-center justify-center ${
                        cell.notes.includes(num) ? 'text-white' : 'text-transparent'
                      }`}
                    >
                      {num}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SudokuBoard;
