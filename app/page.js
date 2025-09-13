
"use client";
import { useEffect, useMemo, useState } from "react";

const CATEGORIES = ["General", "Food", "Travel", "Bills", "Shopping", "Other"];
const STORAGE_KEY = "spendwise:expenses";

export default function Dashboard() {
  // state 
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState("");

  // load/save localStorage 
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setExpenses(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch {}
  }, [expenses]);

  //derived stats
  const { total, count, avg } = useMemo(() => {
    const count = expenses.length;
    const total = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
    const avg = count ? total / count : 0;
    return { total, count, avg };
  }, [expenses]);

  // helpers
  function fmtMoney(n) {
    return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
  }
  function todayISO() {
    const d = new Date();
    return d.toISOString().slice(0, 10); // yyyy-mm-dd
  }

  // actions
  function addExpense(e) {
    e.preventDefault();
    const amt = Number(amount);
    if (!title.trim()) return alert("Please enter a title.");
    if (!Number.isFinite(amt) || amt <= 0) return alert("Enter a valid amount.");
    const when = date || todayISO();

    const newItem = {
      id: crypto.randomUUID(),
      title: title.trim(),
      amount: amt,
      category,
      date: when,
      createdAt: Date.now(),
    };
    setExpenses((prev) => [newItem, ...prev]);

    // reset form
    setTitle("");
    setAmount("");
    setCategory(CATEGORIES[0]);
    setDate("");
  }

  function removeExpense(id) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  // UI 
  return (
    <main className="min-h-screen p-6 text-neutral-200 bg-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Spendwise</h1>
        <div className="text-sm">
          Total Spent: <span className="font-semibold">{fmtMoney(total)}</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Spent" value={fmtMoney(total)} />
        <StatCard label="Transactions" value={count} />
        <StatCard label="Avg / Trxn" value={fmtMoney(avg)} />
      </div>

      {/* Add Expense */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Add Expense</h2>
        <form
          onSubmit={addExpense}
          className="grid grid-cols-1 md:grid-cols-[1fr_160px_160px_160px_120px] gap-3 bg-neutral-800 p-4 rounded-xl"
        >
          <input
            className="bg-neutral-900 rounded-md px-3 py-2 outline-none"
            placeholder="Title (e.g., Groceries)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="bg-neutral-900 rounded-md px-3 py-2 outline-none"
            placeholder="Amount"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select
            className="bg-neutral-900 rounded-md px-3 py-2 outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            className="bg-neutral-900 rounded-md px-3 py-2 outline-none"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={todayISO()}
          />
          <button className="bg-white text-black rounded-md px-4 py-2 font-medium hover:opacity-90">
            Add
          </button>
        </form>
      </section>

      {/* Recent Expenses */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Recent Expenses</h2>
        <div className="bg-neutral-800 rounded-xl">
          <div className="grid grid-cols-[1fr_140px_140px_120px_100px] px-4 py-3 text-sm border-b border-neutral-700">
            <div>Title</div>
            <div>Category</div>
            <div>Date</div>
            <div>Amount</div>
            <div>Action</div>
          </div>

          {expenses.length === 0 ? (
            <div className="px-4 py-8 text-sm text-neutral-400">
              No expenses yet — add one above.
            </div>
          ) : (
            <ul className="divide-y divide-neutral-700">
              {expenses.map((e) => (
                <li
                  key={e.id}
                  className="grid grid-cols-[1fr_140px_140px_120px_100px] px-4 py-3 items-center text-sm"
                >
                  <div className="truncate">{e.title}</div>
                  <div>{e.category}</div>
                  <div>
                    {new Date(e.date).toLocaleDateString(undefined, {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                  <div className="tabular-nums">{fmtMoney(e.amount)}</div>
                  <div>
                    <button
                      onClick={() => removeExpense(e.id)}
                      className="rounded-md px-2 py-1 bg-red-500/80 hover:bg-red-500 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-neutral-800 rounded-xl p-5">
      <div className="text-neutral-400 text-sm">{label}</div>
      <div className="text-2xl font-semibold mt-1">{String(value)}</div>
    </div>
  );
}
