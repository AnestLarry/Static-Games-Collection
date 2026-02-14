import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Difficulty } from './SudokuLogic';
import { formatTime } from './SudokuLogic';

interface SudokuResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isWin: boolean;
  difficulty: Difficulty;
  elapsedTime: number;
  mistakes: number;
  hintsUsed: number;
  onPlayAgain: () => void;
}

const SudokuResultModal: React.FC<SudokuResultModalProps> = ({
  open,
  onOpenChange,
  isWin,
  difficulty,
  elapsedTime,
  mistakes,
  hintsUsed,
  onPlayAgain,
}) => {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          {isWin ? '🎉 ' : ''}{t('sudoku.result.complete')}
        </h2>

        <div className="text-center mb-6">
          {isWin ? (
            <p className="text-lg text-green-400">
              {t('sudoku.result.congratulations')}
            </p>
          ) : (
            <p className="text-lg text-red-400">
              {t('sudoku.result.game_over')}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-center mb-6">
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-sm text-gray-400">{t('sudoku.result.difficulty')}</div>
            <div className="text-lg font-semibold text-white capitalize">{t(`sudoku.settings.${difficulty}`)}</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-sm text-gray-400">{t('sudoku.result.time')}</div>
            <div className="text-lg font-semibold text-white">{formatTime(elapsedTime)}</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-sm text-gray-400">{t('sudoku.result.mistakes')}</div>
            <div className="text-lg font-semibold text-white">{mistakes}</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-sm text-gray-400">{t('sudoku.result.hints_used')}</div>
            <div className="text-lg font-semibold text-white">{hintsUsed}</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300"
          >
            {t('sudoku.result.close')}
          </button>
          <button
            onClick={onPlayAgain}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
          >
            {t('sudoku.result.play_again')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SudokuResultModal;
