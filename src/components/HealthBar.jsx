import React from 'react';

export default function HealthBar({ hp, maxHp }) {
  const percentage = (hp / maxHp) * 100;

  return (
    <div className="w-full bg-gray-300 rounded h-4 mb-2">
      <div
        className="bg-red-500 h-4 rounded"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
