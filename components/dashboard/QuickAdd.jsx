"use client";

import { useState } from "react";
import { CATEGORIES } from "@/components/expenses/ExpenseForm"; // reuse your list

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function QuickAdd({ onAdd }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: CATEGORIES?.[0] || "Other",
    date: todayISO(),
    note: "",
  });

  function submit(e) {
    e.preventDefault();
    const amt = Number(form.amount);
    if (!form.title.trim() || !amt) return;

    onAdd({
      title: form.title.trim(),
      amount: amt,
      category: form.category,
      date: form.date,
      note: form.note?.trim(),
    });

    setForm((f) => ({ ...f, title: "", amount: "", note: "" }));
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input
        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-700"
        placeholder="Title (e.g., Coffee)"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          step="0.01"
          className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-700"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <input
          type="date"
          className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-700"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <select
          className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-700"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {(CATEGORIES || ["Other"]).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-700"
          placeholder="(optional) Note"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-neutral-100 text-neutral-900 font-medium rounded-lg py-2 hover:bg-white transition"
      >
        Add Expense
      </button>
    </form>
  );
}
