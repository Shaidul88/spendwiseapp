"use client";
import { useMemo, useRef, useState } from "react";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import ExpenseList from "@/components/expenses/ExpenseList";
import ExpenseFilters from "@/components/expenses/ExpenseFilters";
import SummaryCards from "@/components/expenses/SummaryCards";
import CategoryPieChart from "@/components/expenses/CategoryPieChart";
import MonthlyBarChart from "@/components/expenses/MonthlyBarChart";
import { useExpenses } from "@/hooks/useExpenses";
import { monthKey } from "@/lib/utils";

export default function ExpensesPage() {
  const { items, addExpense, updateExpense, removeExpense, clearAll } = useExpenses();
  const [filters, setFilters] = useState({
    q: "", category: "All", month: "All", sort: "date-desc", min: "", max: "",
  });
  const formRef = useRef(null);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const view = useMemo(() => {
    let rows = [...items];

    // text search
    if (filters.q.trim()) {
      const q = filters.q.toLowerCase();
      rows = rows.filter((e) => [e.title, e.note, e.category].some((f) => String(f || "").toLowerCase().includes(q)));
    }
    // category
    if (filters.category !== "All") {
      rows = rows.filter((e) => e.category === filters.category);
    }
    // month
    if (filters.month !== "All") {
      rows = rows.filter((e) => monthKey(e.date) === filters.month);
    }
    // amount range
    const min = Number(filters.min) || 0;
    const max = Number(filters.max) || Number.POSITIVE_INFINITY;
    rows = rows.filter((e) => e.amount >= min && e.amount <= max);

    // sort
    rows.sort((a, b) => {
      switch (filters.sort) {
        case "date-asc": return a.date.localeCompare(b.date);
        case "amount-desc": return b.amount - a.amount;
        case "amount-asc": return a.amount - b.amount;
        default: return b.date.localeCompare(a.date);
      }
    });

    const monthNow = monthKey(new Date().toISOString().slice(0, 10));
    const rowsThisMonth = rows.filter((e) => monthKey(e.date) === monthNow);

    // summary
    const monthTotal = rowsThisMonth.reduce((s, e) => s + e.amount, 0);
    const txCount = rowsThisMonth.length;
    const daysSoFar = new Date().getDate();
    const avgPerDay = daysSoFar ? monthTotal / daysSoFar : 0;
    const topCategory = rowsThisMonth
      .reduce((m, e) => (m[e.category] = (m[e.category] || 0) + e.amount, m), {})
      , cat = Object.entries(topCategory).sort((a,b)=>b[1]-a[1])[0]?.[0];

    // charts
    const byCat = Object.values(rowsThisMonth.reduce((acc, e) => {
      acc[e.category] = acc[e.category] || { name: e.category, value: 0 };
      acc[e.category].value += e.amount;
      return acc;
    }, {}));

    const last6 = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
      const m = d.toISOString().slice(0, 7);
      const total = items.filter((e) => monthKey(e.date) === m).reduce((s, x) => s + x.amount, 0);
      return { month: m, total };
    });

    return { rows, monthTotal, txCount, avgPerDay, topCategory: cat, byCat, last6 };
  }, [items, filters]);

  return (
    <main className="min-h-screen space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Expenses</h1>
        <div className="flex gap-2">
          <button onClick={scrollToForm} className="btn">Jump to form</button>
          <button onClick={clearAll} className="btn" title="Clear saved data">Clear All</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <ExpenseFilters filters={filters} setFilters={setFilters} />
          <ExpenseList items={view.rows} onRemove={removeExpense} onUpdate={updateExpense} />
        </div>
        <div className="space-y-4">
          <SummaryCards
            monthTotal={view.monthTotal}
            txCount={view.txCount}
            avgPerDay={view.avgPerDay}
            topCategory={view.topCategory}
          />
          <CategoryPieChart data={view.byCat} />
          <MonthlyBarChart data={view.last6} />
        </div>
      </div>

      <div ref={formRef}>
        <ExpenseForm onSubmit={addExpense} />
      </div>
    </main>
  );
}
