import React from 'react';
import { useTranslation } from 'react-i18next';

interface GoResultModalProps {
  result: 'black_wins' | 'white_wins' | 'draw';
  onPlayAgain: () => void;
  onClose: () => void;
  blackScore: number;
  whiteScore: number;
}

const GoResultModal: React.FC<GoResultModalProps> = ({
  result,
  onPlayAgain,
  onClose,
  blackScore,
  whiteScore,
}) => {
  const { t } = useTranslation();
  const message = {
    black_wins: t('go.result.black_wins'),
    white_wins: t('go.result.white_wins'),
    draw: t('go.result.draw'),
  }[result];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 text-center transform transition-all duration-300 scale-105">
        <h2 className="text-4xl font-extrabold mb-4 text-gray-800">{t('go.result.game_over')}</h2>
        <p className="text-2xl mb-6 font-semibold text-gray-700">{message}</p>
        <div className="mb-6 text-xl font-medium text-gray-600">
          <p>{t('go.result.black_score')}: <span className="font-bold text-gray-800">{blackScore.toFixed(1)}</span></p>
          <p>{t('go.result.white_score')}: <span className="font-bold text-gray-800">{whiteScore.toFixed(1)}</span></p>
        </div>
        <div className="flex justify-around mt-6">
          <button
            onClick={onPlayAgain}
            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-105"
          >
            {t('go.result.play_again')}
          </button>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-105"
          >
            {t('go.result.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoResultModal;
