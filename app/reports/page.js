"use client";
import { useMemo, useState } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { money, monthKey } from "@/lib/utils";
import CategoryPieChart from "@/components/expenses/CategoryPieChart";
import MonthlyBarChart from "@/components/expenses/MonthlyBarChart";
import StatCard from "@/components/StatCard";

const RANGES = [
  { key: "30", label: "Last 30 days", days: 30 },
  { key: "90", label: "Last 90 days", days: 90 },
  { key: "ytd", label: "Year to date", days: "ytd" },
  { key: "all", label: "All time", days: "all" },
];

export default function ReportsPage() {
  const { items } = useExpenses();
  const [range, setRange] = useState("30");

  const view = useMemo(() => {
    const now = new Date();

    const inRange = (dStr) => {
      const d = new Date(dStr + "T00:00:00");
      if (range === "all") return true;
      if (range === "ytd") return d.getFullYear() === now.getFullYear();
      const days = Number(range);
      const start = new Date(now);
      start.setDate(now.getDate() - days + 1);
      return d >= start && d <= now;
    };

    const rows = items.filter((e) => inRange(e.date));

    const total = rows.reduce((s, e) => s + e.amount, 0);

    const byCatObj = rows.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
    const byCat = Object.entries(byCatObj)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Monthly aggregation for bar chart (use distinct months present in range, max 12)
    const monthsSet = Array.from(
      new Set(
        rows
          .map((e) => monthKey(e.date))
          .sort()
      )
    ).slice(-12);

    const byMonth = monthsSet.map((m) => ({
      month: m,
      total: rows.filter((e) => monthKey(e.date) === m).reduce((s, x) => s + x.amount, 0),
    }));

    const avg = rows.length ? total / rows.length : 0;

    return { rows, total, avg, byCat, byMonth };
  }, [items, range]);

  return (
    <main className="min-h-screen space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <select
          className="select"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          {RANGES.map((r) => (
            <option key={r.key} value={r.key}>{r.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total" value={money(view.total)} />
        <StatCard label="Transactions" value={view.rows.length} />
        <StatCard label="Average / Tx" value={money(view.avg)} />
        <StatCard label="Categories" value={view.byCat.length} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="space-y-4 lg:col-span-2">
          <MonthlyBarChart data={view.byMonth} />
          <CategoryPieChart data={view.byCat} />
        </div>
        <div className="panel p-2 overflow-auto">
          <div className="panel-header p-2">Category Breakdown</div>
          <table className="w-full text-sm">
            <thead className="text-neutral-300">
              <tr className="text-left">
                <th className="p-2">Category</th>
                <th className="p-2">Total</th>
                <th className="p-2">Share</th>
              </tr>
            </thead>
            <tbody>
              {view.byCat.map((row) => {
                const share = view.total ? Math.round((row.value / view.total) * 100) : 0;
                return (
                  <tr key={row.name} className="border-t border-neutral-700">
                    <td className="p-2">{row.name}</td>
                    <td className="p-2">{money(row.value)}</td>
                    <td className="p-2">{share}%</td>
                  </tr>
                );
              })}
              {!view.byCat.length && (
                <tr>
                  <td className="p-2 text-sm text-neutral-400" colSpan={3}>No data in this range.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
