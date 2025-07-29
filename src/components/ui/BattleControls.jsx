import React from "react";

const BattleControls = ({ isYourTurn, onAction, onLeave, loading }) => {
  return (
    <div className="mt-4 flex flex-col items-center gap-4">
      {!isYourTurn && (
        <p className="text-yellow-400">Menunggu giliran lawan...</p>
      )}

      <div className="flex flex-wrap justify-center gap-4">
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          disabled={!isYourTurn || loading}
          onClick={() => onAction("attack")}
        >
          Serang
        </button>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          disabled={!isYourTurn || loading}
          onClick={() => onAction("defend")}
        >
          Bertahan
        </button>

        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          disabled={!isYourTurn || loading}
          onClick={() => onAction("heal")}
        >
          Heal
        </button>
      </div>

      <button
        className="mt-4 text-sm text-gray-300 hover:text-white underline"
        onClick={onLeave}
        disabled={loading}
      >
        Keluar dari Pertarungan
      </button>
    </div>
  );
};

export default BattleControls;
