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
  const [mergedCellsState, setMergedCellsState] = useState<[number, number][]>([]);

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

    const { grid: newGrid, score: moveScore, mergedCells } = moveTiles(grid, direction);
    
    // Only proceed if grid changed
    if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
      setGrid(newGrid);
      setScore(prev => prev + moveScore);
      setMergedCellsState(mergedCells);
      setMoved(true);
    } else {
      setMergedCellsState([]); // Clear merged cells if no move happened
    }
  };

  // Add new tile after move completes
  useEffect(() => {
    if (moved && gameStatus === 'playing') {
      const newGridWithRandom = [...grid]; // Use the grid that was just updated by setGrid
      addRandomTile(newGridWithRandom);
      setGrid(newGridWithRandom);
      setMoved(false);
      // Clear merged cells after a new tile is added and grid is updated
      // Or, if you want the animation to persist until the next move, clear it in the move function before new merges.
      // For now, let's clear it here to signify the end of the current move's visual effect.
      // setMergedCellsState([]); 
    }
  }, [moved, grid, gameStatus]); // Ensure grid is a dependency if newGridWithRandom is based on it.

  const resetGame = () => {
    setGrid(initializeGrid());
    setScore(0);
    setGameStatus('playing');
    setMergedCellsState([]);
  };

  return {
    grid,
    score,
    bestScore,
    gameStatus,
    move,
    resetGame,
    GRID_SIZE,
    mergedCells: mergedCellsState // Expose mergedCellsState
  };
};
