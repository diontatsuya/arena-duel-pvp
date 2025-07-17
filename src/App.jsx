import React from "react";
import ConnectWallet from "./components/ConnectWallet";
import GameArena from "./components/gamearena";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-yellow-300">
          Arena Duel Turn-Based Game
        </h1>
        <ConnectWallet />
        <GameArena />
      </div>
    </div>
  );
};

export default App;
