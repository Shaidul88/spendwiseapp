"use client";
import { CATEGORIES } from "@/lib/utils";

export default function ExpenseFilters({ filters, setFilters }) {
  return (
    <div className="panel p-4">
      <div className="panel-header mb-3">Filters</div>
      <div className="grid md:grid-cols-5 gap-3">
        <input
          className="input"
          placeholder="Search title or note…"
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
        />
        <select
          className="select"
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
        >
          <option>All</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          className="select"
          value={filters.month}
          onChange={(e) => setFilters((f) => ({ ...f, month: e.target.value }))}
        >
          <option>All</option>
          {/* show last 12 months */}
          {Array.from({ length: 12 }).map((_, i) => {
            const d = new Date(); d.setMonth(d.getMonth() - i);
            const val = d.toISOString().slice(0, 7);
            return <option key={val} value={val}>{val}</option>;
          })}
        </select>
        <select
          className="select"
          value={filters.sort}
          onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
        >
          <option value="date-desc">Newest</option>
          <option value="date-asc">Oldest</option>
          <option value="amount-desc">Amount ↓</option>
          <option value="amount-asc">Amount ↑</option>
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input
            className="input"
            inputMode="decimal"
            placeholder="Min"
            value={filters.min}
            onChange={(e) => setFilters((f) => ({ ...f, min: e.target.value }))}
          />
          <input
            className="input"
            inputMode="decimal"
            placeholder="Max"
            value={filters.max}
            onChange={(e) => setFilters((f) => ({ ...f, max: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );
}
