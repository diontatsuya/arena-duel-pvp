import React from "react";

const BattleStatus = ({ player, opponent, turn, currentAddress }) => {
  const isMyTurn = player?.address?.toLowerCase() === currentAddress?.toLowerCase() && turn === 0 ||
                   opponent?.address?.toLowerCase() === currentAddress?.toLowerCase() && turn === 1;

  const playerIsYou = player?.address?.toLowerCase() === currentAddress?.toLowerCase();
  const myData = playerIsYou ? player : opponent;
  const opponentData = playerIsYou ? opponent : player;

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
        <p>HP: {opponentData?.hp ?? "-"}</p>
        <p>Aksi Terakhir: {opponentData?.lastAction ?? "-"}</p>
        {!isMyTurn && <p className="mt-2 text-sm text-yellow-400">Giliran lawan...</p>}
      </div>
    </div>
  );
};

export default BattleStatus;
