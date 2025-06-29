import React, { useState, useEffect, useCallback } from 'react';
import { type GameState, initializeGame, revealCell, toggleFlag, type Cell, type GameSettings } from './game';
import MinesweeperResultModal from './MinesweeperResultModal';
import MinesweeperSettings from './MinesweeperSettings';

const DEFAULT_SETTINGS: GameSettings = {
  rows: 10,
  cols: 10,
  mines: 15,
};

const MinesweeperGame: React.FC = () => {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [gameState, setGameState] = useState<GameState>(() => initializeGame(settings));
  const [showSettings, setShowSettings] = useState(true); // Show settings on initial load
  const [showResultModal, setShowResultModal] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const newGame = useCallback((newSettings?: GameSettings) => {
    const currentSettings = newSettings || settings;
    if (newSettings) setSettings(newSettings);
    setGameState(initializeGame(currentSettings));
    setShowResultModal(false);
    setShowSettings(false); // Hide settings after starting a game
  }, [settings]);

  useEffect(() => {
    if (gameState.status === 'won' || gameState.status === 'lost') {
      setShowResultModal(true);
    }
    // Reset timer when game status changes (e.g. new game)
    if (gameState.status === 'playing') {
      // If startTime is null, it means the first click hasn't happened yet.
      // Timer will start via the interval effect once startTime is set.
      if (gameState.startTime === null) {
        setTimeElapsed(0);
      } else {
        // If a game is ongoing and startTime is set, calculate elapsed time
        // This handles cases like resuming a paused game if we add such a feature
        // For now, it primarily ensures timer continues if status was briefly not 'playing'
        setTimeElapsed(Math.floor((Date.now() - gameState.startTime) / 1000));
      }
    } else if (gameState.status === 'won' || gameState.status === 'lost') {
      if (gameState.startTime && gameState.endTime) {
        setTimeElapsed(Math.floor((gameState.endTime - gameState.startTime) / 1000));
      } else if (gameState.startTime) {
        // If game ended but endTime wasn't set (should not happen with current logic but good for robustness)
        setTimeElapsed(Math.floor((Date.now() - gameState.startTime) / 1000));
      } else {
        setTimeElapsed(0); // Game ended without starting
      }
    } else { // e.g. 'initial' or other states
        setTimeElapsed(0);
    }
  }, [gameState.status, gameState.startTime, gameState.endTime]);

  useEffect(() => {
    let timerInterval: ReturnType<typeof setInterval>;
    if (gameState.status === 'playing' && gameState.startTime !== null) {
      // Ensure we calculate from the actual start time if the component re-renders
      // or if the timer was paused.
      setTimeElapsed(Math.floor((Date.now() - gameState.startTime) / 1000)); 
      timerInterval = setInterval(() => {
        // Update based on current time and start time to avoid drift
        if(gameState.startTime) { // Double check startTime still exists
            setTimeElapsed(Math.floor((Date.now() - gameState.startTime) / 1000));
        }
      }, 1000);
    }
    return () => {
      clearInterval(timerInterval);
    };
  }, [gameState.status, gameState.startTime]);

  const handleCellClick = (row: number, col: number) => {
    if (gameState.status !== 'playing') return;
    setGameState(prev => revealCell(prev, row, col));
  };

  const handleCellRightClick = (event: React.MouseEvent<HTMLDivElement>, row: number, col: number) => {
    event.preventDefault();
    if (gameState.status !== 'playing') return;
    setGameState(prev => toggleFlag(prev, row, col));
  };

  const getCellDisplay = (cell: Cell): string | React.ReactNode => {
    switch (cell.state) {
      case 'hidden':
        return '';
      case 'flagged':
        return '🚩';
      case 'mine_revealed':
        return '💣';
      case 'wrong_flag':
        return '❌';
      case 'revealed':
        return cell.adjacentMines > 0 ? cell.adjacentMines.toString() : '';
      default:
        return '';
    }
  };

  const getCellStyle = (cell: Cell): string => {
    let baseStyle = 'w-8 h-8 md:w-10 md:h-10 border border-gray-400 flex items-center justify-center text-lg font-bold ';
    if (cell.state === 'hidden' || cell.state === 'flagged') {
      baseStyle += 'bg-gray-300 hover:bg-gray-400 cursor-pointer';
    } else if (cell.state === 'revealed') {
      baseStyle += 'bg-gray-200 ';
      if (cell.adjacentMines === 1) baseStyle += 'text-blue-500';
      if (cell.adjacentMines === 2) baseStyle += 'text-green-500';
      if (cell.adjacentMines === 3) baseStyle += 'text-red-500';
      if (cell.adjacentMines >= 4) baseStyle += 'text-purple-700';
    } else if (cell.state === 'mine_revealed') {
      baseStyle += 'bg-red-400';
    } else if (cell.state === 'wrong_flag') {
        baseStyle += 'bg-yellow-300';
    }
    return baseStyle;
  };

  if (showSettings) {
    return <MinesweeperSettings 
      currentSettings={settings} 
      onStartGame={newGame} 
      onCancel={gameState.startTime !== null ? () => setShowSettings(false) : undefined} // Allow cancel only if a game has been started before
      />;
  }

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-700 mb-6">Minesweeper</h1>
      
      <div className="mb-4 p-3 bg-white rounded-lg shadow-md flex justify-between items-center w-full max-w-md">
        <div className="text-xl font-semibold text-red-500">🚩 {gameState.minesRemaining}</div>
        <button 
          onClick={() => newGame()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          {gameState.status === 'playing' ? '🙂' : gameState.status === 'won' ? '😎' : '😵'}
        </button>
        <div className="text-xl font-semibold text-gray-700">
          ⏱️ {timeElapsed}s
        </div>
      </div>

      <div 
        className="grid gap-0.5 bg-gray-500 p-1 rounded shadow-lg"
        style={{ 
          gridTemplateColumns: `repeat(${settings.cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${settings.rows}, minmax(0, 1fr))`
        }}
        onContextMenu={(e) => e.preventDefault()} // Prevent context menu on the grid itself
      >
        {gameState.board.map((row, rIndex) =>
          row.map((cell, cIndex) => (
            <div
              key={`${rIndex}-${cIndex}`}
              className={getCellStyle(cell)}
              onClick={() => handleCellClick(rIndex, cIndex)}
              onContextMenu={(e) => handleCellRightClick(e, rIndex, cIndex)}
            >
              {getCellDisplay(cell)}
            </div>
          ))
        )}
      </div>
      
      <button 
        onClick={() => setShowSettings(true)} 
        className="mt-6 px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-300 text-lg font-semibold">
        Change Settings
      </button>

      {showResultModal && (
        <MinesweeperResultModal 
          status={gameState.status as 'won' | 'lost'} // Type assertion
          time={timeElapsed}
          onRestart={() => newGame(settings)} 
          onClose={() => setShowResultModal(false)}
        />
      )}
    </div>
  );
};

export default MinesweeperGame;