import React from 'react';
import { useTranslation } from 'react-i18next';
import type { GameSettings } from './TetrisLogic';

interface TetrisSettingsProps {
  currentSettings: GameSettings;
  onApply: (newSettings: GameSettings) => void;
  onClose: () => void;
}

const MIN_SPEED = 200;
const MAX_SPEED = 1500;

const TetrisSettings: React.FC<TetrisSettingsProps> = ({
  currentSettings,
  onApply,
  onClose,
}) => {
  const { t } = useTranslation();
  const [speed, setSpeed] = React.useState(currentSettings.initialSpeed);
  const [showGhost, setShowGhost] = React.useState(currentSettings.showGhost);

  const handleApply = () => {
    onApply({
      ...currentSettings,
      initialSpeed: speed,
      showGhost,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {t('tetris.settings.title')}
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-white mb-2">
              {t('tetris.settings.speed')} ({MAX_SPEED - speed + MIN_SPEED}ms)
            </label>
            <input
              type="range"
              min={MIN_SPEED}
              max={MAX_SPEED}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-gray-400 text-sm mt-1">
              {t('tetris.settings.speed_hint')}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-white">{t('tetris.settings.show_ghost')}</span>
              <p className="text-gray-400 text-sm">{t('tetris.settings.show_ghost_hint')}</p>
            </div>
            <button
              onClick={() => setShowGhost(!showGhost)}
              className={`w-16 h-8 rounded-full transition-colors duration-300 ${
                showGhost ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                  showGhost ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex space-x-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300"
          >
            {t('tetris.settings.cancel')}
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 transition-colors duration-300"
          >
            {t('tetris.settings.apply')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TetrisSettings;
