import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Dynamically import game components
const gameComponents: Record<string, () => Promise<{ default: React.ComponentType<object> }>> = {
  '2048': () => import('../games/2048/Game2048'),
  // Add more games here
};

const GamePage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
const [GameComponent, setGameComponent] = useState<React.ComponentType<object> | null>(null);
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
          setError("Failed to load game. Please try again.");
          setLoading(false);
        });
    } else {
      setError("Game not found.");
      setLoading(false);
      setGameComponent(null);
    }
  }, [gameId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading game...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-600 text-xl font-semibold">
        <p>{error}</p>
        <button 
          onClick={() => navigate('/')} 
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-4 left-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-300"
      >
        &larr; Back to Home
      </button>
      {GameComponent ? <GameComponent /> : null}
    </div>
  );
};

export default GamePage;
