import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { useGameState } from '../games/2048/useGameState'; // This is specific to 2048

// Dynamically import game components
const gameComponents: Record<string, () => Promise<{ default: React.FC<GameProps> }>> = {
  '2048': () => import('../games/2048/Game2048'),
  'minesweeper': () => import('../games/minesweeper'),
  'tic-tac-toe': () => import('../games/tic-tac-toe'),
  'go': () => import('../games/go'),
  // Add more games here
};

interface GameProps {
  navigate: (path: string) => void;
  gameStatus?: 'playing' | 'won' | 'lost'; // Made optional, each game can manage its own status
}

const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [GameComponent, setGameComponent] = useState<React.FC<GameProps> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const { gameStatus } = useGameState(); // Removed as it's 2048 specific

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
          setError("Oops! We couldn't load the game. Please try again or select another game.");
          setLoading(false);
        });
    } else {
      setError("Sorry, the game you're looking for doesn't exist.");
      setLoading(false);
      setGameComponent(null);
    }
  }, [gameId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center flex-grow text-2xl font-semibold text-purple-700">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        Loading Game Awesomeness...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center flex-grow text-center p-4">
        <h2 className="text-3xl font-bold text-red-500 mb-4">Something Went Wrong</h2>
        <p className="text-xl text-gray-700 mb-6">{error}</p>
        <button 
          onClick={() => navigate('/')} 
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 text-lg"
        >
          Back to Game Selection
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center flex-grow w-full">
      {/* Pass gameStatus only if GameComponent expects it, or adjust GameComponent props */}
      {GameComponent ? <GameComponent navigate={navigate} /* gameStatus={gameStatus} */ /> : 
        <div className="text-xl text-gray-500">Game component could not be rendered.</div>
      }
    </div>
  );
};

export default GamePage;
