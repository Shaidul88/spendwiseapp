"use client";
import { useState } from "react";
import { CATEGORIES } from "./ExpenseForm";

function fmtMoney(n) {
  return Number(n).toLocaleString(undefined, { style: "currency", currency: "USD" });
}
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function ExpenseList({ items, onRemove, onUpdate }) {
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: "", amount: "", category: CATEGORIES[0], date: todayISO() });

  function startEdit(e) {
    setEditId(e.id);
    setForm({
      title: e.title,
      amount: String(e.amount),
      category: e.category,
      date: e.date || todayISO(),
    });
  }
  function cancelEdit() {
    setEditId(null);
  }
  function saveEdit(id) {
    const amt = Number(form.amount);
    if (!form.title.trim()) return alert("Title required");
    if (!Number.isFinite(amt) || amt <= 0) return alert("Amount invalid");
    onUpdate(id, { title: form.title.trim(), amount: amt, category: form.category, date: form.date || todayISO() });
    setEditId(null);
  }

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Recent Expenses</h2>
      <div className="bg-neutral-800 rounded-xl">
        <div className="grid grid-cols-[1fr_140px_140px_120px_160px] px-4 py-3 text-sm border-b border-neutral-700">
          <div>Title</div>
          <div>Category</div>
          <div>Date</div>
          <div>Amount</div>
          <div>Action</div>
        </div>

        {items.length === 0 ? (
          <div className="px-4 py-8 text-sm text-neutral-400">No expenses yet — add one above.</div>
        ) : (
          <ul className="divide-y divide-neutral-700">
            {items.map((e) => (
              <li key={e.id} className="grid grid-cols-[1fr_140px_140px_120px_160px] px-4 py-3 items-center text-sm gap-2">
                {editId === e.id ? (
                  <>
                    <input
                      className="bg-neutral-900 rounded-md px-2 py-1 outline-none"
                      value={form.title}
                      onChange={(ev) => setForm((f) => ({ ...f, title: ev.target.value }))}
                    />
                    <select
                      className="bg-neutral-900 rounded-md px-2 py-1 outline-none"
                      value={form.category}
                      onChange={(ev) => setForm((f) => ({ ...f, category: ev.target.value }))}
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input
                      type="date"
                      className="bg-neutral-900 rounded-md px-2 py-1 outline-none"
                      value={form.date}
                      max={todayISO()}
                      onChange={(ev) => setForm((f) => ({ ...f, date: ev.target.value }))}
                    />
                    <input
                      className="bg-neutral-900 rounded-md px-2 py-1 outline-none"
                      inputMode="decimal"
                      value={form.amount}
                      onChange={(ev) => setForm((f) => ({ ...f, amount: ev.target.value }))}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(e.id)} className="rounded-md px-2 py-1 bg-emerald-500/90 hover:bg-emerald-500 text-white">Save</button>
                      <button onClick={cancelEdit} className="rounded-md px-2 py-1 bg-neutral-600 hover:bg-neutral-500 text-white">Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="truncate">{e.title}</div>
                    <div>{e.category}</div>
                    <div>{new Date(e.date).toLocaleDateString(undefined, { month: "2-digit", day: "2-digit", year: "numeric" })}</div>
                    <div className="tabular-nums">{fmtMoney(e.amount)}</div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(e)} className="rounded-md px-2 py-1 bg-blue-500/80 hover:bg-blue-500 text-white">Edit</button>
                      <button onClick={() => onRemove(e.id)} className="rounded-md px-2 py-1 bg-red-500/80 hover:bg-red-500 text-white">Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
