import React from 'react';

export default function ActionButtons({ handleAction }) {
  return (
    <div className="flex justify-center gap-4 mt-6">
      <button
        onClick={() => handleAction(1)}
        className="bg-red-500 text-white px-4 py-2 rounded-xl shadow hover:bg-red-600"
      >
        Attack
      </button>
      <button
        onClick={() => handleAction(2)}
        className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-600"
      >
        Defend
      </button>
      <button
        onClick={() => handleAction(3)}
        className="bg-green-500 text-white px-4 py-2 rounded-xl shadow hover:bg-green-600"
      >
        Heal
      </button>
    </div>
  );
}
