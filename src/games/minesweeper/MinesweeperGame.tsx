import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { type GameState, initializeGame, revealCell, toggleFlag, autoCalc, type Cell, type GameSettings, autoFlagCertainMines, flagOneCertainMine, openOneCertainEmptyCell, openAllCertainEmptyCells } from './game';
import MinesweeperResultModal from "./MinesweeperResultModal";
import MinesweeperSettings from "./MinesweeperSettings";

const DEFAULT_SETTINGS: GameSettings = {
  rows: 10,
  cols: 10,
  mines: 15,
  safeFirstClick: true,
};

const MinesweeperGame: React.FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [gameState, setGameState] = useState<GameState>(() =>
    initializeGame(settings)
  );
  const [showSettings, setShowSettings] = useState(true);
  const [showResultModal, setShowResultModal] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const newGame = useCallback(
    (newSettings?: GameSettings) => {
      const currentSettings = newSettings || settings;
      if (newSettings) setSettings(newSettings);
      setGameState(initializeGame(currentSettings));
      setShowResultModal(false);
      setShowSettings(false);
    },
    [settings]
  );

  useEffect(() => {
    if (gameState.status === "won" || gameState.status === "lost") {
      setShowResultModal(true);
    }
    if (gameState.status === "playing") {
      if (gameState.startTime === null) {
        setTimeElapsed(0);
      } else {
        setTimeElapsed(Math.floor((Date.now() - gameState.startTime) / 1000));
      }
    } else if (gameState.status === "won" || gameState.status === "lost") {
      if (gameState.startTime && gameState.endTime) {
        setTimeElapsed(
          Math.floor((gameState.endTime - gameState.startTime) / 1000)
        );
      } else if (gameState.startTime) {
        setTimeElapsed(Math.floor((Date.now() - gameState.startTime) / 1000));
      } else {
        setTimeElapsed(0);
      }
    } else {
      setTimeElapsed(0);
    }
  }, [gameState.status, gameState.startTime, gameState.endTime]);

  useEffect(() => {
    let timerInterval: ReturnType<typeof setInterval>;
    if (gameState.status === "playing" && gameState.startTime !== null) {
      setTimeElapsed(Math.floor((Date.now() - gameState.startTime) / 1000));
      timerInterval = setInterval(() => {
        if (gameState.startTime) {
          setTimeElapsed(Math.floor((Date.now() - gameState.startTime) / 1000));
        }
      }, 1000);
    }
    return () => {
      clearInterval(timerInterval);
    };
  }, [gameState.status, gameState.startTime]);

  const handleCellClick = (row: number, col: number) => {
    if (gameState.status === "lost" || gameState.status === "won") return;
    setGameState((prev) => revealCell(prev, row, col));
  };

  const handleCellRightClick = (
    event: React.MouseEvent<HTMLDivElement>,
    row: number,
    col: number
  ) => {
    event.preventDefault();
    if (gameState.status !== "playing") return;
    setGameState((prev) => toggleFlag(prev, row, col));
  };

  const getCellDisplay = (cell: Cell): string | React.ReactNode => {
    switch (cell.state) {
      case "hidden":
        return "";
      case "flagged":
        return "🚩";
      case "auto_flagged":
        return "🚩✨";
      case "mine_revealed":
        return "💣";
      case "wrong_flag":
        return "❌";
      case "revealed":
        return cell.adjacentMines > 0 ? cell.adjacentMines.toString() : "";
      default:
        return "";
    }
  };

  const getCellStyle = (cell: Cell): string => {
    let baseStyle =
      "w-8 h-8 md:w-10 md:h-10 border border-gray-400 flex items-center justify-center text-lg font-bold ";
    if (cell.state === "auto_flagged") {
      baseStyle += "bg-yellow-200 animate-pulse";
    } else if (cell.state === "hidden" || cell.state === "flagged") {
      const showHover =
        !settings.safeFirstClick || gameState.status !== "not_started";
      baseStyle += showHover
        ? "bg-gray-300 hover:bg-gray-400 cursor-pointer"
        : "bg-gray-300";
    } else if (cell.state === "revealed") {
      baseStyle += "bg-gray-200 ";
      if (cell.adjacentMines === 1) baseStyle += "text-blue-500";
      if (cell.adjacentMines === 2) baseStyle += "text-green-500";
      if (cell.adjacentMines === 3) baseStyle += "text-red-500";
      if (cell.adjacentMines >= 4) baseStyle += "text-purple-700";
    } else if (cell.state === "mine_revealed") {
      baseStyle += "bg-red-400";
    } else if (cell.state === "wrong_flag") {
      baseStyle += "bg-yellow-300";
    }
    return baseStyle;
  };

  if (showSettings) {
    return (
      <MinesweeperSettings
        currentSettings={settings}
        onStartGame={newGame}
        onCancel={
          gameState.status !== "not_started"
            ? () => setShowSettings(false)
            : undefined
        }
      />
    );
  }

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-700 mb-6">
        {t("games.minesweeper")}
      </h1>

      <div className="mb-4 p-3 bg-white rounded-lg shadow-md flex flex-wrap justify-between items-center w-full max-w-md">
        <div className="w-full flex justify-between items-center m-2">
          <div className="text-xl font-semibold text-red-500">
            🚩 {gameState.minesRemaining}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => newGame()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {gameState.status === "playing"
                ? "🙂"
                : gameState.status === "won"
                ? "😎"
                : "😵"}
            </button>
          </div>
          <div className="text-xl font-semibold text-gray-700">
            ⏱️ {timeElapsed}s
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setGameState(autoCalc(gameState))}
            disabled={gameState.status !== "playing"}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 transition-colors"
          >
            Solve
          </button>
          <button
            onClick={() => setGameState(autoFlagCertainMines(gameState))}
            disabled={gameState.status !== "playing"}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            Auto Flag All
          </button>
          <button
            onClick={() => setGameState(flagOneCertainMine(gameState))}
            disabled={gameState.status !== "playing"}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            Flag One
          </button>
          <button
            onClick={() => setGameState(openOneCertainEmptyCell(gameState))}
            disabled={gameState.status !== "playing"}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            Open One
          </button>
          <button
            onClick={() => setGameState(openAllCertainEmptyCells(gameState))}
            disabled={gameState.status !== "playing"}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            Open All
          </button>
        </div>
      </div>

      <div
        className="grid gap-0.5 bg-gray-500 p-1 rounded shadow-lg"
        style={{
          gridTemplateColumns: `repeat(${settings.cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${settings.rows}, minmax(0, 1fr))`,
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {gameState.board.length > 0
          ? gameState.board.map((row, rIndex) =>
              row.map((cell, cIndex) => (
                <div
                  key={`${rIndex}-${cIndex}`}
                  className={getCellStyle(cell)}
                  onClick={() => handleCellClick(rIndex, cIndex)}
                  onContextMenu={(e) => handleCellRightClick(e, rIndex, cIndex)}
                >
                  {getCellDisplay(cell)}
                </div>
              ))
            )
          : Array.from({ length: settings.rows * settings.cols }).map(
              (_, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 md:w-10 md:h-10 border border-gray-400 bg-gray-300 ${
                    !settings.safeFirstClick ||
                    gameState.status !== "not_started"
                      ? "hover:bg-gray-400 cursor-pointer"
                      : ""
                  }`}
                  onClick={() =>
                    handleCellClick(
                      Math.floor(index / settings.cols),
                      index % settings.cols
                    )
                  }
                />
              )
            )}
      </div>

      <button
        onClick={() => setShowSettings(true)}
        className="mt-6 px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-300 text-lg font-semibold"
      >
        {t("minesweeper.change_settings")}
      </button>

      {showResultModal && (
        <MinesweeperResultModal
          status={gameState.status as "won" | "lost"}
          time={timeElapsed}
          onRestart={() => newGame(settings)}
          onClose={() => setShowResultModal(false)}
        />
      )}
    </div>
  );
};

export default MinesweeperGame;
