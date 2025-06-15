import React, { useRef, useState } from 'react';

interface ResultModalProps {
  gameStatus: 'won' | 'lost';
  score: number;
  onRestart: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ gameStatus, score, onRestart }) => {
  const [showShareCard, setShowShareCard] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
          ctx.fillText('2048 Game Result', canvas.width/2, 40);
          
          ctx.font = '20px Arial';
          ctx.fillText(`Score: ${score}`, canvas.width/2, 80);
          
          const now = new Date();
          ctx.fillText(now.toLocaleString(), canvas.width/2, 120);
          
          // Convert to image and share
          canvas.toBlob(blob => {
            if (blob && navigator.share) {
              navigator.share({
                title: '2048 Game Result',
                text: `I scored ${score} points in 2048!`,
                files: [new File([blob], '2048-result.png', { type: 'image/png' })]
              }).catch(() => {
                // Fallback if share fails
                canvas.toDataURL('image/png');
                alert('Score copied to clipboard!');
              });
            } else {
              // Fallback for browsers without Web Share API
              canvas.toDataURL('image/png');
              navigator.clipboard.writeText(`I scored ${score} points in 2048!`);
              alert('Score copied to clipboard!');
            }
          }, 'image/png');
        }
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-sm w-full">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          {gameStatus === 'won' ? 'You Win!' : 'Game Over!'}
        </h2>
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
              width={300}
              height={150}
              className="hidden"
            />
            <div className="text-gray-800">
              <h3 className="text-xl font-bold mb-2">2048 Game Result</h3>
              <p className="text-lg">Score: {score}</p>
              <p className="text-sm text-gray-600">{new Date().toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultModal;
