import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Dynamically import game components
const gameComponents: Record<string, () => Promise<{ default: React.FC<GameProps> }>> = {
  '2048': () => import('../games/2048/Game2048'),
  'minesweeper': () => import('../games/minesweeper'),
  'tic-tac-toe': () => import('../games/tic-tac-toe'),
  'go': () => import('../games/go'),
  'chinese-chess': () => import('../games/chinese-chess'),
  'snake': () => import('../games/snake'),
  'tetris': () => import('../games/tetris'),
  'sudoku': () => import('../games/sudoku'),
  // Add more games here
};

interface GameProps {
  navigate: (path: string) => void;
  gameStatus?: 'playing' | 'won' | 'lost'; // Made optional, each game can manage its own status
}

const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [GameComponent, setGameComponent] = useState<React.FC<GameProps> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (gameId && gameComponents[gameId]) {
      setLoading(true);
      setError(null);
      gameComponents[gameId]()
        .then(module => {
          setGameComponent(() => module.default);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load game component:", err);
          setError(t('game_page.load_error'));
          setLoading(false);
        });
    } else {
      setError(t('game_page.not_found'));
      setLoading(false);
      setGameComponent(null);
    }
  }, [gameId, t]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center flex-grow text-2xl font-semibold text-purple-700">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        {t('game_page.loading')}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center flex-grow text-center p-4">
        <h2 className="text-3xl font-bold text-red-500 mb-4">{t('game_page.error_title')}</h2>
        <p className="text-xl text-gray-700 mb-6">{error}</p>
        <button 
          onClick={() => navigate('/')} 
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 text-lg"
        >
          {t('game_page.back_button')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center flex-grow w-full">
      {GameComponent ? <GameComponent navigate={navigate} /> : 
        <div className="text-xl text-gray-500">{t('game_page.render_error')}</div>
      }
    </div>
  );
};

export default GamePage;
