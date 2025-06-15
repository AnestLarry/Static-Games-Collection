import React from 'react';

interface GameHeaderProps {
  navigate: (path: string) => void;
  gameStatus: 'playing' | 'won' | 'lost';
}

const GameHeader: React.FC<GameHeaderProps> = ({ navigate, gameStatus }) => {

  return (
    <div className="flex justify-between w-full max-w-md mb-4">
      <button
        onClick={() => navigate('/')}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-300"
        style={{ display: gameStatus === 'playing' ? 'none' : 'block' }}
      >
        &larr; Back to Home
      </button>
    </div>
  );
};

export default GameHeader;
