import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Game Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Game Card for 2048 */}
        <Link to="/games/2048" className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">2048 Game</h2>
            <p className="text-gray-600">A classic number puzzle game.</p>
          </div>
        </Link>
        {/* Add more game cards here */}
      </div>
    </div>
  );
};

export default HomePage;
