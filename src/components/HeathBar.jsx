export default function HealthBar({ label, current, max = 100 }) {
  const pct = Math.max(0, Math.min(100, Math.round((Number(current) / Number(max)) * 100)));
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1"><span>{label}</span><span>{pct}%</span></div>
      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-600" style={{ width: pct + '%' }} />
      </div>
    </div>
  );
}
