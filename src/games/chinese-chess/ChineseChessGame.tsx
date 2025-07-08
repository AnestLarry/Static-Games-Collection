import React, { useState, useEffect } from 'react';
import ChineseChessBoard from './ChineseChessBoard';
import ChineseChessControls from './ChineseChessControls';
import ChineseChessHeader from './ChineseChessHeader';
import ChineseChessResultModal from './ChineseChessResultModal';
import ChineseChessSettings from './ChineseChessSettings';
import ChineseChessHistory from './ChineseChessHistory';
import { useChineseChessState } from './useChineseChessState';
import { useTranslation } from 'react-i18next';

const ChineseChessGame: React.FC = () => {
  const { gameState, handleSquareClick, resetGame, undo, redo } = useChineseChessState();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOpenResultModal, setIsOpenResultModal] = useState(true);
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showFocusTip, setShowFocusTip] = useState(false);
  const { t } = useTranslation();

  const handlePlayAgain = () => {
    resetGame();
  };

  const handleCloseResultModal = () => {
    setIsOpenResultModal(false);
  };

  const toggleHistoryVisibility = () => {
    setIsHistoryVisible(prev => !prev);
  };

  const toggleFocusMode = () => {
    setIsFocusMode(prev => !prev);
    setShowFocusTip(!isFocusMode); // Show tip when entering focus mode
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
        setShowFocusTip(false); // Hide tip when exiting focus mode with ESC
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFocusMode]);

  useEffect(() => {
    let timer: number;
    if (showFocusTip) {
      timer = setTimeout(() => {
        setShowFocusTip(false);
      }, 5000); // Hide after 5 seconds
    }
    return () => clearTimeout(timer);
  }, [showFocusTip]);

  return (
    <div className={`flex flex-col items-center justify-center p-4 bg-gray-100 ${isFocusMode ? 'fixed inset-0 w-screen h-screen' : 'min-h-screen'}`}>
      {isFocusMode && showFocusTip && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md text-sm opacity-80 flex items-center space-x-2">
          <span>{t('chinese_chess.press_esc_to_exit_focus_mode')}</span>
          <button onClick={() => setShowFocusTip(false)} className="ml-2 text-white hover:text-gray-300 focus:outline-none">
            &times;
          </button>
        </div>
      )}
      {!isFocusMode && (
        <h1 className="text-4xl font-bold text-gray-800 mb-6">{t('games.chinese-chess')}</h1>
      )}
      
      {!isFocusMode && (
        <ChineseChessHeader 
          currentPlayer={gameState.currentPlayer}
          gameStatus={gameState.gameStatus}
        />
      )}

      <div className={`flex ${isFocusMode ? 'flex-grow items-center justify-center' : 'flex-col md:flex-row gap-8 mt-4'}`}>
        <ChineseChessBoard 
          board={gameState.board}
          selectedPiece={gameState.selectedPiece}
          onSquareClick={handleSquareClick}
          isFocusMode={isFocusMode} // Pass focus mode to board
        />
        
        {!isFocusMode && (
          <ChineseChessControls 
            onReset={resetGame}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onUndo={undo}
            onRedo={redo}
            canUndo={gameState.historyPointer > 0}
            canRedo={gameState.historyPointer < gameState.moveHistory.length - 1}
            onToggleHistory={toggleHistoryVisibility}
            isHistoryVisible={isHistoryVisible}
            onToggleFocusMode={toggleFocusMode} // Pass the new toggle function
            isFocusMode={isFocusMode} // Pass the focus mode state
          />
        )}
        {!isFocusMode && isHistoryVisible && (
          <ChineseChessHistory 
            moveHistory={gameState.moveHistory}
            historyPointer={gameState.historyPointer}
          />
        )}
      </div>

      {!isFocusMode && (
        <ChineseChessResultModal 
          isOpen={gameState.gameStatus !== 'playing' && isOpenResultModal}
          onClose={handleCloseResultModal}
          gameResult={gameState.gameStatus === 'red-wins' ? 'red-wins' : gameState.gameStatus === 'black-wins' ? 'black-wins' : gameState.gameStatus === 'draw' ? 'draw' : null}
          onPlayAgain={handlePlayAgain}
        />
      )}

      {!isFocusMode && isSettingsOpen && (
        <ChineseChessSettings 
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default ChineseChessGame;