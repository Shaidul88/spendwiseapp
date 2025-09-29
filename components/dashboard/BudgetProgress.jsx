"use client";

export default function BudgetProgress({ total, budget }) {
  const pct = Math.min(100, budget > 0 ? (total / budget) * 100 : 0);
  const remaining = Math.max(0, budget - total);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-400">Budget</span>
        <span className="font-medium">
          {Number(budget).toLocaleString(undefined, { style: "currency", currency: "USD" })}
        </span>
      </div>

      <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className={`h-3 ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-emerald-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-400">Spent</span>
        <span>
          {Number(total).toLocaleString(undefined, { style: "currency", currency: "USD" })} · {pct.toFixed(0)}%
        </span>
      </div>

      <div className="text-sm text-neutral-400">
        Remaining:{" "}
        <span className="text-neutral-100 font-medium">
          {Number(remaining).toLocaleString(undefined, { style: "currency", currency: "USD" })}
        </span>
      </div>
    </div>
  );
}
