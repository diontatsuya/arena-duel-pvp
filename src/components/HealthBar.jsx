import React from 'react';

export default function HealthBar({ hp, label }) {
  const percentage = Math.max(0, Math.min(100, (hp / 100) * 100));

  return (
    <div className="mb-2">
      <div className="text-sm mb-1">{label} HP: {hp}</div>
      <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className="h-full bg-red-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
