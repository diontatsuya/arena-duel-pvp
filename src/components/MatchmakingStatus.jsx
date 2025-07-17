import React from 'react';

export default function MatchmakingStatus({ player, opponent }) {
  if (!opponent) {
    return (
      <div className="text-center mt-4 text-yellow-400 font-semibold">
        Menunggu lawan masuk arena...
      </div>
    );
  }

  return (
    <div className="text-center mt-4 text-green-400 font-semibold">
      <div>🧍 Kamu: {player}</div>
      <div>⚔️ Lawan: {opponent}</div>
    </div>
  );
}
