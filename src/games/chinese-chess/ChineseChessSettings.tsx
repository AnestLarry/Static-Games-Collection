import React from 'react';
import { useTranslation } from 'react-i18next';

interface ChineseChessSettingsProps {
  onClose: () => void;
}

const ChineseChessSettings: React.FC<ChineseChessSettingsProps> = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
        <h2 className="text-2xl font-bold mb-4">{t('chinese_chess.settings_modal.game_settings')}</h2>
        {/* Settings options will go here */}
        <p>{t('chinese_chess.settings_modal.settings_content_coming_soon')}</p>
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