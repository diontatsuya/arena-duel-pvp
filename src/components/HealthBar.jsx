import React from 'react';

export default function HealthBar({ currentHP, maxHP }) {
  const percentage = (currentHP / maxHP) * 100;
  return (
    <div className="w-full bg-gray-300 rounded h-4 overflow-hidden">
      <div
        className="bg-red-500 h-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
