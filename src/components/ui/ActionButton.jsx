import { useState } from "react";

const ActionButtons = ({ isPlayerTurn, onActionSelected, isLoading }) => {
  const [selectedAction, setSelectedAction] = useState(null);

  const handleAction = (action) => {
    if (!isPlayerTurn || isLoading) return;
    setSelectedAction(action);
    onActionSelected(action);
  };

  return (
    <div className="flex justify-center gap-4 mt-6">
      <button
        onClick={() => handleAction("attack")}
        disabled={!isPlayerTurn || isLoading}
        className={`px-4 py-2 rounded-lg text-white ${
          selectedAction === "attack" ? "bg-red-600" : "bg-red-500"
        } hover:bg-red-700 disabled:opacity-50`}
      >
        Attack
      </button>
      <button
        onClick={() => handleAction("defend")}
        disabled={!isPlayerTurn || isLoading}
        className={`px-4 py-2 rounded-lg text-white ${
          selectedAction === "defend" ? "bg-blue-600" : "bg-blue-500"
        } hover:bg-blue-700 disabled:opacity-50`}
      >
        Defend
      </button>
      <button
        onClick={() => handleAction("heal")}
        disabled={!isPlayerTurn || isLoading}
        className={`px-4 py-2 rounded-lg text-white ${
          selectedAction === "heal" ? "bg-green-600" : "bg-green-500"
        } hover:bg-green-700 disabled:opacity-50`}
      >
        Heal
      </button>
    </div>
  );
};

export default ActionButtons;
