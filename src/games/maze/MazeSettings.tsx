import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GameSettings, Difficulty } from './MazeLogic';

interface MazeSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: GameSettings;
  onApply: (settings: GameSettings) => void;
}

const MazeSettings: React.FC<MazeSettingsProps> = ({
  open,
  onOpenChange,
  settings,
  onApply,
}) => {
  const { t } = useTranslation();
  const [localSettings, setLocalSettings] = useState<GameSettings>(settings);

  const handleApply = () => {
    onApply(localSettings);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {t('maze.settings.title')}
        </h2>

        <div className="space-y-6">
          {/* Difficulty */}
          <div>
            <label className="block text-white mb-2">
              {t('maze.settings.difficulty')}
            </label>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
                <button
                  key={diff}
                  onClick={() => setLocalSettings({ ...localSettings, difficulty: diff })}
                  className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                    localSettings.difficulty === diff
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {t(`maze.settings.${diff}`)}
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-2">
              {localSettings.difficulty === 'easy' && t('maze.settings.easy_hint')}
              {localSettings.difficulty === 'medium' && t('maze.settings.medium_hint')}
              {localSettings.difficulty === 'hard' && t('maze.settings.hard_hint')}
            </p>
          </div>

          {/* Show Timer */}
          <div className="flex items-center justify-between">
            <span className="text-white">{t('maze.settings.show_timer')}</span>
            <button
              onClick={() => setLocalSettings({ ...localSettings, showTimer: !localSettings.showTimer })}
              className={`w-16 h-8 rounded-full transition-colors duration-300 ${
                localSettings.showTimer ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                  localSettings.showTimer ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Show Moves */}
          <div className="flex items-center justify-between">
            <span className="text-white">{t('maze.settings.show_moves')}</span>
            <button
              onClick={() => setLocalSettings({ ...localSettings, showMoves: !localSettings.showMoves })}
              className={`w-16 h-8 rounded-full transition-colors duration-300 ${
                localSettings.showMoves ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                  localSettings.showMoves ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300"
          >
            {t('maze.settings.cancel')}
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300"
          >
            {t('maze.settings.apply')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MazeSettings;
