import React from "react";

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
        <p>Aksi Terakhir: {myData?.lastAction ?? "-"}</p>
        {isMyTurn && <p className="mt-2 text-sm text-yellow-400">Giliranmu!</p>}
      </div>

      {/* Opponent Info */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-bold text-red-400">Lawan</h3>
        <p>HP: {enemyData?.hp ?? "-"}</p>
        <p>Aksi Terakhir: {enemyData?.lastAction ?? "-"}</p>
        {!isMyTurn && <p className="mt-2 text-sm text-yellow-400">Giliran lawan...</p>}
      </div>
    </div>
  );
};

export default BattleStatus;
