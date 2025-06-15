import React, { useEffect, useCallback } from 'react';
import { Direction } from './GameLogic';
import { useSwipeable } from 'react-swipeable';

interface GameControlsProps {
  move: (direction: Direction) => void;
  children: React.ReactNode;
}

const GameControls: React.FC<GameControlsProps> = ({ move, children }) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const keyToDirection: Record<string, Direction> = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'w': 'up',
      's': 'down',
      'a': 'left',
      'd': 'right'
    };

    const direction = keyToDirection[e.key];
    if (direction) {
      e.preventDefault();
      move(direction);
    }
  }, [move]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => move('left'),
    onSwipedRight: () => move('right'),
    onSwipedUp: () => move('up'),
    onSwipedDown: () => move('down'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <div className='w-full h-full flex flex-col justify-center items-center' {...swipeHandlers}>
      {children}
    </div>
  );
};

export default GameControls;
