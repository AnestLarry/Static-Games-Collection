import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import ResultModal from './ResultModal';
import { useGameState } from './useGameState';
import GameHeader from './GameHeader';

interface Game2048Props {
  navigate: (path: string) => void;
}

const Game2048: React.FC<Game2048Props> = ({ navigate }) => {
  const {
    grid,
    score,
    bestScore,
    gameStatus,
    move,
    resetGame,
    GRID_SIZE
  } = useGameState();
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      setShowResultModal(true);
    }
  }, [gameStatus]);

  const handleCloseResultModal = () => {
    setShowResultModal(false);
  };

  const handleShareGame = () => {
    // Logic to share game state (e.g., copy to clipboard or use Web Share API)
    // This can reuse parts of the ResultModal's share logic if needed, or be simpler
    const gameData = `2048 Game State:\nScore: ${score}\nGrid:\n${grid.map(row => row.join('\t')).join('\n')}`;
    navigator.clipboard.writeText(gameData)
      .then(() => alert('Game state copied to clipboard!'))
      .catch(() => alert('Could not copy game state.'));
  };

  return (
    <div className="flex flex-col items-center">
      <GameHeader gameStatus={gameStatus} navigate={navigate} />
      <GameControls move={move}>
        <GameBoard 
          grid={grid}
          score={score}
          bestScore={bestScore}
          GRID_SIZE={GRID_SIZE}
        />
        
        {showResultModal && (gameStatus === 'won' || gameStatus === 'lost') && (
          <ResultModal 
            gameStatus={gameStatus}
            score={score}
            onRestart={() => {
              resetGame();
              setShowResultModal(false); // Ensure modal closes on restart
            }}
            onClose={handleCloseResultModal}
            grid={grid}
          />
        )}

        {!showResultModal && (gameStatus === 'won' || gameStatus === 'lost') && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">
              Game Over - Score: {score}
            </h3>
            <div className="flex justify-center space-x-4">
              <button 
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 text-lg font-semibold"
                onClick={() => {
                  resetGame();
                  // Optionally, if you want the modal to reappear for a new game over immediately
                  // if (newGameStatus === 'lost' || newGameStatus === 'won') { setShowResultModal(true); }
                }}
              >
                New Game
              </button>
              <button 
                className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300 text-lg font-semibold"
                onClick={handleShareGame}
              >
                Share Game
              </button>
            </div>
          </div>
        )}
      </GameControls>
    </div>
  );
};

export default Game2048;
