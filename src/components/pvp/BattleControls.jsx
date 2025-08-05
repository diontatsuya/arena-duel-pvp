import React from "react";

const BattleControls = ({
  onAction,
  onLeave,
  isMyTurn,
  isWaiting = false,
  battleData,
  walletAddress,
}) => {
  // Jika `isMyTurn` tidak diberikan, hitung dari battleData
  const myTurn =
    typeof isMyTurn === "boolean"
      ? isMyTurn
      : battleData?.currentTurn === walletAddress;

  return (
    <div className="flex flex-col items-center space-y-2 mt-4">
      <button
        onClick={() => onAction("attack")}
        disabled={!myTurn || isWaiting}
        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl disabled:opacity-40 w-40"
      >
        Attack
      </button>
      <button
        onClick={() => onAction("defend")}
        disabled={!myTurn || isWaiting}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-40 w-40"
      >
        Defend
      </button>
      <button
        onClick={() => onAction("heal")}
        disabled={!myTurn || isWaiting}
        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl disabled:opacity-40 w-40"
      >
        Heal
      </button>
      {onLeave && (
        <button
          onClick={onLeave}
          className="px-6 py-2 mt-4 bg-gray-500 hover:bg-gray-600 text-white rounded-xl w-40"
        >
          Leave Battle
        </button>
      )}
    </div>
  );
};

export default BattleControls;
