import React from "react";

function ArenaUI({
  isPVP,
  playerHP,
  opponentHP,
  isPlayerTurn,
  onAction,
  battleLog,
  onDebug,
}) {
  return (
    <div className="p-4 max-w-xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4">{isPVP ? "PVP Mode" : "PVE Mode"}</h2>

      <div className="flex justify-between mb-4">
        <div>
          <h3 className="font-semibold">You</h3>
          <p>HP: {playerHP}</p>
        </div>
        <div>
          <h3 className="font-semibold">{isPVP ? "Opponent" : "Enemy"}</h3>
          <p>HP: {opponentHP}</p>
        </div>
      </div>

      {isPlayerTurn ? (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => onAction("attack")}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Attack
          </button>
          <button
            onClick={() => onAction("defend")}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          >
            Defend
          </button>
          <button
            onClick={() => onAction("heal")}
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
          >
            Heal
          </button>
        </div>
      ) : (
        <p className="italic text-center mb-4">
          Waiting for {isPVP ? "opponent's" : "enemy's"} turn...
        </p>
      )}

      <div className="bg-gray-800 p-3 rounded mb-4 h-40 overflow-y-auto text-sm">
        <h4 className="font-semibold mb-2">Battle Log:</h4>
        {battleLog.length === 0 ? (
          <p className="text-gray-400">No actions yet.</p>
        ) : (
          battleLog.map((entry, index) => <p key={index}>{entry}</p>)
        )}
      </div>

      <button
        onClick={onDebug}
        className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600"
      >
        Debug: Force Turn Swap
      </button>
    </div>
  );
}

export default ArenaUI;
