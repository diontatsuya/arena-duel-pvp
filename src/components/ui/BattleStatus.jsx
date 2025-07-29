import React from "react";

const BattleStatus = ({ player, opponent, isMyTurn }) => {
  return (
    <div className="grid grid-cols-2 gap-6 text-center my-6">
      {/* Player Info */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-bold text-green-400">Kamu</h3>
        <p>HP: {player?.hp ?? "-"}</p>
        <p>Aksi Terakhir: {player?.lastAction ?? "-"}</p>
        {isMyTurn && <p className="mt-2 text-sm text-yellow-400">Giliranmu!</p>}
      </div>

      {/* Opponent Info */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-bold text-red-400">Lawan</h3>
        <p>HP: {opponent?.hp ?? "-"}</p>
        <p>Aksi Terakhir: {opponent?.lastAction ?? "-"}</p>
        {!isMyTurn && <p className="mt-2 text-sm text-yellow-400">Giliran lawan...</p>}
      </div>
    </div>
  );
};

export default BattleStatus;
