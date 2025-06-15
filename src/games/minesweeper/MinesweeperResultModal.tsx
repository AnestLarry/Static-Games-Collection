import React from 'react';

interface MinesweeperResultModalProps {
  status: 'won' | 'lost';
  time: number; // Time in seconds
  onRestart: () => void;
  onClose: () => void;
}

const MinesweeperResultModal: React.FC<MinesweeperResultModalProps> = ({ status, time, onRestart, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl text-center max-w-sm w-full">
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${status === 'won' ? 'text-green-500' : 'text-red-500'}`}>
          {status === 'won' ? 'You Win! 😎' : 'Game Over 😵'}
        </h2>
        <p className="text-lg text-gray-700 mb-1">Your time: {time} seconds</p>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={onRestart}
            className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 text-lg font-semibold"
          >
            New Game
          </button>
          {/* <button 
            onClick={onClose} 
            className="w-full sm:w-auto px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-300 text-lg font-semibold"
          >
            Close
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default MinesweeperResultModal;