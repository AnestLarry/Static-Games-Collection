
import React from 'react';

interface ChineseChessResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameResult: 'red-wins' | 'black-wins' | 'draw' | null;
  onPlayAgain: () => void;
}

const ChineseChessResultModal: React.FC<ChineseChessResultModalProps> = ({ isOpen, onClose, gameResult, onPlayAgain }) => {
  if (!isOpen) return null;

  let title = '';
  let icon = '';
  let message = '';

  if (gameResult === 'red-wins') {
    title = 'Red Wins!';
    icon = '🏆'; // Trophy icon
    message = 'Congratulations to the Red player!';
  } else if (gameResult === 'black-wins') {
    title = 'Black Wins!';
    icon = '🏆'; // Trophy icon
    message = 'Congratulations to the Black player!';
  } else if (gameResult === 'draw') {
    title = "It's a Draw!";
    icon = '🤝'; // Handshake icon
    message = 'Well played by both sides!';
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="text-5xl mb-4">{icon}</div>
        <h2 className="text-2xl font-bold mb-2">
          {title}
        </h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onPlayAgain}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Play Again
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChineseChessResultModal;
