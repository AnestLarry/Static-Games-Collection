import React from 'react';
import { useTranslation } from 'react-i18next';

interface ChineseChessControlsProps {
  onReset: () => void;
  onOpenSettings: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onToggleHistory: () => void;
  isHistoryVisible: boolean;
  onToggleFocusMode: () => void; // New prop
  isFocusMode: boolean; // New prop
}

const ChineseChessControls: React.FC<ChineseChessControlsProps> = ({ onReset, onOpenSettings, onUndo, onRedo, canUndo, canRedo, onToggleHistory, isHistoryVisible, onToggleFocusMode, isFocusMode }) => {
  const { t } = useTranslation();

  return (
    <div className="chinese-chess-controls flex flex-col space-y-4 p-4 bg-white rounded-lg shadow-md">
      <button
        onClick={onReset}
        className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300"
      >
        {t('chinese_chess.reset_game')}
      </button>
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors duration-300 ${canUndo ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
      >
        {t('chinese_chess.undo')}
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors duration-300 ${canRedo ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
      >
        {t('chinese_chess.redo')}
      </button>
      <button
        onClick={onOpenSettings}
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
      >
        {t('chinese_chess.settings_button')}
      </button>
      <button
        onClick={onToggleHistory}
        className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors duration-300 ${isHistoryVisible ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
      >
        {isHistoryVisible ? t('chinese_chess.hide_history') : t('chinese_chess.show_history')}
      </button>
      <button
        onClick={onToggleFocusMode}
        className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors duration-300 ${isFocusMode ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
      >
        {isFocusMode ? t('chinese_chess.exit_focus_mode') : t('chinese_chess.focus_mode')}
      </button>
    </div>
  );
};

export default ChineseChessControls;