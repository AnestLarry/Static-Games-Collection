import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import TetrisBoard from './TetrisBoard';
import NextPiecePreview from './NextPiecePreview';
import TetrisSettings from './TetrisSettings';
import TetrisResultModal from './TetrisResultModal';
import {
  initializeGame,
  movePiece,
  rotateCurrentPiece,
  hardDrop,
  getBoardWithCurrentPiece,
  type GameSettings,
  type GameState,
} from './TetrisLogic';

interface TetrisGameProps {
  navigate: (path: string) => void;
}

const TetrisGame: React.FC<TetrisGameProps> = () => {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<GameState>(() =>
    initializeGame({
      boardWidth: 10,
      boardHeight: 20,
      initialSpeed: 800,
      showGhost: true,
    })
  );
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const gameLoopRef = useRef<number | null>(null);

  const startGameLoop = useCallback(() => {
    if (gameLoopRef.current !== null) {
      return;
    }

    const loop = () => {
      setGameState((prev) => {
        const newState = movePiece(prev, 'down');

        if (newState.status === 'game_over') {
          setShowResultModal(true);
          if (gameLoopRef.current !== null) {
            clearInterval(gameLoopRef.current);
            gameLoopRef.current = null;
          }
        }

        return newState;
      });
    };

    gameLoopRef.current = window.setInterval(loop, gameState.speed);
  }, [gameState.speed]);

  const stopGameLoop = useCallback(() => {
    if (gameLoopRef.current !== null) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, []);

  const resetGame = useCallback(() => {
    stopGameLoop();
    const newGameState = initializeGame(gameState.settings);
    setGameState(newGameState);
    setShowResultModal(false);
  }, [gameState.settings, stopGameLoop]);

  const togglePause = useCallback(() => {
    if (gameState.status === 'paused') {
      setGameState((prev) => ({ ...prev, status: 'playing' }));
      startGameLoop();
    } else if (gameState.status === 'playing') {
      setGameState((prev) => ({ ...prev, status: 'paused' }));
      stopGameLoop();
    }
  }, [gameState.status, startGameLoop, stopGameLoop]);

  const applySettings = useCallback((newSettings: GameSettings) => {
    stopGameLoop();
    const newGameState = initializeGame(newSettings);
    setGameState(newGameState);
    setShowSettings(false);
  }, [stopGameLoop]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (showSettings || showResultModal) {
        return;
      }

      if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        if (gameState.status === 'game_over') {
          return;
        }
        togglePause();
        return;
      }

      if (gameState.status !== 'playing') {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          setGameState((prev) => movePiece(prev, 'left'));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          setGameState((prev) => movePiece(prev, 'right'));
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          setGameState((prev) => movePiece(prev, 'down'));
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          setGameState((prev) => rotateCurrentPiece(prev));
          break;
        case 'Enter':
          e.preventDefault();
          setGameState((prev) => hardDrop(prev));
          break;
      }
    },
    [gameState.status, showSettings, showResultModal, togglePause]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameState.status === 'playing') {
      startGameLoop();
    } else {
      stopGameLoop();
    }

    return () => stopGameLoop();
  }, [gameState.status, startGameLoop, stopGameLoop]);

  // Update game loop speed when it changes
  useEffect(() => {
    if (gameState.status === 'playing' && gameLoopRef.current !== null) {
      stopGameLoop();
      startGameLoop();
    }
  }, [gameState.speed, gameState.status, startGameLoop, stopGameLoop]);

  const displayBoard = getBoardWithCurrentPiece(gameState, gameState.settings.showGhost);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-white mb-6">{t('games.tetris')}</h1>

      <div className="flex gap-6">
        {/* Main game board */}
        <div>
          <TetrisBoard board={displayBoard} />
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-4 w-32">
          {/* Next piece */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <p className="text-gray-400 text-sm mb-2 text-center">{t('tetris.next')}</p>
            <div className="flex justify-center">
              <NextPiecePreview pieceType={gameState.nextPiece} />
            </div>
          </div>

          {/* Score */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <p className="text-gray-400 text-sm">{t('tetris.score')}</p>
            <p className="text-2xl font-bold text-white">{gameState.score}</p>
          </div>

          {/* Level */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <p className="text-gray-400 text-sm">{t('tetris.level')}</p>
            <p className="text-2xl font-bold text-cyan-400">{gameState.level}</p>
          </div>

          {/* Lines */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <p className="text-gray-400 text-sm">{t('tetris.lines')}</p>
            <p className="text-2xl font-bold text-green-400">{gameState.lines}</p>
          </div>

          {/* High Score */}
          <div className="bg-gray-700 p-3 rounded-lg">
            <p className="text-gray-400 text-sm">{t('tetris.high_score')}</p>
            <p className="text-xl font-bold text-yellow-400">{gameState.highScore}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button
          onClick={resetGame}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
        >
          {t('tetris.reset_game')}
        </button>
        <button
          onClick={togglePause}
          disabled={gameState.status === 'game_over'}
          className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors duration-300 ${
            gameState.status === 'playing'
              ? 'bg-yellow-600 text-white hover:bg-yellow-700'
              : gameState.status === 'paused'
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {gameState.status === 'playing' ? t('tetris.pause') : t('tetris.resume')}
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300"
        >
          {t('tetris.settings_button')}
        </button>
      </div>

      {/* Controls hint */}
      <div className="mt-6 text-gray-400 text-sm text-center space-y-1">
        <p>{t('tetris.controls.arrow_keys')}</p>
        <p>{t('tetris.controls.rotate')}</p>
        <p>{t('tetris.controls.hard_drop')}</p>
        <p>{t('tetris.controls.space_to_pause')}</p>
      </div>

      {showSettings && (
        <TetrisSettings
          currentSettings={gameState.settings}
          onApply={applySettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showResultModal && (
        <TetrisResultModal
          score={gameState.score}
          highScore={gameState.highScore}
          level={gameState.level}
          lines={gameState.lines}
          onClose={() => setShowResultModal(false)}
          onPlayAgain={resetGame}
        />
      )}
    </div>
  );
};

export default TetrisGame;
