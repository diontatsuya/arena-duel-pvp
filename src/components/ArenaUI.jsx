// src/components/ArenaUI.jsx
import HealthBar from "./HealthBar";

const ArenaUI = ({
  player,
  opponent,
  currentTurn,
  onAction,
  selectedAction,
}) => {
  const isPlayerTurn = currentTurn === "player";

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Opponent */}
      <div className="bg-gray-800 p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-2">Opponent</h2>
        <HealthBar hp={opponent?.hp || 0} />
        <p className="text-sm text-gray-400">
          Last action: {opponent?.lastAction || "-"}
        </p>
      </div>

      {/* Player */}
      <div className="bg-gray-800 p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-2">You</h2>
        <HealthBar hp={player?.hp || 0} />
        <p className="text-sm text-gray-400">
          Last action: {player?.lastAction || "-"}
        </p>
      </div>

      {/* Actions */}
      {isPlayerTurn ? (
        <div className="flex justify-around">
          {["attack", "defend", "heal"].map((action) => (
            <button
              key={action}
              onClick={() => onAction(action)}
              disabled={selectedAction === action}
              className={`px-4 py-2 rounded font-semibold ${
                selectedAction === action
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {action.charAt(0).toUpperCase() + action.slice(1)}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-center text-yellow-400 font-medium">
          Waiting for opponent's turn...
        </p>
      )}
    </div>
  );
};

export default ArenaUI;
