"use client";

import { useMemo, useState } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import SummaryCards from "@/components/dashboard/SummaryCards";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import RecentExpenses from "@/components/dashboard/RecentExpenses";
import QuickAdd from "@/components/dashboard/QuickAdd";
import CategoryPieChart from "@/components/expenses/CategoryPieChart";
import MonthlyBarChart from "@/components/expenses/MonthlyBarChart";

export default function DashboardPage() {
  const { items, addExpense } = useExpenses();

  // ---- simple monthly budget (can later come from Settings/localStorage)
  const [monthlyBudget, setMonthlyBudget] = useState(1500);

  const {
    monthTotal,
    txCount,
    avgPerDay,
    topCategory,
    monthItems,
  } = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth(); // 0-based
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 0);

    const monthItems = items.filter((e) => {
      const d = new Date(e.date || e.createdAt || Date.now());
      return d >= start && d <= end;
    });

    const monthTotal = monthItems.reduce((s, e) => s + Number(e.amount || 0), 0);
    const txCount = monthItems.length;

    // average per day so far this month
    const daysSoFar = Math.max(1, now.getDate());
    const avgPerDay = monthTotal / daysSoFar;

    // top category by spend
    const byCat = new Map();
    monthItems.forEach((e) => {
      const c = e.category || "Other";
      byCat.set(c, (byCat.get(c) || 0) + Number(e.amount || 0));
    });
    let topCategory = "-";
    let topVal = -1;
    for (const [c, v] of byCat.entries()) {
      if (v > topVal) {
        topVal = v;
        topCategory = c;
      }
    }

    return { monthTotal, txCount, avgPerDay, topCategory, monthItems };
  }, [items]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-700"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(Number(e.target.value || 0))}
              placeholder="Monthly budget"
              aria-label="Monthly budget"
            />
            <span className="text-sm text-neutral-400">USD</span>
          </div>
        </div>

        {/* KPIs */}
        <SummaryCards
          monthTotal={monthTotal}
          txCount={txCount}
          avgPerDay={avgPerDay}
          topCategory={topCategory}
        />

        {/* Charts + Budget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
              <h2 className="text-lg font-medium mb-4">Spending by Category (This Month)</h2>
              <CategoryPieChart items={monthItems} />
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
              <h2 className="text-lg font-medium mb-4">Monthly Spend (Last 12 Months)</h2>
              <MonthlyBarChart items={items} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
              <h2 className="text-lg font-medium mb-4">Budget Progress</h2>
              <BudgetProgress total={monthTotal} budget={monthlyBudget} />
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
              <h2 className="text-lg font-medium mb-4">Quick Add</h2>
              <QuickAdd onAdd={addExpense} />
            </div>
          </div>
        </div>

        {/* Recent */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
          <h2 className="text-lg font-medium mb-4">Recent Expenses</h2>
          <RecentExpenses items={items} limit={8} />
        </div>
      </div>
    </div>
  );
}
