// src/components/ArenaPVP.jsx
import { useEffect, useState } from "react";
import { useGameLogic } from "../utils/GameLogic";
import ArenaUI from "./ArenaUI";

const ArenaPVP = () => {
  const {
    player,
    opponent,
    currentTurn,
    winner,
    joinGame,
    takeTurn,
    loading,
    error,
  } = useGameLogic(true); // true untuk mode PVP

  const [selectedAction, setSelectedAction] = useState(null);

  const handleAction = (action) => {
    setSelectedAction(action);
    takeTurn(action);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Arena PVP</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && <div className="text-yellow-300 mb-4">Loading...</div>}

      {!player.opponent && !winner && (
        <button
          onClick={joinGame}
          className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700"
        >
          Join Match
        </button>
      )}

      {player.opponent && !winner && (
        <>
          <ArenaUI
            player={player}
            opponent={opponent}
            currentTurn={currentTurn}
            onAction={handleAction}
            selectedAction={selectedAction}
          />
        </>
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
    </div>
  );
};

export default ArenaPVP;
