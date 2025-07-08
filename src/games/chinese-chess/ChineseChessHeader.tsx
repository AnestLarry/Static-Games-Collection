import React from 'react';
import type { GameStatus } from './useChineseChessState';
import { useTranslation } from 'react-i18next';

interface ChineseChessHeaderProps {
  currentPlayer: 'red' | 'black';
  gameStatus: GameStatus;
}

const ChineseChessHeader: React.FC<ChineseChessHeaderProps> = ({ currentPlayer, gameStatus }) => {
  const { t } = useTranslation();

  const statusMessage = () => {
    switch (gameStatus) {
      case 'playing':
        return t('chinese_chess.current_turn', { player: t(`chinese_chess.${currentPlayer}`) });
      case 'red-wins':
        return t('chinese_chess.red_wins');
      case 'black-wins':
        return t('chinese_chess.black_wins');
      case 'draw':
        return t('chinese_chess.draw');
      default:
        return '';
    }
  };

  return (
    <div className="chinese-chess-header text-center mb-4">
      <h2 className="text-2xl font-semibold text-gray-700">{statusMessage()}</h2>
    </div>
  );
};

export default ChineseChessHeader;