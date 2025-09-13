"use client";
import { useEffect, useMemo, useState } from "react";

export default function Dashboard() {
  // ==== State ====
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", category: "General", date: "" });

  // ==== Load/Save to localStorage ====
  useEffect(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem("spendwise:expenses");
    if (saved) setExpenses(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("spendwise:expenses", JSON.stringify(expenses));
    }
  }, [expenses]);

  // ==== Derived totals ====
  const total = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    [expenses]
  );

  // ==== Handlers ====
  const addExpense = (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;

    const newItem = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      amount: Number(form.amount),
      category: form.category,
      date: form.date || new Date().toISOString().slice(0, 10),
    };
    setExpenses((prev) => [newItem, ...prev]);
    setForm({ title: "", amount: "", category: "General", date: "" });
  };

  const removeExpense = (id) => setExpenses((prev) => prev.filter((e) => e.id !== id));

  // ==== UI ====
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Top bar */}
      <header className="border-b border-neutral-800 sticky top-0 bg-neutral-950/70 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">Spendwise</h1>
          <div className="text-sm text-neutral-400">Total Spent: <span className="text-neutral-100 font-medium">${total.toFixed(2)}</span></div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 grid gap-8">
        {/* Stat cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card title="Total Spent" value={`$${total.toFixed(2)}`} />
          <Card title="Transactions" value={expenses.length} />
          <Card title="Avg / Txn" value={`$${(expenses.length ? total / expenses.length : 0).toFixed(2)}`} />
        </section>

        {/* Add expense form */}
        <section className="grid gap-4">
          <h2 className="text-lg font-semibold">Add Expense</h2>
          <form onSubmit={addExpense} className="grid gap-3 sm:grid-cols-4 bg-neutral-900 p-4 rounded-xl border border-neutral-800">
            <input
              className="sm:col-span-2 rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-700"
              placeholder="Title (e.g., Groceries)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              className="rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-700"
              placeholder="Amount"
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <select
              className="rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-700"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option>General</option>
              <option>Food</option>
              <option>Transport</option>
              <option>Bills</option>
              <option>Shopping</option>
              <option>Health</option>
            </select>
            <input
              className="rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-700 sm:col-span-2"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <button
              type="submit"
              className="sm:col-span-2 rounded-lg bg-white text-black font-medium px-4 py-2 hover:opacity-90 transition"
            >
              Add
            </button>
          </form>
        </section>

        {/* Table */}
        <section className="grid gap-4">
          <h2 className="text-lg font-semibold">Recent Expenses</h2>
          <div className="overflow-x-auto rounded-xl border border-neutral-800">
            <table className="min-w-full text-sm">
              <thead className="bg-neutral-900 text-neutral-300">
                <tr>
                  <Th>Title</Th>
                  <Th>Category</Th>
                  <Th>Date</Th>
                  <Th align="right">Amount</Th>
                  <Th align="center">Action</Th>
                </tr>
              </thead>
              <tbody>
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-6 text-neutral-400">
                      No expenses yet — add one above.
                    </td>
                  </tr>
                ) : (
                  expenses.map((e) => (
                    <tr key={e.id} className="border-t border-neutral-800">
                      <Td>{e.title}</Td>
                      <Td>{e.category}</Td>
                      <Td>{e.date}</Td>
                      <Td align="right">${Number(e.amount).toFixed(2)}</Td>
                      <Td align="center">
                        <button
                          onClick={() => removeExpense(e.id)}
                          className="text-red-300 hover:text-red-200 underline underline-offset-2"
                        >
                          Remove
                        </button>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

/* --- tiny presentational helpers --- */
function Card({ title, value }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="text-neutral-400 text-sm">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function Th({ children, align = "left" }) {
  return (
    <th className={`px-4 py-3 text-${align} font-medium`}>
      <div className={align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"}>
        {children}
      </div>
    </th>
  );
}
function Td({ children, align = "left" }) {
  return (
    <td className={`px-4 py-3`}>
      <div className={align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"}>
        {children}
      </div>
    </td>
  );
}
