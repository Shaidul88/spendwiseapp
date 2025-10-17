"use client";
import { useMemo } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { money, monthKey } from "@/lib/utils";
import StatCard from "@/components/StatCard";
import CategoryPieChart from "@/components/expenses/CategoryPieChart";
import MonthlyBarChart from "@/components/expenses/MonthlyBarChart";
import RecentExpenses from "@/components/dashboard/RecentExpenses";

export default function DashboardPage() {
  const { items } = useExpenses();

  const data = useMemo(() => {
    const nowMonth = monthKey(new Date().toISOString().slice(0, 10));
    const thisMonth = items.filter((e) => monthKey(e.date) === nowMonth);
    const monthTotal = thisMonth.reduce((s, e) => s + e.amount, 0);
    const days = new Date().getDate();
    const avgDay = days ? monthTotal / days : 0;

    const byCat = Object.values(
      thisMonth.reduce((acc, e) => {
        acc[e.category] = acc[e.category] || { name: e.category, value: 0 };
        acc[e.category].value += e.amount;
        return acc;
      }, {})
    );

    const last6 = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
      const m = d.toISOString().slice(0, 7);
      const total = items.filter((e) => monthKey(e.date) === m).reduce((s, x) => s + x.amount, 0);
      return { month: m, total };
    });

    const topCat = byCat.slice().sort((a, b) => b.value - a.value)[0]?.name || "-";

    return { monthTotal, avgDay, txCount: thisMonth.length, byCat, last6, topCat };
  }, [items]);

  return (
    <main className="min-h-screen space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Spent This Month" value={money(data.monthTotal)} />
        <StatCard label="Transactions" value={data.txCount} />
        <StatCard label="Avg / Day (MTD)" value={money(data.avgDay)} />
        <StatCard label="Top Category" value={data.topCat} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <MonthlyBarChart data={data.last6} />
          <CategoryPieChart data={data.byCat} />
        </div>
        <div className="space-y-4">
          <div className="panel p-4">
            <div className="panel-header mb-1">Overview</div>
            <p className="text-sm text-neutral-300">
              Track your monthly burn, category mix, and recent activity at a glance.
            </p>
          </div>
          <RecentExpenses items={items} />
        </div>
      </div>
    </main>
  );
}
