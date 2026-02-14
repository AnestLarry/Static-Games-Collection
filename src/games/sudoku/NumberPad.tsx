import React from 'react';

interface NumberPadProps {
  onNumberClick: (num: number) => void;
  onClear: () => void;
  onHint: () => void;
  onToggleNotes: () => void;
  isNotesMode: boolean;
  usedNumbers: number[];
  disabled?: boolean;
}

const NumberPad: React.FC<NumberPadProps> = ({
  onNumberClick,
  onClear,
  onHint,
  onToggleNotes,
  isNotesMode,
  usedNumbers,
  disabled,
}) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const getNumberCount = (num: number): number => {
    return usedNumbers.filter(n => n === num).length;
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Number buttons */}
      <div className="grid grid-cols-9 gap-1">
        {numbers.map(num => {
          const count = getNumberCount(num);
          const isComplete = count >= 9;

          return (
            <button
              key={num}
              onClick={() => onNumberClick(num)}
              disabled={disabled || isComplete}
              className={`aspect-square rounded-md text-lg font-semibold transition-colors flex flex-col items-center justify-center ${
                isComplete
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
              }`}
            >
              <span>{num}</span>
              {count > 0 && !isComplete && (
                <span className="text-[0.6rem] opacity-70">{9 - count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={onToggleNotes}
          disabled={disabled}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            isNotesMode
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {isNotesMode ? '✏️ Notes ON' : '✏️ Notes'}
        </button>
        <button
          onClick={onClear}
          disabled={disabled}
          className="flex-1 py-2 rounded-md text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={onHint}
          disabled={disabled}
          className="flex-1 py-2 rounded-md text-sm font-medium bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
        >
          💡 Hint
        </button>
      </div>
    </div>
  );
};

export default NumberPad;
