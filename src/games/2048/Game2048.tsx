import React from 'react';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import ResultModal from './ResultModal';
import { useGameState } from './useGameState';
import GameHeader from './GameHeader';

interface Game2048Props {
  navigate: (path: string) => void;
}

const Game2048: React.FC<Game2048Props> = ({ navigate }) => {
  const {
    grid,
    score,
    bestScore,
    gameStatus,
    move,
    resetGame,
    GRID_SIZE
  } = useGameState();

  return (
    <div className="flex flex-col items-center">
      <GameHeader gameStatus={gameStatus} navigate={navigate} />
      <GameControls move={move}>
        <GameBoard 
          grid={grid}
          score={score}
          bestScore={bestScore}
          GRID_SIZE={GRID_SIZE}
        />
        
        {(gameStatus === 'won' || gameStatus === 'lost') && (
          <ResultModal 
            gameStatus={gameStatus}
            score={score}
            onRestart={resetGame}
          />
        )}
      </GameControls>
    </div>
  );
};

export default Game2048;
