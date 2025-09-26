"use client";
import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function CategoryPieChart({ expenses, items }) {
  // Accept either prop name
  const src = Array.isArray(expenses) ? expenses : Array.isArray(items) ? items : [];

  const [range, setRange] = useState("month"); // "day" | "week" | "month"

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const { filtered, total } = useMemo(() => {
    const list = Array.isArray(src) ? src : [];
    const isValid = (e) => {
      if (!e?.date) return false;
      const d = new Date(e.date);
      return !isNaN(d);
    };

    let out = [];
    if (range === "day") {
      out = list.filter((e) => {
        if (!isValid(e)) return false;
        const d = new Date(e.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
      });
    } else if (range === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 6);
      out = list.filter((e) => {
        if (!isValid(e)) return false;
        const d = new Date(e.date);
        d.setHours(0, 0, 0, 0);
        return d >= weekAgo && d <= today;
      });
    } else {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      out = list.filter((e) => {
        if (!isValid(e)) return false;
        const d = new Date(e.date);
        d.setHours(0, 0, 0, 0);
        return d >= monthStart && d <= today;
      });
    }

    const totalAmt = out.reduce((s, e) => s + (Number(e?.amount) || 0), 0);
    return { filtered: out, total: totalAmt };
  }, [src, range, today]);

  // group by category for the pie
  const data = useMemo(() => {
    const totals = {};
    for (const e of filtered) {
      const amt = Number(e?.amount) || 0;
      const cat = e?.category || "Uncategorized";
      totals[cat] = (totals[cat] || 0) + amt;
    }
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const fMoney = useMemo(
    () => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }),
    []
  );

  const rangeLabel =
    range === "day" ? "Today" : range === "week" ? "Last 7 days" : "This month";

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f", "#a4de6c", "#d0ed57"];

  return (
    <div className="p-4 rounded-2xl shadow bg-white/90 dark:bg-neutral-900">
      {/* Header with total */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Total Spending — {rangeLabel}
          </div>
          <div className="text-2xl font-semibold">{fMoney.format(total)}</div>
        </div>

        <div className="flex gap-2">
          {[
            { key: "day", label: "Daily" },
            { key: "week", label: "Weekly" },
            { key: "month", label: "This Month" },
          ].map((b) => (
            <button
              key={b.key}
              onClick={() => setRange(b.key)}
              className={`px-3 py-1 rounded text-sm ${
                range === b.key
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-neutral-700 dark:text-neutral-100"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-gray-500">No expenses for this range.</p>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
