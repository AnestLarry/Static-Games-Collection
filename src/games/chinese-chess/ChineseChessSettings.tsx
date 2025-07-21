import React from 'react';
import { useTranslation } from 'react-i18next';

interface ChineseChessSettingsProps {
  onClose: () => void;
  rotateBlackPieces: boolean;
  onToggleRotate: () => void;
}

const ChineseChessSettings: React.FC<ChineseChessSettingsProps> = ({ onClose, rotateBlackPieces, onToggleRotate }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
        <h2 className="text-2xl font-bold mb-4">{t('chinese_chess.settings_modal.game_settings')}</h2>
        <div className="flex items-center justify-center space-x-4">
          <span>{t('chinese_chess.settings_modal.rotate_black_pieces')}</span>
          <button
            onClick={onToggleRotate}
            className={`px-4 py-2 rounded-full w-24 ${rotateBlackPieces ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
            {rotateBlackPieces ? t('common.on') : t('common.off')}
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300"
        >
          {t('chinese_chess.settings_modal.close')}
        </button>
      </div>
    </div>
  );
};

export default ChineseChessSettings;