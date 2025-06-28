import React from 'react';
import type { GameStatus } from './TicTacToeLogic';

interface TicTacToeResultModalProps {
  status: GameStatus;
  onClose: () => void;
  onPlayAgain: () => void;
}

const TicTacToeResultModal: React.FC<TicTacToeResultModalProps> = ({ status, onClose, onPlayAgain }) => {
  let message = '';
  let textColor = '';

  switch (status) {
    case 'X_wins':
      message = 'Player X Wins!';
      textColor = 'text-green-500';
      break;
    case 'O_wins':
      message = 'Player O Wins!';
      textColor = 'text-blue-500';
      break;
    case 'draw':
      message = "It's a Draw!";
      textColor = 'text-yellow-500';
      break;
    default:
      message = 'Game Over';
      textColor = 'text-white';
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-sm mx-4 border border-purple-700">
        <h2 className={`text-4xl font-bold mb-4 text-center ${textColor}`}>
          {message}
        </h2>
        <p className="text-lg text-gray-300 text-center mb-6">
          What would you like to do next?
        </p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={onPlayAgain}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
          >
            Play Again
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicTacToeResultModal;
