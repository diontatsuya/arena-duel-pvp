// src/components/HealthBar.jsx
const HealthBar = ({ hp }) => {
  const percentage = Math.max(0, Math.min(100, (hp / 100) * 100));

  return (
    <div className="w-full bg-gray-700 rounded-full h-5 overflow-hidden mb-1">
      <div
        className={`h-full transition-all duration-300 ${
          percentage > 60
            ? "bg-green-500"
            : percentage > 30
            ? "bg-yellow-500"
            : "bg-red-500"
        }`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default HealthBar;
