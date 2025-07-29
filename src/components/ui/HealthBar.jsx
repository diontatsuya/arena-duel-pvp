import React from "react";

const HealthBar = ({ label, hp, maxHp = 100 }) => {
  const hpValue = Math.max(0, Math.min(hp, maxHp));
  const hpPercent = (hpValue / maxHp) * 100;

  return (
    <div className="mb-4">
      <div className="mb-1 font-bold text-center">{label}</div>
      <div className="w-full bg-gray-700 h-6 rounded-lg overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: `${hpPercent}%` }}
        />
      </div>
      <div className="text-sm text-center mt-1">{hpValue} / {maxHp}</div>
    </div>
  );
};

export default HealthBar;
