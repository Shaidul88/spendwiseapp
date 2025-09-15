"use client";
import StatCard from "@/components/StatCard";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import { useExpenses } from "@/hooks/useExpenses";

function fmtMoney(n) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default function Dashboard() {
  const { expenses, stats, addExpense, removeExpense, updateExpense } = useExpenses();

  return (
    <main className="min-h-screen p-6 text-neutral-200 bg-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Spendwise</h1>
        <div className="text-sm">
          Total Spent: <span className="font-semibold">{fmtMoney(stats.total)}</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Spent" value={fmtMoney(stats.total)} />
        <StatCard label="Transactions" value={stats.count} />
        <StatCard label="Avg / Trxn" value={fmtMoney(stats.avg)} />
      </div>

      <ExpenseForm onAdd={addExpense} />
      <ExpenseList items={expenses} onRemove={removeExpense} onUpdate={updateExpense} />
    </main>
  );
}
