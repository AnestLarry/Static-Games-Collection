import { useState, useEffect } from 'react';
import { 
  type Grid, type Direction, 
  initializeGrid, moveTiles, 
  addRandomTile, isGameOver, 
  hasWon, GRID_SIZE 
} from './GameLogic';

export const useGameState = () => {
  const [grid, setGrid] = useState<Grid>(initializeGrid());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [moved, setMoved] = useState(false);

  // Load best score from localStorage
  useEffect(() => {
    const savedBest = localStorage.getItem('2048-best-score');
    if (savedBest) {
      setBestScore(parseInt(savedBest));
    }
  }, []);

  // Save best score to localStorage when it changes
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('2048-best-score', score.toString());
    }
  }, [score, bestScore]);

  // Check game status after each move
  useEffect(() => {
    if (hasWon(grid)) {
      setGameStatus('won');
    } else if (isGameOver(grid)) {
      setGameStatus('lost');
    }
  }, [grid]);

  const move = (direction: Direction) => {
    if (gameStatus !== 'playing') return;

    const { grid: newGrid, score: moveScore } = moveTiles(grid, direction);
    
    // Only proceed if grid changed
    if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
      setGrid(newGrid);
      setScore(prev => prev + moveScore);
      setMoved(true);
    }
  };

  // Add new tile after move completes
  useEffect(() => {
    if (moved && gameStatus === 'playing') {
      const newGrid = [...grid];
      addRandomTile(newGrid);
      setGrid(newGrid);
      setMoved(false);
    }
  }, [moved, grid, gameStatus]);

  const resetGame = () => {
    setGrid(initializeGrid());
    setScore(0);
    setGameStatus('playing');
  };

  return {
    grid,
    score,
    bestScore,
    gameStatus,
    move,
    resetGame,
    GRID_SIZE
  };
};
