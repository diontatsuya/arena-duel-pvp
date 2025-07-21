import React from "react";

const ActionButtons = ({ onAction, isDisabled }) => {
  return (
    <div className="flex justify-center mt-4 space-x-4">
      <button
        onClick={() => onAction("attack")}
        disabled={isDisabled}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        Attack
      </button>
      <button
        onClick={() => onAction("defend")}
        disabled={isDisabled}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        Defend
      </button>
      <button
        onClick={() => onAction("heal")}
        disabled={isDisabled}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        Heal
      </button>
    </div>
  );
};

export default ActionButtons;
