import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface GoSettingsProps {
  onNewGame: (size: number, komi: number, handicap: number) => void;
  onClose: () => void;
  initialSize: number;
  initialKomi: number;
  initialHandicap: number;
}

const GoSettings: React.FC<GoSettingsProps> = ({
  onNewGame,
  onClose,
  initialSize,
  initialKomi,
  initialHandicap,
}) => {
  const { t } = useTranslation();
  const [boardSize, setBoardSize] = useState(initialSize);
  const [komi, setKomi] = useState(initialKomi);
  const [handicap, setHandicap] = useState(initialHandicap);

  const handleStartGame = () => {
    onNewGame(boardSize, komi, handicap);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">{t('go.settings_modal.title')}</h2>

        <div className="mb-4">
          <label htmlFor="boardSize" className="block text-gray-700 text-sm font-bold mb-2">{t('go.settings_modal.board_size')}:</label>
          <select
            id="boardSize"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline appearance-none bg-white pr-8"
            value={boardSize}
            onChange={(e) => setBoardSize(Number(e.target.value))}
          >
            <option value={9}>9x9</option>
            <option value={13}>13x13</option>
            <option value={19}>19x19</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="komi" className="block text-gray-700 text-sm font-bold mb-2">{t('go.settings_modal.komi')}:</label>
          <input
            type="number"
            id="komi"
            step="0.5"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={komi}
            onChange={(e) => setKomi(Number(e.target.value))}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="handicap" className="block text-gray-700 text-sm font-bold mb-2">{t('go.settings_modal.handicap')}:</label>
          <input
            type="number"
            id="handicap"
            min="0"
            max="9"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={handicap}
            onChange={(e) => setHandicap(Number(e.target.value))}
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleStartGame}
            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-105"
          >
            {t('go.settings_modal.start_new_game')}
          </button>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-105"
          >
            {t('go.settings_modal.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoSettings;
