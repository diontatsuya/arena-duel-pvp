import React from 'react';
import GameLog from './GameLog';

const ArenaUI = ({
  isPVP,
  playerHP,
  opponentHP,
  isTurn,
  onAction,
  battleLog,
  debugMatch
}) => {
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg mt-10 text-center">
      <h2 className="text-2xl font-bold mb-4">
        {isPVP ? 'PVP Mode' : 'PVE Mode'}
      </h2>

      <div className="mb-4">
        <p className="font-semibold">Your HP: {playerHP}</p>
        <p className="font-semibold">Enemy HP: {opponentHP}</p>
      </div>

      {isTurn ? (
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => onAction('attack')}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
          >
            Attack
          </button>
          <button
            onClick={() => onAction('defend')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            Defend
          </button>
          <button
            onClick={() => onAction('heal')}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl"
          >
            Heal
          </button>
        </div>
      ) : (
        <p className="italic text-gray-600 mb-4">Waiting for opponent's turn...</p>
      )}

      {isPVP && (
        <button
          onClick={debugMatch}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-xl mb-4"
        >
          🔧 Debug Match
        </button>
      )}

      <GameLog battleLog={battleLog} />
    </div>
  );
};

export default ArenaUI;
