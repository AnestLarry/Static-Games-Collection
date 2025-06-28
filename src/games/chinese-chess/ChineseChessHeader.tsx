import React from 'react';
import type { GameStatus } from './useChineseChessState';

interface ChineseChessHeaderProps {
  currentPlayer: 'red' | 'black';
  gameStatus: GameStatus;
}

const ChineseChessHeader: React.FC<ChineseChessHeaderProps> = ({ currentPlayer, gameStatus }) => {
  const statusMessage = () => {
    switch (gameStatus) {
      case 'playing':
        return `Current Turn: ${currentPlayer === 'red' ? 'Red' : 'Black'}`;
      case 'red-wins':
        return 'Red Wins!';
      case 'black-wins':
        return 'Black Wins!';
      case 'draw':
        return 'It\'s a Draw!';
      default:
        return '';
    }
  };

  return (
    <div className="chinese-chess-header text-center mb-4">
      <h2 className="text-2xl font-semibold text-gray-700">{statusMessage()}</h2>
    </div>
  );
};

export default ChineseChessHeader;