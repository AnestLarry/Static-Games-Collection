import React from 'react';

interface ChineseChessControlsProps {
  onReset: () => void;
  onOpenSettings: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onToggleHistory: () => void;
  isHistoryVisible: boolean;
  onToggleFocusMode: () => void; // New prop
  isFocusMode: boolean; // New prop
}

const ChineseChessControls: React.FC<ChineseChessControlsProps> = ({ onReset, onOpenSettings, onUndo, onRedo, canUndo, canRedo, onToggleHistory, isHistoryVisible, onToggleFocusMode, isFocusMode }) => {
  return (
    <div className="chinese-chess-controls flex flex-col space-y-4 p-4 bg-white rounded-lg shadow-md">
      <button
        onClick={onReset}
        className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300"
      >
        Reset Game
      </button>
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors duration-300 ${canUndo ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
      >
        Undo
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors duration-300 ${canRedo ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
      >
        Redo
      </button>
      <button
        onClick={onOpenSettings}
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
      >
        Settings
      </button>
      <button
        onClick={onToggleHistory}
        className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors duration-300 ${isHistoryVisible ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
      >
        {isHistoryVisible ? 'Hide History' : 'Show History'}
      </button>
      <button
        onClick={onToggleFocusMode}
        className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors duration-300 ${isFocusMode ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
      >
        {isFocusMode ? 'Exit Focus Mode' : 'Focus Mode'}
      </button>
    </div>
  );
};

export default ChineseChessControls;