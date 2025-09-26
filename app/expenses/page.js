"use client";
import { useMemo, useRef, useState } from "react";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import ExpenseList from "@/components/expenses/ExpenseList";
import ExpenseFilters from "@/components/expenses/ExpenseFilters";
import SummaryCards from "@/components/expenses/SummaryCards";
import { useExpenses } from "@/hooks/useExpenses";
import CategoryPieChart from "@/components/expenses/CategoryPieChart";
import MonthlyBarChart from "@/components/expenses/MonthlyBarChart";

export default function ExpensesPage() {
  const { items, addExpense, updateExpense, removeExpense, clearAll } = useExpenses();
  const [filters, setFilters] = useState({
    q: "",
    category: "All",
    month: "All",
    sort: "date-desc",
    min: "",
    max: "",
  });

  // Ref to scroll to the form
  const formRef = useRef(null);
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const view = useMemo(() => {
    let rows = [...items];

    // text search
    if (filters.q.trim()) {
      const q = filters.q.toLowerCase();
      rows = rows.filter((e) =>
        [e.title, e.note, e.category].some((f) => String(f || "").toLowerCase().includes(q))
      );
    }

    // category
    if (filters.category !== "All") rows = rows.filter((e) => e.category === filters.category);

    // month filter (YYYY-MM)
    if (filters.month !== "All") rows = rows.filter((e) => (e.date || "").startsWith(filters.month));

    // amount range
    const min = filters.min === "" ? -Infinity : Number(filters.min);
    const max = filters.max === "" ? Infinity : Number(filters.max);
    rows = rows.filter((e) => e.amount >= min && e.amount <= max);

    // sort
    const [key, dir] = filters.sort.split("-");
    rows.sort((a, b) => {
      let va = key === "date" ? a.date : a.amount;
      let vb = key === "date" ? b.date : b.amount;
      if (key === "date") {
        va = va || "";
        vb = vb || "";
      }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return dir === "asc" ? cmp : -cmp;
    });

    const total = rows.reduce((s, e) => s + e.amount, 0);
    return { rows, total };
  }, [items, filters]);

  return (
    <main className="min-h-screen p-6 bg-neutral-900 text-neutral-200">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Expenses</h1>
          <div className="flex gap-2">
            <button
              onClick={scrollToForm}
              className="text-sm px-3 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white"
            >
              Add Expense
            </button>
            <button
              onClick={clearAll}
              className="text-sm px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white"
            >
              Clear all
            </button>
          </div>
        </header>

        <SummaryCards items={items} />

        {/* Charts */}
        <CategoryPieChart expenses={items} />
        <MonthlyBarChart items={items} />

        <div className="grid md:grid-cols-3 gap-6">
          {/* Form section (scroll target) */}
          <div className="md:col-span-1" ref={formRef}>
            <ExpenseForm onSubmit={addExpense} />
          </div>

          <div className="md:col-span-2 space-y-4">
            <ExpenseFilters filters={filters} onChange={setFilters} items={items} />

            {/* Only the list scrolls */}
            <div className="h-[60vh] overflow-y-auto pr-2 custom-scrollbar rounded-xl bg-neutral-900/20">
              <ExpenseList
                items={view.rows}
                onUpdate={updateExpense}
                onRemove={removeExpense}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
