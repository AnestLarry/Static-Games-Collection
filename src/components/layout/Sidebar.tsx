import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const Sidebar: React.FC = () => {
  return (
    <aside className="w-72 bg-gradient-to-b from-slate-800 to-slate-900 text-slate-100 p-6 flex flex-col shadow-2xl">
      <div className="mb-10 text-center">
        <Link to="/" className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 hover:opacity-80 transition-opacity">
          GameHub
        </Link>
        <p className="text-xs text-slate-400 mt-1">Your Portal to Fun</p>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-3">
          <li>
            <Link 
              to="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200 group"
            >
              {/* Placeholder for an icon */}
              <span className="w-5 h-5 bg-purple-500 rounded-sm group-hover:bg-pink-500 transition-colors"></span> 
              <span className="text-lg font-medium">Home</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/games/2048"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200 group"
            >
              <span className="w-5 h-5 bg-green-500 rounded-sm group-hover:bg-teal-500 transition-colors"></span>
              <span className="text-lg font-medium">2048 Game</span>
            </Link>
          </li>
          {/* Add more game links or other navigation items here */}
          {/* Example of a disabled/coming soon link */}
          <li>
            <span 
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-500 cursor-not-allowed group"
            >
              <span className="w-5 h-5 bg-slate-600 rounded-sm"></span>
              <span className="text-lg font-medium">More Games (Soon)</span>
            </span>
          </li>
        </ul>
      </nav>
      <div className="mt-auto pt-6 border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center">
          &copy; {new Date().getFullYear()} GameHub Adventures
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;