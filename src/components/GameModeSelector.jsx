import React from "react";

const GameModeSelector = ({ selectedMode, setSelectedMode }) => {
  return (
    <div className="flex gap-4 justify-center mb-6">
      <button
        onClick={() => setSelectedMode("PVP")}
        className={`px-6 py-2 rounded-xl text-white font-semibold ${
          selectedMode === "PVP"
            ? "bg-blue-600"
            : "bg-gray-600 hover:bg-blue-500"
        }`}
      >
        PVP
      </button>
      <button
        onClick={() => setSelectedMode("PVE")}
        className={`px-6 py-2 rounded-xl text-white font-semibold ${
          selectedMode === "PVE"
            ? "bg-green-600"
            : "bg-gray-600 hover:bg-green-500"
        }`}
      >
        PVE
      </button>
    </div>
  );
};

export default GameModeSelector;
