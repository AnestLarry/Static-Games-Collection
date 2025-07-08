import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg shadow-xl">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 text-white drop-shadow-lg">{t('title')}</h1>
        <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          {t('description')}
        </p>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Game Card for 2048 */}
        <Link 
          to="/games/2048" 
          className="block bg-white rounded-xl shadow-2xl hover:shadow-purple-400/50 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-3 text-purple-700 group-hover:text-blue-600 transition-colors">{t('games.2048')}</h2>
            <p className="text-gray-700 mb-4">{t('games.2048_description')}</p>
            <span className="inline-block bg-purple-500 group-hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
              {t('play_now')}
            </span>
          </div>
        </Link>

        {/* Game Card for Minesweeper */}
        <Link 
          to="/games/minesweeper" 
          className="block bg-white rounded-xl shadow-2xl hover:shadow-blue-400/50 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-3 text-blue-700 group-hover:text-sky-600 transition-colors">{t('games.minesweeper')}</h2>
            <p className="text-gray-700 mb-4">{t('games.minesweeper_description')}</p>
            <span className="inline-block bg-blue-500 group-hover:bg-sky-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
              {t('play_now')}
            </span>
          </div>
        </Link>
        
        {/* Game Card for Tic-Tac-Toe */}
        <Link 
          to="/games/tic-tac-toe" 
          className="block bg-white rounded-xl shadow-2xl hover:shadow-green-400/50 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-3 text-green-700 group-hover:text-teal-600 transition-colors">{t('games.tic-tac-toe')}</h2>
            <p className="text-gray-700 mb-4">{t('games.tic-tac-toe_description')}</p>
            <span className="inline-block bg-green-500 group-hover:bg-teal-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
              {t('play_now')}
            </span>
          </div>
        </Link>
        <Link 
          to="/games/go" 
          className="block bg-white rounded-xl shadow-2xl hover:shadow-red-400/50 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-3 text-red-700 group-hover:text-orange-600 transition-colors">{t('games.go')}</h2>
            <p className="text-gray-700 mb-4">{t('games.go_description')}</p>
            <span className="inline-block bg-red-500 group-hover:bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
              {t('play_now')}
            </span>
          </div>
        </Link>
        {/* Game Card for Chinese Chess */}
        <Link 
          to="/games/chinese-chess" 
          className="block bg-white rounded-xl shadow-2xl hover:shadow-yellow-400/50 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-3 text-yellow-700 group-hover:text-amber-600 transition-colors">{t('games.chinese-chess')}</h2>
            <p className="text-gray-700 mb-4">{t('games.chinese-chess_description')}</p>
            <span className="inline-block bg-yellow-500 group-hover:bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
              {t('play_now')}
            </span>
          </div>
        </Link>
        {/* Add more game cards here by duplicating the structure above */}
      </div>
    </div>
  );
};

export default HomePage;
