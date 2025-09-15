"use client";
import { useState } from "react";

export const CATEGORIES = ["General", "Food", "Travel", "Bills", "Shopping", "Other"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function ExpenseForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      onAdd({ title, amount, category, date: date || todayISO() });
      setTitle(""); setAmount(""); setCategory(CATEGORIES[0]); setDate("");
    } catch (err) {
      setError(err.message || "Could not add expense");
    }
  }

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-3">Add Expense</h2>
      <form
        onSubmit={handleSubmit}
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
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
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
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </section>
  );
}
