import React, { useState } from 'react';

interface TicTacToeSettingsProps {
  currentBoardSize: number;
  currentWinCondition: number;
  currentPiecesPerPlayer: number | null;
  onApply: (boardSize: number, winCondition: number, piecesPerPlayer: number | null) => void;
  onClose: () => void;
}

const TicTacToeSettings: React.FC<TicTacToeSettingsProps> = ({
  currentBoardSize,
  currentWinCondition,
  currentPiecesPerPlayer,
  onApply,
  onClose,
}) => {
  const [boardSize, setBoardSize] = useState<number>(currentBoardSize);
  const [winCondition, setWinCondition] = useState<number>(currentWinCondition);
  const [piecesPerPlayer, setPiecesPerPlayer] = useState<number | null>(currentPiecesPerPlayer);

  const handleApply = () => {
    onApply(boardSize, winCondition, piecesPerPlayer);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md mx-4 border border-purple-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Game Settings</h2>

        <div className="mb-6">
          <label htmlFor="boardSize" className="block text-gray-300 text-lg font-semibold mb-2">
            Board Size: {boardSize}x{boardSize}
          </label>
          <input
            type="range"
            id="boardSize"
            min="3"
            max="10"
            value={boardSize}
            onChange={(e) => {
              const newSize = parseInt(e.target.value);
              setBoardSize(newSize);
              // Adjust win condition if it's greater than the new board size
              if (winCondition > newSize) {
                setWinCondition(newSize);
              }
            }}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="winCondition" className="block text-gray-300 text-lg font-semibold mb-2">
            Win Condition (Consecutive Marks): {winCondition}
          </label>
          <input
            type="range"
            id="winCondition"
            min="3"
            max={boardSize}
            value={winCondition}
            onChange={(e) => setWinCondition(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="piecesPerPlayer" className="block text-gray-300 text-lg font-semibold mb-2">
            Pieces Per Player (0 for unlimited): {piecesPerPlayer === null ? 'Unlimited' : piecesPerPlayer}
          </label>
          <input
            type="range"
            id="piecesPerPlayer"
            min="0"
            max="10"
            value={piecesPerPlayer === null ? 0 : piecesPerPlayer}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setPiecesPerPlayer(value === 0 ? null : value);
            }}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicTacToeSettings;
