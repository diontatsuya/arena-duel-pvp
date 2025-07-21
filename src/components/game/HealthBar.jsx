// src/components/game/HealthBar.jsx
import React from "react";

const HealthBar = ({ label, hp }) => {
  const hpPercent = Math.max(0, Math.min(100, hp));
  const barColor = hpPercent > 50 ? "bg-green-500" : hpPercent > 20 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="mb-4 w-full">
      <div className="text-sm mb-1">{label}: {hp} HP</div>
      <div className="w-full h-4 bg-gray-700 rounded">
        <div
          className={`${barColor} h-4 rounded`}
          style={{ width: `${hpPercent}%` }}
        ></div>
      </div>
    </div>
  );
};

export default HealthBar;
