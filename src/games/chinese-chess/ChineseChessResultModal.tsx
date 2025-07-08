
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ChineseChessResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameResult: 'red-wins' | 'black-wins' | 'draw' | null;
  onPlayAgain: () => void;
}

const ChineseChessResultModal: React.FC<ChineseChessResultModalProps> = ({ isOpen, onClose, gameResult, onPlayAgain }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  let title = '';
  let icon = '';
  let message = '';

  if (gameResult === 'red-wins') {
    title = t('chinese_chess.red_wins');
    icon = '🏆'; // Trophy icon
    message = t('chinese_chess.congratulations_red');
  } else if (gameResult === 'black-wins') {
    title = t('chinese_chess.black_wins');
    icon = '🏆'; // Trophy icon
    message = t('chinese_chess.congratulations_black');
  } else if (gameResult === 'draw') {
    title = t('chinese_chess.draw');
    icon = '🤝'; // Handshake icon
    message = t('chinese_chess.well_played_by_both_sides');
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="text-5xl mb-4">{icon}</div>
        <h2 className="text-2xl font-bold mb-2">
          {title}
        </h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onPlayAgain}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {t('chinese_chess.play_again')}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            {t('chinese_chess.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChineseChessResultModal;
