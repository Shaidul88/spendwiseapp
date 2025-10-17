"use client";

import { useEffect, useMemo, useState } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { useBudgets } from "@/hooks/useBudgets";
import { CATEGORIES } from "@/lib/utils"; //  use the shared categories

function fmtMoney(n) {
  return Number(n || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export default function BudgetPage() {
  // All hooks must be called unconditionally and in the same order 
  const mounted = useMounted();
  const { items } = useExpenses();
  const { budgets, setBudget, removeBudget, clearBudgets } = useBudgets();

  // month: set on client to avoid SSR timezone drift
  const [month, setMonth] = useState("");
  useEffect(() => { setMonth(new Date().toISOString().slice(0, 7)); }, []);

  // derive values via hooks BEFORE any conditional returns
  const spentByCat = useMemo(() => {
    const map = {};
    for (const e of items || []) {
      if (!e?.date || !e?.category) continue;
      if (String(e.date).slice(0, 7) !== month) continue; // "YYYY-MM"
      map[e.category] = (map[e.category] || 0) + Number(e.amount || 0);
    }
    return map;
  }, [items, month]);

  const totalBudget = useMemo(
    () => Object.values(budgets || {}).reduce((a, b) => a + (Number(b) || 0), 0),
    [budgets]
  );
  const totalSpent = useMemo(
    () => Object.values(spentByCat || {}).reduce((a, v) => a + (v || 0), 0),
    [spentByCat]
  );

  // Now it’s safe to conditionally return the skeleton 
  if (!mounted || !month) {
    return (
      <main className="p-6 space-y-6">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="h-6 w-40 bg-neutral-800 rounded" />
            <div className="h-4 w-72 bg-neutral-900 rounded mt-2" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-40 bg-neutral-900 border border-neutral-800 rounded" />
            <div className="h-9 w-24 bg-neutral-900 border border-neutral-800 rounded" />
          </div>
        </header>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-20 bg-neutral-900 border border-neutral-800 rounded-2xl" />
          <div className="h-20 bg-neutral-900 border border-neutral-800 rounded-2xl" />
          <div className="h-20 bg-neutral-900 border border-neutral-800 rounded-2xl" />
        </section>
      </main>
    );
  }

  //  Main UI 
  return (
    <main className="p-6 space-y-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Budgets</h1>
          <p className="text-sm text-gray-400">Set monthly limits per category and track spending against them.</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Month</label>
          <input
            type="month"
            className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-sm"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <button
            onClick={clearBudgets}
            className="text-sm px-3 py-2 rounded-md border border-neutral-700 hover:bg-neutral-800"
            title="Clear all budgets (keeps expenses)"
          >
            Clear All
          </button>
        </div>
      </header>

      {/* Quick stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Budget" value={fmtMoney(totalBudget)} />
        <StatCard title="Total Spent" value={fmtMoney(totalSpent)} />
        <StatCard title="Remaining" value={fmtMoney(Math.max(0, totalBudget - totalSpent))} />
      </section>

      {/* Add / Update budget */}
      <BudgetForm
        categories={CATEGORIES}
        budgets={budgets}
        onSave={(cat, amt) => setBudget(cat, amt)}
      />

      {/* Per-category list */}
      <section className="space-y-3">
        {CATEGORIES.map((cat) => {
          const budget = Number(budgets?.[cat] || 0);
          const spent = Number(spentByCat?.[cat] || 0);
          return (
            <BudgetRow
              key={cat}
              category={cat}
              budget={budget}
              spent={spent}
              onRemove={() => removeBudget(cat)}
              onSave={(amt) => setBudget(cat, amt)}
            />
          );
        })}
      </section>
    </main>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-neutral-800 p-4 bg-neutral-900">
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-xl font-semibold mt-1" suppressHydrationWarning>
        {value}
      </div>
    </div>
  );
}

function BudgetForm({ categories, budgets, onSave }) {
  const [category, setCategory] = useState(categories[0]);
  const [amount, setAmount] = useState("");

  function submit(e) {
    e.preventDefault();
    onSave(category, Number(amount || 0));
    setAmount("");
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-neutral-800 p-4 bg-neutral-900 grid grid-cols-1 md:grid-cols-4 gap-3"
    >
      <div>
        <label className="text-sm block mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-3 py-2 text-sm"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Current: {fmtMoney(budgets?.[category] || 0)}
        </p>
      </div>

      <div>
        <label className="text-sm block mb-1">Monthly Budget</label>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-700 rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div className="md:col-span-2 flex items-end">
        <button
          type="submit"
          className="w-full md:w-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-neutral-700 text-sm"
        >
          Save Budget
        </button>
      </div>
    </form>
  );
}

function BudgetRow({ category, budget, spent, onRemove, onSave }) {
  const over = spent > budget;
  const remaining = Math.max(0, budget - spent);
  const width = budget ? Math.min(100, (spent / budget) * 100) : 0;

  return (
    <div className="rounded-2xl border border-neutral-800 p-4 bg-neutral-900">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="font-medium">{category}</div>
        <div className="text-sm text-gray-400">
          <span suppressHydrationWarning>
            {fmtMoney(spent)} / {fmtMoney(budget)}
          </span>{" "}
          •{" "}
          {over ? (
            <span className="text-red-400 font-medium" suppressHydrationWarning>
              Over by {fmtMoney(spent - budget)}
            </span>
          ) : (
            <span className="text-green-400" suppressHydrationWarning>
              Remaining {fmtMoney(remaining)}
            </span>
          )}
        </div>
      </div>

      <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${over ? "bg-red-500" : "bg-green-500"}`}
          style={{ width: `${width}%` }}
        />
      </div>

      <div className="flex items-center gap-2 mt-3">
        <InlineBudgetEditor initial={budget} onSave={(amt) => onSave(amt)} />
        {budget > 0 && (
          <button
            onClick={onRemove}
            className="text-xs px-3 py-1 rounded-lg border border-neutral-700 hover:bg-neutral-800"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

function InlineBudgetEditor({ initial, onSave }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(initial || ""));

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-xs px-3 py-1 rounded-lg border border-neutral-700 hover:bg-neutral-800"
      >
        {initial ? "Edit Budget" : "Add Budget"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        step="0.01"
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="w-28 bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-xs"
        placeholder="0.00"
      />
      <button
        onClick={() => { onSave(Number(val || 0)); setEditing(false); }}
        className="text-xs px-3 py-1 rounded-lg border border-neutral-700 hover:bg-neutral-800"
      >
        Save
      </button>
      <button
        onClick={() => { setVal(String(initial || "")); setEditing(false); }}
        className="text-xs px-3 py-1 rounded-lg border border-neutral-700 hover:bg-neutral-800"
      >
        Cancel
      </button>
    </div>
  );
}
