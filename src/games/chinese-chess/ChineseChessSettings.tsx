import React from 'react';

interface ChineseChessSettingsProps {
  onClose: () => void;
}

const ChineseChessSettings: React.FC<ChineseChessSettingsProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
        <h2 className="text-2xl font-bold mb-4">Game Settings</h2>
        {/* Settings options will go here */}
        <p>Settings content coming soon...</p>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ChineseChessSettings;