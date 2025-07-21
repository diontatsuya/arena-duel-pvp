import { useEffect } from "react";
import { usePVPGame } from "../gameLogic/pvpLogic";

const GamePVP = () => {
  const {
    player,
    opponent,
    isPlayerTurn,
    loading,
    message,
    handleAction,
    fetchStatus,
  } = usePVPGame();

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">🔥 Arena Duel - PvP 🔥</h1>

      {loading && <p className="text-yellow-400 mb-4">Loading...</p>}
      <p className="mb-2">{message}</p>

      <div className="grid grid-cols-2 gap-8 mb-6">
        <div className="p-4 border rounded-lg bg-gray-800">
          <h2 className="text-xl font-semibold mb-2">You</h2>
          <p>HP: {player?.hp ?? "-"}</p>
          <p>Last Action: {player?.lastAction ?? "-"}</p>
        </div>

        <div className="p-4 border rounded-lg bg-gray-800">
          <h2 className="text-xl font-semibold mb-2">Opponent</h2>
          <p>HP: {opponent?.hp ?? "-"}</p>
          <p>Last Action: {opponent?.lastAction ?? "-"}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => handleAction("attack")}
          disabled={!isPlayerTurn || loading}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          Attack
        </button>
        <button
          onClick={() => handleAction("defend")}
          disabled={!isPlayerTurn || loading}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Defend
        </button>
        <button
          onClick={() => handleAction("heal")}
          disabled={!isPlayerTurn || loading}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          Heal
        </button>
      </div>
    </div>
  );
};

export default GamePVP;
