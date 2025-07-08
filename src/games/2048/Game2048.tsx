import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import ResultModal from './ResultModal';
import { useGameState } from './useGameState';
import GameHeader from './GameHeader';

interface Game2048Props {
  navigate: (path: string) => void;
}

const Game2048: React.FC<Game2048Props> = ({ navigate }) => {
  const { t } = useTranslation();
  const {
    grid,
    score,
    bestScore,
    gameStatus,
    move,
    resetGame,
    GRID_SIZE,
    mergedCells
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
    const gameData = `${t('2048.share_message')}:\n${t('2048.score')}: ${score}\n${t('2048.grid')}:\n${grid.map(row => row.join('\t')).join('\n')}`;
    navigator.clipboard.writeText(gameData)
      .then(() => alert(t('2048.share_success')))
      .catch(() => alert(t('2048.share_error')));
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
          mergedCells={mergedCells}
        />
        
        {showResultModal && (gameStatus === 'won' || gameStatus === 'lost') && (
          <ResultModal 
            gameStatus={gameStatus}
            score={score}
            onRestart={() => {
              resetGame();
              setShowResultModal(false);
            }}
            onClose={handleCloseResultModal}
            grid={grid}
          />
        )}

        {!showResultModal && (gameStatus === 'won' || gameStatus === 'lost') && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">
              {t('2048.game_over')} - {t('2048.score')}: {score}
            </h3>
            <div className="flex justify-center space-x-4">
              <button 
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 text-lg font-semibold"
                onClick={() => {
                  resetGame();
                }}
              >
                {t('2048.new_game')}
              </button>
              <button 
                className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300 text-lg font-semibold"
                onClick={handleShareGame}
              >
                {t('2048.share_game')}
              </button>
            </div>
          </div>
        )}
      </GameControls>
    </div>
  );
};

export default Game2048;
