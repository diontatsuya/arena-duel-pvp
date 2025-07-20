import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import victorySound from "../assets/audio/victory.mp3";
// import defeatSound from "../assets/audio/defeat.mp3";

const GameOverModal = ({ isOpen, winner, playerAddress, onRestart }) => {
  const isPlayerWinner = winner?.toLowerCase() === playerAddress?.toLowerCase();

  useEffect(() => {
    if (!isOpen) return;

    // Nonaktifkan audio sementara
    // const audio = new Audio(isPlayerWinner ? victorySound : defeatSound);
    // audio.play();
  }, [isOpen, isPlayerWinner]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`bg-white rounded-2xl shadow-xl px-8 py-10 text-center w-[90%] max-w-md ${
              isPlayerWinner ? "border-4 border-green-400" : "border-4 border-red-400"
            }`}
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              {isPlayerWinner ? "Victory!" : "Defeat"}
            </h2>
            <p className="text-lg mb-6 text-gray-600">
              {isPlayerWinner
                ? "You have outplayed your opponent."
                : "Better luck next time, warrior."}
            </p>
            <button
              onClick={onRestart}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Play Again
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameOverModal;
