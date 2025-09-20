"use client";
import { money } from "@/lib/utils";

export default function SummaryCards({ items, filteredTotal }) {
  const total = items.reduce((s, e) => s + e.amount, 0);
  const count = items.length;
  const avg = count ? total / count : 0;

  const card = "p-4 rounded-2xl bg-neutral-800 text-neutral-100 ring-1 ring-neutral-700";
  const label = "text-xs text-neutral-400";
  const value = "text-xl font-semibold";

  return (
    <div className="grid sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-neutral-800 text-neutral-100 ring-1 ring-neutral-700">
            <div className="text-xs text-neutral-400">All-time total</div>
            <div className="text-xl font-semibold">{money(total)}</div>
        </div>
      <div className={card}>
        <div className={label}>Average per item</div>
        <div className={value}>{money(avg)}</div>
      </div>
      <div className={card}>
        <div className={label}>Filtered subtotal</div>
        <div className={value}>{money(filteredTotal)}</div>
      </div>
    </div>
  );
}
