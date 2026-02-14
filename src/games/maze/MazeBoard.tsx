import React from 'react';
import type { CellType } from './MazeLogic';
import { getCellSizeHint } from './MazeLogic';

interface MazeBoardProps {
  maze: CellType[][];
  difficulty: 'easy' | 'medium' | 'hard';
}

const MazeBoard: React.FC<MazeBoardProps> = ({ maze, difficulty }) => {
  const cellSize = getCellSizeHint(difficulty);

  const getCellStyle = (cell: CellType): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      width: cellSize,
      height: cellSize,
      transition: 'background-color 0.15s ease',
    };

    switch (cell) {
      case 'wall':
        return { ...baseStyle, backgroundColor: '#1e293b' }; // slate-800
      case 'path':
        return { ...baseStyle, backgroundColor: '#f1f5f9' }; // slate-100
      case 'start':
        return { ...baseStyle, backgroundColor: '#22c55e' }; // green-500
      case 'end':
        return { ...baseStyle, backgroundColor: '#ef4444' }; // red-500
      case 'player':
        return { ...baseStyle, backgroundColor: '#3b82f6' }; // blue-500
      case 'visited':
        return { ...baseStyle, backgroundColor: '#dbeafe' }; // blue-100
      case 'solution':
        return { ...baseStyle, backgroundColor: '#fbbf24' }; // amber-400
      default:
        return baseStyle;
    }
  };

  const getCellContent = (cell: CellType): string => {
    switch (cell) {
      case 'start':
        return 'S';
      case 'end':
        return 'E';
      case 'player':
        return '●';
      default:
        return '';
    }
  };

  const getTextColor = (cell: CellType): string => {
    switch (cell) {
      case 'start':
      case 'end':
      case 'player':
        return 'white';
      default:
        return 'transparent';
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className="grid gap-0 border-2 border-slate-600 rounded-lg overflow-hidden shadow-lg"
        style={{
          gridTemplateColumns: `repeat(${maze[0].length}, ${cellSize})`,
        }}
      >
        {maze.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                ...getCellStyle(cell),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `calc(${cellSize} * 0.7)`,
                fontWeight: 'bold',
                color: getTextColor(cell),
              }}
            >
              {getCellContent(cell)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MazeBoard;
