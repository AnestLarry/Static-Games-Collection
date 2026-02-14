import React from 'react';
import { PIECE_SHAPES, PIECE_COLORS, type PieceType } from './TetrisLogic';

interface NextPiecePreviewProps {
  pieceType: PieceType | null;
}

const NextPiecePreview: React.FC<NextPiecePreviewProps> = ({ pieceType }) => {
  if (!pieceType) {
    return (
      <div className="bg-gray-700 p-2 rounded-lg">
        <div className="w-16 h-16" />
      </div>
    );
  }

  const shape = PIECE_SHAPES[pieceType];
  const colorClass = PIECE_COLORS[pieceType];

  return (
    <div className="bg-gray-700 p-2 rounded-lg">
      <div
        className="grid gap-px"
        style={{
          gridTemplateColumns: `repeat(4, 16px)`,
          gridTemplateRows: `repeat(4, 16px)`,
        }}
      >
        {Array(4)
          .fill(null)
          .map((_, rowIndex) =>
            Array(4)
              .fill(null)
              .map((_, colIndex) => {
                const isActive = shape[rowIndex]?.[colIndex] === 1;
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`${isActive ? colorClass : 'bg-gray-700'} ${
                      isActive ? 'border border-white/20' : ''
                    }`}
                    style={{ width: 16, height: 16 }}
                  />
                );
              })
          )}
      </div>
    </div>
  );
};

export default NextPiecePreview;
