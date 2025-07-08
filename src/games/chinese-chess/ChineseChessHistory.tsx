import React from 'react';
import type { MoveInfo } from './useChineseChessState';
import { useTranslation } from 'react-i18next';

interface ChineseChessHistoryProps {
  moveHistory: MoveInfo[];
  historyPointer: number;
}

const ChineseChessHistory: React.FC<ChineseChessHistoryProps> = ({ moveHistory, historyPointer }) => {
  const { t } = useTranslation();

  return (
    <div className="chinese-chess-history p-4 bg-white rounded-lg shadow-md w-64">
      <h3 className="text-xl font-bold mb-4">{t('chinese_chess.move_history')}</h3>
      <div className="overflow-y-auto h-64">
        {moveHistory.map((move, index) => (
          <div
            key={index}
            className={`p-2 mb-1 rounded ${index === historyPointer - 1 ? 'bg-blue-200' : 'bg-gray-100'}`}
          >
            {t(`chinese_chess.${move.player}`)}: {move.pieceType} from ({move.startPosition[0]}, {move.startPosition[1]}) to ({move.endPosition[0]}, {move.endPosition[1]})
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChineseChessHistory;