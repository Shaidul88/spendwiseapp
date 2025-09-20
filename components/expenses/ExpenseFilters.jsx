"use client";
import { monthOptions, CATEGORIES } from "@/lib/utils";

export default function ExpenseFilters({ filters, onChange, items }) {
  const months = monthOptions(items.map((i) => i.date).filter(Boolean));

  // if you created .input-dark in globals.css, replace inputCls/selectCls with "input-dark"
  const inputCls =
    "border border-neutral-600 rounded-xl px-3 py-2 bg-neutral-700 text-neutral-100 " +
    "placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500";
  const selectCls = inputCls;

  return (
    <div className="p-3 rounded-2xl bg-neutral-800 ring-1 ring-neutral-700 grid gap-3 md:grid-cols-8">
      {/* Search (2 columns on md+) */}
      <input
        className={`md:col-span-2 ${inputCls}`}
        placeholder="Search…"
        value={filters.q}
        onChange={(e) => onChange({ ...filters, q: e.target.value })}
      />

      {/* Category */}
      <select
        className={selectCls}
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
      >
        {["All", ...CATEGORIES].map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Month */}
      <select
        className={selectCls}
        value={filters.month}
        onChange={(e) => onChange({ ...filters, month: e.target.value })}
      >
        {["All", ...months].map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        className={selectCls}
        value={filters.sort}
        onChange={(e) => onChange({ ...filters, sort: e.target.value })}
      >
        <option value="date-desc">Newest</option>
        <option value="date-asc">Oldest</option>
        <option value="amount-desc">Amount ↓</option>
        <option value="amount-asc">Amount ↑</option>
      </select>

      {/* Min */}
      <input
        className={inputCls}
        placeholder="Min"
        value={filters.min}
        onChange={(e) => onChange({ ...filters, min: e.target.value })}
      />

      {/* Max */}
      <input
        className={inputCls}
        placeholder="Max"
        value={filters.max}
        onChange={(e) => onChange({ ...filters, max: e.target.value })}
      />
    </div>
  );
}
