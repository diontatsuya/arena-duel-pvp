import React from "react";

// Komponen HealthBar Reusable
const HealthBar = ({ hp }) => {
  const percentage = Math.max(0, Math.min(hp, 100)); // batasi 0 - 100
  return (
    <div className="w-full bg-gray-700 rounded h-4 mt-2 overflow-hidden">
      <div
        className="h-full bg-green-500 transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const BattleStatus = ({ player, opponent, turn, currentAddress }) => {
  const lowerCurrent = currentAddress?.toLowerCase();
  const playerAddress = player?.address?.toLowerCase();
  const opponentAddress = opponent?.address?.toLowerCase();

  const playerIsYou = playerAddress === lowerCurrent;
  const opponentIsYou = opponentAddress === lowerCurrent;

  const isMyTurn =
    (playerIsYou && turn === 0) ||
    (opponentIsYou && turn === 1);

  const myData = playerIsYou ? player : opponent;
  const enemyData = playerIsYou ? opponent : player;

  return (
    <div className="grid grid-cols-2 gap-6 text-center my-6">
      {/* Player (You) Info */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-bold text-green-400">Kamu</h3>
        <p>HP: {myData?.hp ?? "-"}</p>
        <HealthBar hp={myData?.hp ?? 0} />
        <p className="mt-2">Aksi Terakhir: {myData?.lastAction ?? "-"}</p>
        {isMyTurn && <p className="mt-2 text-sm text-yellow-400">Giliranmu!</p>}
      </div>

      {/* Opponent Info */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-bold text-red-400">Lawan</h3>
        <p>HP: {enemyData?.hp ?? "-"}</p>
        <HealthBar hp={enemyData?.hp ?? 0} />
        <p className="mt-2">Aksi Terakhir: {enemyData?.lastAction ?? "-"}</p>
        {!isMyTurn && <p className="mt-2 text-sm text-yellow-400">Giliran lawan...</p>}
      </div>
    </div>
  );
};

export default BattleStatus;
