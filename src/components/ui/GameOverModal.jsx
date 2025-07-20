import React from "react";

const GameOverModal = ({ winner, onRestart }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Game Over</h2>
        <p className="text-lg mb-6">{winner} wins!</p>
        <button
          onClick={onRestart}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Restart
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
