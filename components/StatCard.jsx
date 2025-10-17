// components/StatCard.jsx
export default function StatCard({ label, value, hint }) {
  return (
    <div className="panel p-4">
      <div className="panel-header">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {hint ? <div className="text-xs text-neutral-400 mt-1">{hint}</div> : null}
    </div>
  );
}
