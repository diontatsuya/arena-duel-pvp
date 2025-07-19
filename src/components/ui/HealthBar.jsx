// src/components/HealthBar.jsx
const HealthBar = ({ hp }) => {
  const sanitizedHp = typeof hp === "number" && !isNaN(hp) ? hp : 0;
  const percentage = Math.max(0, Math.min(100, (sanitizedHp / 100) * 100));

  const barColor =
    percentage > 60
      ? "bg-green-500"
      : percentage > 30
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="w-full bg-gray-700 rounded-full h-5 overflow-hidden mb-1">
      <div
        className={`h-full ${barColor} transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default HealthBar;
