"use client";
export default function StatCard({ label, value }) {
  return (
    <div className="bg-neutral-800 rounded-xl p-5">
      <div className="text-neutral-400 text-sm">{label}</div>
      <div className="text-2xl font-semibold mt-1">{String(value)}</div>
    </div>
  );
}
