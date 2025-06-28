import { useState, useCallback } from 'react';
import type { Board, Piece } from './ChineseChessLogic';
import { initializeBoard, isValidMove, movePiece, isCheckmate, isStalemate } from './ChineseChessLogic';

export type GameStatus = 'playing' | 'red-wins' | 'black-wins' | 'draw';

export interface MoveInfo {
  pieceType: Piece['type'];
  startPosition: [number, number];
  endPosition: [number, number];
  player: 'red' | 'black';
}

interface GameState {
  board: Board;
  currentPlayer: 'red' | 'black';
  selectedPiece: { position: [number, number], piece: Piece } | null;
  gameStatus: GameStatus;
  boardHistory: Board[];
  moveHistory: MoveInfo[];
  historyPointer: number;
}

export const useChineseChessState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialBoard = initializeBoard();
    return {
      board: initialBoard,
      currentPlayer: 'red',
      selectedPiece: null,
      gameStatus: 'playing',
      boardHistory: [initialBoard],
      moveHistory: [],
      historyPointer: 0,
    };
  });

  const handleSquareClick = useCallback((row: number, col: number) => {
    if (gameState.gameStatus !== 'playing') return; // Game is over

    const clickedPiece = gameState.board[row][col];

    if (gameState.selectedPiece) {
      const [startRow, startCol] = gameState.selectedPiece.position;
      const startPiece = gameState.board[startRow][startCol];

      if (startPiece && isValidMove(gameState.board, [startRow, startCol], [row, col])) {
        const newBoard = movePiece(gameState.board, [startRow, startCol], [row, col]);
        const nextPlayer = gameState.currentPlayer === 'red' ? 'black' : 'red';

        // Check for checkmate/stalemate after the move
        let newGameStatus: GameStatus = 'playing';
        const opponentColor = nextPlayer; // The player whose turn it is next
        const currentPlayerAfterMove = gameState.currentPlayer; // The player who just made the move

        if (isCheckmate(newBoard, opponentColor)) {
          newGameStatus = currentPlayerAfterMove === 'red' ? 'red-wins' : 'black-wins';
        } else if (isStalemate(newBoard, opponentColor)) {
          newGameStatus = currentPlayerAfterMove === 'red' ? 'red-wins' : 'black-wins'; // Stalemate is a loss in Chinese Chess
        }

        setGameState(prev => {
          const newBoardHistory = prev.boardHistory.slice(0, prev.historyPointer + 1);
          newBoardHistory.push(newBoard);

          const newMoveHistory = prev.moveHistory.slice(0, prev.historyPointer);
          newMoveHistory.push({
            pieceType: startPiece.type,
            startPosition: [startRow, startCol],
            endPosition: [row, col],
            player: prev.currentPlayer,
          });

          return {
            ...prev,
            board: newBoard,
            currentPlayer: nextPlayer,
            selectedPiece: null,
            gameStatus: newGameStatus,
            boardHistory: newBoardHistory,
            moveHistory: newMoveHistory,
            historyPointer: newBoardHistory.length - 1,
          };
        });
      } else {
        // Invalid move, deselect or select new piece if it's current player's
        if (clickedPiece && clickedPiece.color === gameState.currentPlayer) {
          setGameState(prev => ({ ...prev, selectedPiece: { position: [row, col], piece: clickedPiece } }));
        } else {
          setGameState(prev => ({ ...prev, selectedPiece: null }));
        }
      }
    } else if (clickedPiece && clickedPiece.color === gameState.currentPlayer) {
      // No piece selected, select the clicked piece if it belongs to the current player
      setGameState(prev => ({ ...prev, selectedPiece: { position: [row, col], piece: clickedPiece } }));
    }
  }, [gameState]);

  const undo = useCallback(() => {
    setGameState(prev => {
      if (prev.historyPointer > 0) {
        const newPointer = prev.historyPointer - 1;
        return {
          ...prev,
          board: prev.boardHistory[newPointer],
          historyPointer: newPointer,
          gameStatus: 'playing', // Reset game status on undo
        };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setGameState(prev => {
      if (prev.historyPointer < prev.boardHistory.length - 1) {
        const newPointer = prev.historyPointer + 1;
        return {
          ...prev,
          board: prev.boardHistory[newPointer],
          historyPointer: newPointer,
          gameStatus: 'playing', // Reset game status on redo
        };
      }
      return prev;
    });
  }, []);

  const resetGame = useCallback(() => {
    const initialBoard = initializeBoard();
    setGameState({
      board: initialBoard,
      currentPlayer: 'red',
      selectedPiece: null,
      gameStatus: 'playing',
      boardHistory: [initialBoard],
      moveHistory: [],
      historyPointer: 0,
    });
  }, []);

  // Add useEffects for game status changes (win/loss/draw conditions)

  return {
    gameState,
    handleSquareClick,
    resetGame,
    undo,
    redo,
  };
};