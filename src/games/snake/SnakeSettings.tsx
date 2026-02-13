import React from 'react';
import { useTranslation } from 'react-i18next';
import type { GameSettings } from './SnakeLogic';

interface SnakeSettingsProps {
  currentSettings: GameSettings;
  onApply: (newSettings: GameSettings) => void;
  onClose: () => void;
}

const MIN_BOARD_SIZE = 10;
const MAX_BOARD_SIZE = 30;
const MIN_SPEED = 100;
const MAX_SPEED = 400;

const SnakeSettings: React.FC<SnakeSettingsProps> = ({
  currentSettings,
  onApply,
  onClose,
}) => {
  const { t } = useTranslation();
  const [boardSize, setBoardSize] = React.useState(currentSettings.boardSize);
  const [speed, setSpeed] = React.useState(currentSettings.initialSpeed);
  const [enableWalls, setEnableWalls] = React.useState(currentSettings.enableWalls);
  const [enablePowerUps, setEnablePowerUps] = React.useState(currentSettings.enablePowerUps);

  const handleApply = () => {
    onApply({
      boardSize,
      initialSpeed: speed,
      enableWalls,
      enablePowerUps,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {t('snake.settings.title')}
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-white mb-2">
              {t('snake.settings.board_size')} ({boardSize})
            </label>
            <input
              type="range"
              min={MIN_BOARD_SIZE}
              max={MAX_BOARD_SIZE}
              value={boardSize}
              onChange={(e) => setBoardSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-white mb-2">
              {t('snake.settings.speed')} ({MAX_SPEED - speed + MIN_SPEED}ms)
            </label>
            <input
              type="range"
              min={MIN_SPEED}
              max={MAX_SPEED}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white">{t('snake.settings.enable_walls')}</span>
            <button
              onClick={() => setEnableWalls(!enableWalls)}
              className={`w-16 h-8 rounded-full transition-colors duration-300 ${
                enableWalls ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                  enableWalls ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white">{t('snake.settings.enable_powerups')}</span>
            <button
              onClick={() => setEnablePowerUps(!enablePowerUps)}
              className={`w-16 h-8 rounded-full transition-colors duration-300 ${
                enablePowerUps ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                  enablePowerUps ? 'translate-x-8' : 'translate-x-1'
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
            {t('snake.settings.cancel')}
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300"
          >
            {t('snake.settings.apply')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnakeSettings;
