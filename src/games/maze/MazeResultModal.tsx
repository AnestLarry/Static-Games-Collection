import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatTime, getOptimalMoves } from './MazeLogic';
import type { MazeState } from './MazeLogic';

interface MazeResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameState: MazeState;
  onPlayAgain: () => void;
}

const MazeResultModal: React.FC<MazeResultModalProps> = ({
  open,
  onOpenChange,
  gameState,
  onPlayAgain,
}) => {
  const { t } = useTranslation();
  const optimalMoves = getOptimalMoves(gameState);
  const efficiency = Math.round((optimalMoves / gameState.moves) * 100);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          🎉 {t('maze.result.complete')}
        </h2>

        <p className="text-center text-green-400 mb-6">
          {t('maze.result.congratulations')}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-center mb-6">
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-sm text-gray-400">{t('maze.result.difficulty')}</div>
            <div className="text-lg font-semibold text-white capitalize">
              {t(`maze.settings.${gameState.difficulty}`)}
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-sm text-gray-400">{t('maze.result.time')}</div>
            <div className="text-lg font-semibold text-white">{formatTime(gameState.elapsedTime)}</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-sm text-gray-400">{t('maze.result.your_moves')}</div>
            <div className="text-lg font-semibold text-white">{gameState.moves}</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <div className="text-sm text-gray-400">{t('maze.result.optimal_moves')}</div>
            <div className="text-lg font-semibold text-white">{optimalMoves}</div>
          </div>
        </div>

        {/* Efficiency */}
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">{t('maze.result.efficiency')}</div>
            <div className="text-3xl font-bold text-purple-400">{efficiency}%</div>
            <div className="text-xs text-gray-500 mt-1">
              {efficiency >= 90 && t('maze.result.perfect')}
              {efficiency >= 70 && efficiency < 90 && t('maze.result.great')}
              {efficiency >= 50 && efficiency < 70 && t('maze.result.good')}
              {efficiency < 50 && t('maze.result.keep_practicing')}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300"
          >
            {t('maze.result.close')}
          </button>
          <button
            onClick={onPlayAgain}
            className="flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300"
          >
            {t('maze.result.play_again')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MazeResultModal;
