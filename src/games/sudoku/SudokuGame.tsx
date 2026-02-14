import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import SudokuBoard from './SudokuBoard';
import NumberPad from './NumberPad';
import SudokuSettings from './SudokuSettings';
import SudokuResultModal from './SudokuResultModal';
import {
  initGame,
  setCellValue,
  toggleNote,
  getHighlightCells,
  getRelatedCells,
  getHint,
  autoNotes,
  formatTime,
  type GameState,
  type GameSettings,
  DEFAULT_SETTINGS,
} from './SudokuLogic';

interface SudokuGameProps {
  navigate: (path: string) => void;
}

const SudokuGame: React.FC<SudokuGameProps> = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [gameState, setGameState] = useState<GameState>(() => initGame(settings.difficulty));
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  // Timer
  useEffect(() => {
    if (gameState.isComplete || (gameState.mistakes >= gameState.maxMistakes && gameState.maxMistakes > 0)) {
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
  }, [gameState.isComplete, gameState.mistakes, gameState.maxMistakes, gameState.startTime]);

  // Handle cell click
  const handleCellClick = useCallback((row: number, col: number) => {
    setSelectedCell([row, col]);
  }, []);

  // Handle number input
  const handleNumberClick = useCallback((num: number) => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;

    if (isNotesMode) {
      setGameState(prev => toggleNote(prev, row, col, num));
    } else {
      setGameState(prev => setCellValue(prev, row, col, num));
    }
  }, [selectedCell, isNotesMode]);

  // Handle clear
  const handleClear = useCallback(() => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    setGameState(prev => setCellValue(prev, row, col, 0));
  }, [selectedCell]);

  // Handle hint
  const handleHint = useCallback(() => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    setGameState(prev => getHint(prev, row, col));
  }, [selectedCell]);

  // Handle auto notes
  const handleAutoNotes = useCallback(() => {
    setGameState(prev => autoNotes(prev));
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '9') {
        handleNumberClick(parseInt(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        handleClear();
      } else if (e.key === 'n' || e.key === 'N') {
        setIsNotesMode(prev => !prev);
      } else if (e.key === 'h' || e.key === 'H') {
        handleHint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumberClick, handleClear, handleHint]);

  // Get highlight cells
  const highlightCells = selectedCell ? getHighlightCells(selectedCell[0], selectedCell[1]) : [];
  const sameValueCells = selectedCell && gameState.board[selectedCell[0]][selectedCell[1]].value !== 0
    ? getRelatedCells(gameState.board, gameState.board[selectedCell[0]][selectedCell[1]].value)
    : [];

  // Get used numbers count
  const usedNumbers = gameState.board.flat().map(cell => cell.value).filter(v => v !== 0);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState(initGame(settings.difficulty));
    setSelectedCell(null);
    setIsNotesMode(false);
    setIsResultOpen(false);
  }, [settings.difficulty]);

  // Apply settings and restart
  const handleApplySettings = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    setGameState(initGame(newSettings.difficulty));
    setSelectedCell(null);
    setIsNotesMode(false);
  }, []);

  // Check if game is over (too many mistakes)
  const isGameOver = gameState.mistakes >= gameState.maxMistakes && gameState.maxMistakes > 0;
  const isWin = gameState.isComplete && !isGameOver;

  return (
    <div className="flex flex-col gap-4 p-4 max-w-lg mx-auto bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-gray-400">{t('sudoku.difficulty')}: </span>
            <span className="font-semibold capitalize">{t(`sudoku.settings.${gameState.difficulty}`)}</span>
          </div>
          {settings.showTimer && (
            <div className="text-sm font-mono">
              ⏱️ {formatTime(gameState.elapsedTime)}
            </div>
          )}
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors"
        >
          {t('sudoku.settings_button')}
        </button>
      </div>

      {/* Mistakes counter */}
      {gameState.maxMistakes > 0 && (
        <div className="text-center text-sm">
          <span className="text-gray-400">{t('sudoku.mistakes')}: </span>
          <span className={`font-semibold ${gameState.mistakes >= gameState.maxMistakes ? 'text-red-400' : 'text-white'}`}>
            {gameState.mistakes} / {gameState.maxMistakes}
          </span>
        </div>
      )}

      {/* Board */}
      <SudokuBoard
        board={gameState.board}
        selectedCell={selectedCell}
        highlightCells={highlightCells}
        sameValueCells={sameValueCells}
        onCellClick={handleCellClick}
        highlightConflicts={settings.highlightConflicts}
      />

      {/* Number pad */}
      <NumberPad
        onNumberClick={handleNumberClick}
        onClear={handleClear}
        onHint={handleHint}
        onToggleNotes={() => setIsNotesMode(prev => !prev)}
        isNotesMode={isNotesMode}
        usedNumbers={usedNumbers}
        disabled={isGameOver || gameState.isComplete}
      />

      {/* Auto notes button */}
      <button
        onClick={handleAutoNotes}
        className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors"
      >
        {t('sudoku.auto_notes')}
      </button>

      {/* Control buttons */}
      <button
        onClick={resetGame}
        className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors"
      >
        {t('sudoku.reset_game')}
      </button>

      {/* Controls help */}
      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>{t('sudoku.controls.click_number')}</p>
        <p>{t('sudoku.controls.keyboard')}</p>
        <p>{t('sudoku.controls.notes_toggle')}</p>
      </div>

      {/* Settings dialog */}
      <SudokuSettings
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        settings={settings}
        onApply={handleApplySettings}
      />

      {/* Result dialog */}
      <SudokuResultModal
        open={isResultOpen}
        onOpenChange={setIsResultOpen}
        isWin={isWin}
        difficulty={gameState.difficulty}
        elapsedTime={gameState.elapsedTime}
        mistakes={gameState.mistakes}
        hintsUsed={gameState.hintsUsed}
        onPlayAgain={() => {
          resetGame();
          setIsResultOpen(false);
        }}
      />
    </div>
  );
};

export default SudokuGame;
