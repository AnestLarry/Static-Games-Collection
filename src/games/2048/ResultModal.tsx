import React, { useRef, useState } from 'react';

interface ResultModalProps {
  gameStatus: 'won' | 'lost';
  score: number;
  onRestart: () => void;
  onClose: () => void;
  grid: number[][]; // Added for sharing game state
}

const ResultModal: React.FC<ResultModalProps> = ({ gameStatus, score, onRestart, onClose, grid }) => {
  const [showShareCard, setShowShareCard] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const gridToString = (currentGrid: number[][]): string => {
    return currentGrid.map(row => row.join('\t')).join('\n');
  };

  const handleShare = () => {
    setShowShareCard(true);
    
    // Generate share card image
    setTimeout(() => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Draw share card
          ctx.fillStyle = '#faf8ef';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.fillStyle = '#776e65';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('2048 Game Result', canvas.width/2, 30);
          
          ctx.font = '18px Arial';
          ctx.fillText(`Score: ${score}`, canvas.width/2, 60);

          // Draw grid
          const tileSize = 20;
          const padding = 2;
          const gridSize = grid.length * (tileSize + padding) - padding;
          const startX = (canvas.width - gridSize) / 2;
          const startY = 80;

          grid.forEach((row, i) => {
            row.forEach((cell, j) => {
              ctx.fillStyle = cell > 0 ? '#cdc1b4' : '#eee4da'; // Simplified colors for share card
              ctx.fillRect(startX + j * (tileSize + padding), startY + i * (tileSize + padding), tileSize, tileSize);
              if (cell > 0) {
                ctx.fillStyle = '#776e65';
                ctx.font = 'bold 10px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(cell.toString(), startX + j * (tileSize + padding) + tileSize / 2, startY + i * (tileSize + padding) + tileSize / 2);
              }
            });
          });
          
          const now = new Date();
          ctx.font = '12px Arial';
          ctx.fillText(now.toLocaleDateString(), canvas.width/2, startY + gridSize + 20);
          
          // Convert to image and share
          canvas.toBlob(blob => {
            const shareText = `I scored ${score} points in 2048!\nGame Board:\n${gridToString(grid)}`;
            if (blob && navigator.share) {
              navigator.share({
                title: '2048 Game Result',
                text: shareText,
                files: [new File([blob], '2048-result.png', { type: 'image/png' })]
              }).catch(() => {
                // Fallback if share fails
                navigator.clipboard.writeText(shareText);
                alert('Result copied to clipboard!');
              });
            } else {
              // Fallback for browsers without Web Share API
              navigator.clipboard.writeText(shareText);
              alert('Result copied to clipboard!');
            }
          }, 'image/png');
        }
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800">
            {gameStatus === 'won' ? 'You Win!' : 'Game Over!'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-xl text-gray-700 mb-6">Your score: {score}</p>
        
        <div className="flex justify-center space-x-4">
          <button 
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 text-lg font-semibold"
            onClick={onRestart}
          >
            New Game
          </button>
          <button 
            className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300 text-lg font-semibold"
            onClick={handleShare}
          >
            Share
          </button>
        </div>

        {showShareCard && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md border border-gray-300">
            <canvas 
              ref={canvasRef}
              width={300} // Adjusted for grid display
              height={250} // Adjusted for grid display
              className="hidden"
            />
            {/* Preview of share card can be removed or kept based on preference */}
            {/* <div className="text-gray-800">
              <h3 className="text-xl font-bold mb-2">2048 Game Result</h3>
              <p className="text-lg">Score: {score}</p>
              <p className="text-sm text-gray-600">Grid will be included in share.</p>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultModal;
