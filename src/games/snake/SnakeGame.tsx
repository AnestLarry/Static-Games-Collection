import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import SnakeBoard from './SnakeBoard';
import SnakeSettings from './SnakeSettings';
import SnakeResultModal from './SnakeResultModal';
import {
  initializeGame,
  moveSnake,
  changeDirection,
  isValidDirectionChange,
  type GameSettings,
  type GameState,
  type Direction,
} from './SnakeLogic';

interface SnakeGameProps {
  navigate: (path: string) => void;
}

const SnakeGame: React.FC<SnakeGameProps> = () => {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<GameState>(() =>
    initializeGame({ boardSize: 20, initialSpeed: 150, enableWalls: true, enablePowerUps: false })
  );
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const gameLoopRef = useRef<number | null>(null);
  const lastDirectionRef = useRef<Direction>('left');

  const startGameLoop = useCallback(() => {
    if (gameLoopRef.current !== null) {
      return;
    }

    const loop = () => {
      setGameState((prev) => {
        const newState = moveSnake(prev);
        
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
    lastDirectionRef.current = newGameState.direction;
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
    lastDirectionRef.current = newGameState.direction;
    setShowSettings(false);
  }, [stopGameLoop]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState.status !== 'playing' || showSettings || showResultModal) {
      return;
    }

    const keyToDirection: Record<string, Direction> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      w: 'up',
      s: 'down',
      a: 'left',
      d: 'right',
      W: 'up',
      S: 'down',
      A: 'left',
      D: 'right',
    };

    const newDirection = keyToDirection[e.key];

    if (newDirection) {
      e.preventDefault();
      
      const currentDirection = gameState.direction;
      
      if (isValidDirectionChange(currentDirection, newDirection)) {
        setGameState((prev) => changeDirection(prev, newDirection));
        lastDirectionRef.current = newDirection;
      }
    }

    if (e.key === ' ' || e.key === 'Space') {
      e.preventDefault();
      togglePause();
    }
  }, [gameState.status, gameState.direction, showSettings, showResultModal, togglePause]);

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

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-white mb-6">{t('games.snake')}</h1>

      <div className="flex justify-between w-full max-w-2xl mb-4">
        <div className="bg-gray-700 px-6 py-3 rounded-lg">
          <span className="text-gray-400 text-sm">{t('snake.score')}:</span>
          <span className="text-2xl font-bold text-white ml-2">{gameState.score}</span>
        </div>

        <div className="bg-gray-700 px-6 py-3 rounded-lg">
          <span className="text-gray-400 text-sm">{t('snake.high_score')}:</span>
          <span className="text-2xl font-bold text-yellow-400 ml-2">{gameState.highScore}</span>
        </div>

        <div className="bg-gray-700 px-6 py-3 rounded-lg">
          <span className="text-gray-400 text-sm">{t('snake.status_text')}:</span>
          <span className={`text-xl font-bold ml-2 ${
            gameState.status === 'playing' ? 'text-green-400' :
            gameState.status === 'paused' ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {t(`snake.status.${gameState.status}`)}
          </span>
        </div>
      </div>

      <SnakeBoard board={gameState.board} />

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button
          onClick={resetGame}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
        >
          {t('snake.reset_game')}
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
          {gameState.status === 'playing' ? t('snake.pause') : t('snake.resume')}
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300"
        >
          {t('snake.settings_button')}
        </button>
      </div>

      <div className="mt-6 text-gray-400 text-sm text-center">
        <p>{t('snake.controls.arrow_keys')} / WASD</p>
        <p>{t('snake.controls.space_to_pause')}</p>
      </div>

      {showSettings && (
        <SnakeSettings
          currentSettings={gameState.settings}
          onApply={applySettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showResultModal && (
        <SnakeResultModal
          score={gameState.score}
          highScore={gameState.highScore}
          onClose={() => setShowResultModal(false)}
          onPlayAgain={resetGame}
        />
      )}
    </div>
  );
};

export default SnakeGame;
