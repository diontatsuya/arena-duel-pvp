// src/components/ArenaUI.jsx
import React from "react";

const ArenaUI = ({
  playerHP,
  opponentHP,
  isMyTurn,
  onAction,
  battleLog,
  onDebug,
  isDebugVisible,
}) => {
  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Arena Duel</h2>

      <div className="mb-6">
        <p className="text-lg font-semibold">You</p>
        <p className="text-red-600 font-bold text-xl">HP: {playerHP}</p>
        <hr className="my-2" />
        <p className="text-lg font-semibold">Opponent</p>
        <p className="text-blue-600 font-bold text-xl">HP: {opponentHP}</p>
      </div>

      {isMyTurn ? (
        <div className="space-x-4 mb-6">
          <button
            onClick={() => onAction("attack")}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Attack
          </button>
          <button
            onClick={() => onAction("defend")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Defend
          </button>
          <button
            onClick={() => onAction("heal")}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Heal
          </button>
        </div>
      ) : (
        <p className="text-gray-600 mb-6">Waiting for opponent's turn...</p>
      )}

      <div className="mb-6 text-left">
        <h3 className="text-lg font-semibold mb-2">Battle Log:</h3>
        <ul className="bg-gray-100 rounded p-3 h-48 overflow-y-auto">
          {battleLog.map((log, index) => (
            <li key={index} className="text-sm mb-1">
              {log}
            </li>
          ))}
        </ul>
      </div>

      {isDebugVisible && (
        <button
          onClick={onDebug}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Debug: Simulate Opponent
        </button>
      )}
    </div>
  );
};

export default ArenaUI;
