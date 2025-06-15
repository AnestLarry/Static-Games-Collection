import React from 'react';

interface GameBoardProps {
  grid: number[][];
  score: number;
  bestScore: number;
  GRID_SIZE: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ grid, score, bestScore, GRID_SIZE }) => {
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

      <div 
        className="grid bg-[#bbada0] rounded-md p-4"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          gap: '1rem',
        }}
      >
        {grid.flatMap((row, rowIndex) =>
          row.map((value, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="flex items-center justify-center rounded-md font-bold"
              style={{
                backgroundColor: getTileColor(value),
                color: value > 4 ? '#f9f6f2' : '#776e65',
                fontSize: getFontSize(value),
                width: '80px', // Fixed size for tiles
                height: '80px', // Fixed size for tiles
              }}
            >
              {value !== 0 && value}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;
