import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto p-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg shadow-xl">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 text-white drop-shadow-lg">Welcome to Our Awesome Game Arcade!</h1>
        <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Dive into a world of fun and challenge with our curated collection of classic and modern static games. 
          Ready to play?
        </p>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Game Card for 2048 */}
        <Link 
          to="/games/2048" 
          className="block bg-white rounded-xl shadow-2xl hover:shadow-purple-400/50 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-3 text-purple-700 group-hover:text-blue-600 transition-colors">2048 Game</h2>
            <p className="text-gray-700 mb-4">A highly addictive number puzzle. Combine tiles to reach the 2048 tile!</p>
            <span className="inline-block bg-purple-500 group-hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
              Play Now
            </span>
          </div>
        </Link>
        
        {/* Placeholder for another game card - you can duplicate and modify this structure */}
        <div 
          className="block bg-white rounded-xl shadow-2xl hover:shadow-green-400/50 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-3 text-green-700 group-hover:text-teal-600 transition-colors">Coming Soon!</h2>
            <p className="text-gray-700 mb-4">We're working on adding more exciting games. Stay tuned!</p>
            <span className="inline-block bg-gray-300 text-gray-500 text-sm font-semibold px-4 py-2 rounded-full">
              Stay Tuned
            </span>
          </div>
        </div>
        {/* Add more game cards here by duplicating the structure above */}
      </div>
    </div>
  );
};

export default HomePage;
