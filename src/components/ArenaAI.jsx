// src/components/ArenaAI.jsx
import { useEffect, useState } from "react";
import { useGameLogic } from "../utils/GameLogic";
import ArenaUI from "./ArenaUI";

const ArenaAI = () => {
  const {
    player,
    opponent,
    currentTurn,
    winner,
    takeTurn,
    resetGame,
    loading,
    error,
  } = useGameLogic(false); // false untuk mode melawan AI

  const [selectedAction, setSelectedAction] = useState(null);

  const handleAction = (action) => {
    setSelectedAction(action);
    takeTurn(action);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Arena vs AI</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && <div className="text-yellow-300 mb-4">Loading...</div>}

      {!winner && (
        <ArenaUI
          player={player}
          opponent={opponent}
          currentTurn={currentTurn}
          onAction={handleAction}
          selectedAction={selectedAction}
        />
      )}

      {winner && (
        <div className="text-2xl mt-4 text-green-400">
          {winner === "you"
            ? "You win!"
            : winner === "opponent"
            ? "You lose!"
            : "It's a draw!"}
        </div>
      )}

      {winner && (
        <button
          onClick={resetGame}
          className="bg-blue-600 mt-4 px-6 py-2 rounded hover:bg-blue-700"
        >
          Play Again
        </button>
      )}
    </div>
  );
};

export default ArenaAI;
