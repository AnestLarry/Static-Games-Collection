import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import {
  HomeIcon,
  Game2048Icon,
  MinesweeperIcon,
  GoIcon,
  ChineseChessIcon,
  SnakeIcon,
  TetrisIcon,
  SudokuIcon,
  MoreGamesIcon,
} from './GameIcons';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <aside className={`bg-gradient-to-b from-slate-800 to-slate-900 text-slate-100 flex flex-col shadow-2xl transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20 px-2 py-6' : 'w-72 p-6'}`}>
      <div className="mb-10 text-center">
        <Link to="/" className={`text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 hover:opacity-80 transition-opacity ${isCollapsed ? 'text-xl' : 'text-3xl'}`}>
          {isCollapsed ? 'GH' : 'GameHub'}
        </Link>
        {!isCollapsed && <p className="text-xs text-slate-400 mt-1">{t('sidebar.portal')}</p>}
      </div>
      <nav className="flex-grow">
        <ul className="space-y-3">
          <li>
            <Link
              to="/"
              className={`flex items-center rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200 group ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3 space-x-3'}`}
            >
              <HomeIcon className="w-5 h-5 text-purple-500 group-hover:text-pink-500 transition-colors" />
              {!isCollapsed && <span className="text-lg font-medium">{t('home')}</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/games/2048"
              className={`flex items-center rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200 group ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3 space-x-3'}`}
            >
              <Game2048Icon className="w-5 h-5 text-green-500 group-hover:text-teal-500 transition-colors" />
              {!isCollapsed && <span className="text-lg font-medium">{t('games.2048')}</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/games/minesweeper"
              className={`flex items-center rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200 group ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3 space-x-3'}`}
            >
              <MinesweeperIcon className="w-5 h-5 text-blue-500 group-hover:text-sky-500 transition-colors" />
              {!isCollapsed && <span className="text-lg font-medium">{t('games.minesweeper')}</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/games/go"
              className={`flex items-center rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200 group ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3 space-x-3'}`}
            >
              <GoIcon className="w-5 h-5 text-red-500 group-hover:text-orange-500 transition-colors" />
              {!isCollapsed && <span className="text-lg font-medium">{t('games.go')}</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/games/chinese-chess"
              className={`flex items-center rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200 group ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3 space-x-3'}`}
            >
              <ChineseChessIcon className="w-5 h-5 text-yellow-500 group-hover:text-amber-500 transition-colors" />
              {!isCollapsed && <span className="text-lg font-medium">{t('games.chinese-chess')}</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/games/snake"
              className={`flex items-center rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200 group ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3 space-x-3'}`}
            >
              <SnakeIcon className="w-5 h-5 text-green-600 group-hover:text-emerald-500 transition-colors" />
              {!isCollapsed && <span className="text-lg font-medium">{t('games.snake')}</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/games/tetris"
              className={`flex items-center rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200 group ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3 space-x-3'}`}
            >
              <TetrisIcon className="w-5 h-5 text-cyan-500 group-hover:text-teal-500 transition-colors" />
              {!isCollapsed && <span className="text-lg font-medium">{t('games.tetris')}</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/games/sudoku"
              className={`flex items-center rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200 group ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3 space-x-3'}`}
            >
              <SudokuIcon className="w-5 h-5 text-indigo-500 group-hover:text-violet-500 transition-colors" />
              {!isCollapsed && <span className="text-lg font-medium">{t('games.sudoku')}</span>}
            </Link>
          </li>
          <li>
            <span
              className={`flex items-center rounded-lg text-slate-500 cursor-not-allowed group ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3 space-x-3'}`}
            >
              <MoreGamesIcon className="w-5 h-5 text-slate-600 group-hover:text-slate-500 transition-colors" />
              {!isCollapsed && <span className="text-lg font-medium">{t('sidebar.more_games')}</span>}
            </span>
          </li>
        </ul>
      </nav>
      <div className="mt-auto pt-6 border-t border-slate-700">
        {!isCollapsed && (
          <div className="mb-4">
            <label htmlFor="language-select" className="sr-only">{t('language')}</label>
            <select 
              id="language-select"
              onChange={(e) => changeLanguage(e.target.value)} 
              value={i18n.language}
              className="w-full p-2 bg-slate-700 text-slate-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="en">English</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
            </select>
          </div>
        )}
        {!isCollapsed && (
          <p className="text-xs text-slate-500 text-center">
            &copy; {new Date().getFullYear()} GameHub Adventures
          </p>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mt-4 w-full flex items-center justify-center p-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRightIcon className="h-6 w-6" /> : <ChevronLeftIcon className="h-6 w-6" />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
