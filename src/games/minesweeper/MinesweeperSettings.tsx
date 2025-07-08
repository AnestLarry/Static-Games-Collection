import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type GameSettings } from './game';

interface MinesweeperSettingsProps {
  currentSettings: GameSettings;
  onStartGame: (settings: GameSettings) => void;
  onCancel?: () => void;
}

const MinesweeperSettings: React.FC<MinesweeperSettingsProps> = ({ currentSettings, onStartGame, onCancel }) => {
  const { t } = useTranslation();
  const [rows, setRows] = useState(currentSettings.rows);
  const [cols, setCols] = useState(currentSettings.cols);
  const [mines, setMines] = useState(currentSettings.mines);
  const [error, setError] = useState<string | null>(null);

  const MAX_ROWS = 30;
  const MAX_COLS = 50;
  const MIN_ROWS_COLS = 5;
  const MIN_MINES = 1;

  const handleStart = () => {
    const numRows = Number(rows);
    const numCols = Number(cols);
    const numMines = Number(mines);

    if (numRows < MIN_ROWS_COLS || numRows > MAX_ROWS || numCols < MIN_ROWS_COLS || numCols > MAX_COLS) {
      setError(t('minesweeper.settings.grid_size_error', { MIN_ROWS_COLS, MAX_ROWS, MAX_COLS }));
      return;
    }
    if (numMines < MIN_MINES || numMines >= numRows * numCols) {
      setError(t('minesweeper.settings.mines_error', { MIN_MINES, max_mines: numRows * numCols - 1 }));
      return;
    }
    setError(null);
    onStartGame({ rows: numRows, cols: numCols, mines: numMines });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">{t('minesweeper.settings.title')}</h2>
        
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4 text-sm">{error}</p>}

        <div className="space-y-4">
          <div>
            <label htmlFor="rows" className="block text-sm font-medium text-gray-700 mb-1">{t('minesweeper.settings.rows', { MIN_ROWS_COLS, MAX_ROWS })}:</label>
            <input 
              type="number" 
              id="rows" 
              value={rows} 
              onChange={(e) => setRows(parseInt(e.target.value, 10))} 
              min={MIN_ROWS_COLS}
              max={MAX_ROWS}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="cols" className="block text-sm font-medium text-gray-700 mb-1">{t('minesweeper.settings.cols', { MIN_ROWS_COLS, MAX_COLS })}:</label>
            <input 
              type="number" 
              id="cols" 
              value={cols} 
              onChange={(e) => setCols(parseInt(e.target.value, 10))} 
              min={MIN_ROWS_COLS}
              max={MAX_COLS}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="mines" className="block text-sm font-medium text-gray-700 mb-1">{t('minesweeper.settings.mines', { MIN_MINES, max_mines: rows * cols - 1 })}:</label>
            <input 
              type="number" 
              id="mines" 
              value={mines} 
              onChange={(e) => setMines(parseInt(e.target.value, 10))} 
              min={MIN_MINES}
              max={rows * cols > 0 ? rows * cols -1 : 1}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={handleStart} 
            className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 text-lg font-semibold"
          >
            {t('minesweeper.settings.start_game')}
          </button>
          {onCancel && (
            <button 
              onClick={onCancel} 
              className="w-full sm:w-auto px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-300 text-lg font-semibold"
            >
              {t('minesweeper.settings.cancel')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinesweeperSettings;
