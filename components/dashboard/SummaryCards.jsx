"use client";

function fmtMoney(n) {
  return Number(n || 0).toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function Card({ label, value, sub }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
      <div className="text-neutral-400 text-sm">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {sub ? <div className="text-neutral-400 text-xs mt-1">{sub}</div> : null}
    </div>
  );
}

export default function SummaryCards({ monthTotal, txCount, avgPerDay, topCategory }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card label="Spent This Month" value={fmtMoney(monthTotal)} />
      <Card label="Transactions" value={txCount} />
      <Card label="Avg / Day (MTD)" value={fmtMoney(avgPerDay)} />
      <Card label="Top Category" value={topCategory || "-"} />
    </div>
  );
}
