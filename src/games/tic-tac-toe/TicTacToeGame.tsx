import React, { useState, useEffect } from 'react';
import TicTacToeBoard from './TicTacToeBoard';
import TicTacToeSettings from './TicTacToeSettings';
import TicTacToeResultModal from './TicTacToeResultModal';
import {
  initializeBoard,
  checkWin,
  checkDraw,
  makeMove,
  type Board,
  type Player,
  type GameStatus,
} from './TicTacToeLogic';

interface GameProps {
  // navigate: (path: string) => void; // Not currently used within TicTacToeGame
}

const TicTacToeGame: React.FC<GameProps> = () => {
  const [boardSize, setBoardSize] = useState<number>(3);
  const [winCondition, setWinCondition] = useState<number>(3);
  const [piecesPerPlayer, setPiecesPerPlayer] = useState<number | null>(null);

  const [board, setBoard] = useState<Board>(initializeBoard(boardSize));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [playerXMoves, setPlayerXMoves] = useState<number>(0);
  const [playerOMoves, setPlayerOMoves] = useState<number>(0);

  useEffect(() => {
    resetGame();
  }, [boardSize, winCondition, piecesPerPlayer]);

  const handleCellClick = (row: number, col: number) => {
    if (gameStatus !== 'playing' || board[row][col] !== null) {
      return;
    }

    const newBoard = makeMove(
      board,
      row,
      col,
      currentPlayer,
      piecesPerPlayer,
      currentPlayer === 'X' ? playerXMoves : playerOMoves
    );

    if (newBoard) {
      setBoard(newBoard);

      if (currentPlayer === 'X') {
        setPlayerXMoves(prev => prev + 1);
      } else {
        setPlayerOMoves(prev => prev + 1);
      }

      if (checkWin(newBoard, currentPlayer, winCondition)) {
        setGameStatus(currentPlayer === 'X' ? 'X_wins' : 'O_wins');
        setShowResultModal(true);
      } else if (checkDraw(newBoard)) {
        setGameStatus('draw');
        setShowResultModal(true);
      } else {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      }
    }
  };

  const resetGame = () => {
    setBoard(initializeBoard(boardSize));
    setCurrentPlayer('X');
    setGameStatus('playing');
    setShowResultModal(false);
    setPlayerXMoves(0);
    setPlayerOMoves(0);
  };

  const applySettings = (newBoardSize: number, newWinCondition: number, newPiecesPerPlayer: number | null) => {
    setBoardSize(newBoardSize);
    setWinCondition(newWinCondition);
    setPiecesPerPlayer(newPiecesPerPlayer);
    setShowSettings(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-white mb-6">Tic-Tac-Toe</h1>
      <div className="text-xl text-white mb-4">
        {gameStatus === 'playing' ? `Current Player: ${currentPlayer}` : ''}
      </div>

      <TicTacToeBoard board={board} onCellClick={handleCellClick} />

      <div className="mt-6 flex space-x-4">
        <button
          onClick={resetGame}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
        >
          Reset Game
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300"
        >
          Settings
        </button>
      </div>

      {showSettings && (
        <TicTacToeSettings
          currentBoardSize={boardSize}
          currentWinCondition={winCondition}
          currentPiecesPerPlayer={piecesPerPlayer}
          onApply={applySettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showResultModal && (
        <TicTacToeResultModal
          status={gameStatus}
          onClose={() => setShowResultModal(false)}
          onPlayAgain={resetGame}
        />
      )}
    </div>
  );
};

export default TicTacToeGame;
