import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import MazeBoard from './MazeBoard';
import MazeSettings from './MazeSettings';
import MazeResultModal from './MazeResultModal';
import {
  initGame,
  movePlayer,
  toggleSolution,
  formatTime,
  getOptimalMoves,
  type MazeState,
  type GameSettings,
  DEFAULT_SETTINGS,
} from './MazeLogic';

interface MazeGameProps {
  navigate: (path: string) => void;
}

const MazeGame: React.FC<MazeGameProps> = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [gameState, setGameState] = useState<MazeState>(() => initGame(settings.difficulty));
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  // Timer
  useEffect(() => {
    if (gameState.isComplete) {
      setIsResultOpen(true);
      return;
    }

    const timer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        elapsedTime: Math.floor((Date.now() - prev.startTime) / 1000),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isComplete, gameState.startTime]);

  // Handle movement
  const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setGameState(prev => movePlayer(prev, direction));
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          handleMove('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          handleMove('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          handleMove('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          handleMove('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove]);

  // Handle show/hide solution
  const handleToggleSolution = useCallback(() => {
    setGameState(prev => toggleSolution(prev));
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState(initGame(settings.difficulty));
    setIsResultOpen(false);
  }, [settings.difficulty]);

  // Apply settings and restart
  const handleApplySettings = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    setGameState(initGame(newSettings.difficulty));
  }, []);

  const optimalMoves = getOptimalMoves(gameState);

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-gray-400">{t('maze.difficulty')}: </span>
            <span className="font-semibold capitalize">{t(`maze.settings.${gameState.difficulty}`)}</span>
          </div>
          {settings.showTimer && (
            <div className="text-sm font-mono">
              ⏱️ {formatTime(gameState.elapsedTime)}
            </div>
          )}
          {settings.showMoves && (
            <div className="text-sm">
              👣 {gameState.moves} / {optimalMoves}
            </div>
          )}
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors"
        >
          {t('maze.settings_button')}
        </button>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
          <span>{t('maze.legend.start')}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
          <span>{t('maze.legend.end')}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
          <span>{t('maze.legend.player')}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-amber-400 rounded-sm"></div>
          <span>{t('maze.legend.solution')}</span>
        </div>
      </div>

      {/* Maze Board */}
      <div className="flex justify-center">
        <MazeBoard maze={gameState.maze} difficulty={gameState.difficulty} />
      </div>

      {/* Mobile Controls */}
      <div className="flex flex-col items-center gap-2 mt-2">
        <button
          onClick={() => handleMove('up')}
          className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-lg text-2xl transition-colors active:scale-95"
        >
          ↑
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => handleMove('left')}
            className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-lg text-2xl transition-colors active:scale-95"
          >
            ←
          </button>
          <button
            onClick={() => handleMove('down')}
            className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-lg text-2xl transition-colors active:scale-95"
          >
            ↓
          </button>
          <button
            onClick={() => handleMove('right')}
            className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-lg text-2xl transition-colors active:scale-95"
          >
            →
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-2 max-w-md mx-auto w-full">
        <button
          onClick={handleToggleSolution}
          className={`flex-1 px-4 py-2 rounded-md text-sm transition-colors ${
            gameState.showSolution
              ? 'bg-amber-600 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          {gameState.showSolution ? t('maze.hide_solution') : t('maze.show_solution')}
        </button>
        <button
          onClick={resetGame}
          className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors"
        >
          {t('maze.reset_game')}
        </button>
      </div>

      {/* Controls help */}
      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>{t('maze.controls.keyboard')}</p>
      </div>

      {/* Settings dialog */}
      <MazeSettings
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        settings={settings}
        onApply={handleApplySettings}
      />

      {/* Result dialog */}
      <MazeResultModal
        open={isResultOpen}
        onOpenChange={setIsResultOpen}
        gameState={gameState}
        onPlayAgain={() => {
          resetGame();
          setIsResultOpen(false);
        }}
      />
    </div>
  );
};

export default MazeGame;
