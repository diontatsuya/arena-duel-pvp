import React from 'react';

export default function GameArena() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4">Arena Duel PvP</h1>
      <div className="bg-gray-800 rounded-xl p-6 shadow-md">
        <p className="text-lg text-center">Selamat datang di Arena Duel PvP!</p>
        <p className="text-center mt-2">
          Silakan login dengan MetaMask dan mulai bertarung!
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white">
            Attack
          </button>
          <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white">
            Heal
          </button>
          <button className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-md text-white">
            Defend
          </button>
        </div>
      </div>
    </div>
  );
}
