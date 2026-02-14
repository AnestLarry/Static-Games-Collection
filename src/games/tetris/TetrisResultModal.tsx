import React from 'react';
import { useTranslation } from 'react-i18next';

interface TetrisResultModalProps {
  score: number;
  highScore: number;
  level: number;
  lines: number;
  onClose: () => void;
  onPlayAgain: () => void;
}

const TetrisResultModal: React.FC<TetrisResultModalProps> = ({
  score,
  highScore,
  level,
  lines,
  onClose,
  onPlayAgain,
}) => {
  const { t } = useTranslation();
  const isNewHighScore = score === highScore && score > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 text-center">
        <h2 className="text-4xl font-bold text-red-500 mb-4">
          {t('tetris.result.game_over')}
        </h2>

        {isNewHighScore && (
          <div className="text-2xl font-bold text-yellow-400 mb-6 animate-bounce">
            🏆 {t('tetris.result.new_high_score')} 🏆
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">{t('tetris.result.score')}</p>
            <p className="text-4xl font-bold text-white">{score}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">{t('tetris.result.level')}</p>
              <p className="text-3xl font-bold text-cyan-400">{level}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">{t('tetris.result.lines')}</p>
              <p className="text-3xl font-bold text-green-400">{lines}</p>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">{t('tetris.result.high_score')}</p>
            <p className="text-3xl font-bold text-yellow-400">{highScore}</p>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300"
          >
            {t('tetris.result.close')}
          </button>
          <button
            onClick={onPlayAgain}
            className="flex-1 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 transition-colors duration-300"
          >
            {t('tetris.result.play_again')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TetrisResultModal;
