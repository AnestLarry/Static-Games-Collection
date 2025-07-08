import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import GoBoard from './GoBoard';
import { type GoGameState, initializeGameState, isValidMove, applyMove, passTurn, checkGameEnd, calculateScore } from './GoLogic';
import GoSettings from './GoSettings';
import GoResultModal from './GoResultModal';

interface GoGameProps {
  navigate: (path: string) => void;
}

const GoGame: React.FC<GoGameProps> = ({ navigate }) => {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<GoGameState>(() => initializeGameState(9, 6.5, 0));
  const [showSettings, setShowSettings] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [gameResult, setGameResult] = useState<'black_wins' | 'white_wins' | 'draw' | null>(null);

  useEffect(() => {
    const result = checkGameEnd();
    if (result !== 'playing') {
      setGameResult(result);
      setShowResultModal(true);
    }
  }, [gameState]);

  const handleCellClick = (row: number, col: number) => {
    if (isValidMove(gameState.board, row, col, gameState.currentPlayer, gameState.size, gameState.history)) {
      setGameState(prev => applyMove(prev, row, col));
    }
  };

  const handlePass = () => {
    setGameState(prev => passTurn(prev));
  };

  const handleNewGame = (size: number, komi: number, handicap: number) => {
    setGameState(initializeGameState(size, komi, handicap));
    setShowSettings(false);
    setShowResultModal(false);
    setGameResult(null);
  };

  const handleCloseResultModal = () => {
    setShowResultModal(false);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const score = calculateScore(gameState.board, gameState.komi);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 drop-shadow-md">{t('games.go')}</h1>
      <div className="flex flex-wrap justify-center sm:justify-between w-full max-w-md mb-4 text-center sm:text-left">
        <p className="text-lg mb-2 sm:mb-0 sm:mr-4">{t('go.current_player')}: <span className="font-semibold capitalize">{t(`go.${gameState.currentPlayer}`)}</span></p>
        <p className="text-lg mb-2 sm:mb-0 sm:mr-4">{t('go.black_captured')}: <span className="font-semibold">{gameState.capturedWhite}</span></p>
        <p className="text-lg">{t('go.white_captured')}: <span className="font-semibold">{gameState.capturedBlack}</span></p>
      </div>
      <GoBoard board={gameState.board} onCellClick={handleCellClick} size={gameState.size} />
      <div className="mt-4 flex space-x-4">
        <button
          onClick={handlePass}
          className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full shadow-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
        >
          {t('go.pass')}
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
        >
          {t('go.settings_button')}
        </button>
        <button
          onClick={handleGoHome}
          className="px-8 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold rounded-full shadow-lg hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105"
        >
          {t('home')}
        </button>
      </div>

      {showSettings && (
        <GoSettings
          onNewGame={handleNewGame}
          onClose={() => setShowSettings(false)}
          initialSize={gameState.size}
          initialKomi={gameState.komi}
          initialHandicap={gameState.handicap}
        />
      )}

      {showResultModal && gameResult && (
        <GoResultModal
          result={gameResult}
          onPlayAgain={() => handleNewGame(gameState.size, gameState.komi, gameState.handicap)}
          onClose={handleCloseResultModal}
          blackScore={score.black}
          whiteScore={score.white}
        />
      )}
    </div>
  );
};

export default GoGame;
