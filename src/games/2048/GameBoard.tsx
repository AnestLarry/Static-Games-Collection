import React from 'react';

interface GameBoardProps {
  grid: number[][];
  score: number;
  bestScore: number;
  GRID_SIZE: number;
  mergedCells?: [number, number][]; // Optional prop for merged cells
}

const GameBoard: React.FC<GameBoardProps> = ({ grid, score, bestScore, GRID_SIZE, mergedCells = [] }) => {
  const getTileColor = (value: number): string => {
    const colors: Record<number, string> = {
      0: '#cdc1b4',
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
    };
    return colors[value] || '#3c3a32';
  };

  const getFontSize = (value: number): string => {
    if (value < 100) return '3.5rem';
    if (value < 1000) return '3rem';
    return '2.5rem';
  };

  const isMerged = (rowIndex: number, colIndex: number): boolean => {
    return mergedCells.some(([row, col]) => row === rowIndex && col === colIndex);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-200 rounded-lg shadow-md">
      <div className="flex justify-between w-full max-w-md mb-4">
        <div className="bg-gray-300 rounded-md p-3 text-center min-w-[80px]">
          <div className="text-sm font-semibold text-gray-700">SCORE</div>
          <div className="text-2xl font-bold text-gray-900">{score}</div>
        </div>
        <div className="bg-gray-300 rounded-md p-3 text-center min-w-[80px]">
          <div className="text-sm font-semibold text-gray-700">BEST</div>
          <div className="text-2xl font-bold text-gray-900">{bestScore}</div>
        </div>
      </div>

      <style>
        {`
          @keyframes tileAppear {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }

          @keyframes tileMerge {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }

          .tile {
            transition: all 0.15s ease-in-out;
            animation: tileAppear 0.2s ease-in-out;
          }

          .tile-merged {
            animation: tileMerge 0.2s ease-in-out;
          }

          .tile-glow {
            box-shadow: 0 0 20px rgba(243, 215, 116, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.2);
          }
        `}
      </style>

      <div 
        className="grid bg-[#bbada0] rounded-md p-4"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          gap: '1rem',
        }}
      >
        {grid.flatMap((row, rowIndex) =>
          row.map((value, colIndex) => {
            const merged = isMerged(rowIndex, colIndex);
            const highValue = value >= 128;
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`flex items-center justify-center rounded-md font-bold tile
                  ${merged ? 'tile-merged' : ''}
                  ${highValue ? 'tile-glow' : ''}`}
                style={{
                  backgroundColor: getTileColor(value),
                  color: value > 4 ? '#f9f6f2' : '#776e65',
                  fontSize: getFontSize(value),
                  width: '80px',
                  height: '80px',
                }}
              >
                {value !== 0 && value}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GameBoard;
