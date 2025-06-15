import React from 'react';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import ResultModal from './ResultModal';
import { useGameState } from './useGameState';

const Game2048: React.FC = () => {
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
  );
};

export default Game2048;
