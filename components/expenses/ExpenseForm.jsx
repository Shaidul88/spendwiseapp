"use client";
import { useState, useRef } from "react";
import { CATEGORIES, todayISO } from "@/lib/utils";

export default function ExpenseForm({ onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: CATEGORIES[0],
    date: todayISO(),
    note: "",
  });
  const [errors, setErrors] = useState({});
  const formTopRef = useRef(null);

  function validate(f) {
    const e = {};
    const amt = Number(f.amount);
    if (!f.title.trim()) e.title = "Required";
    if (!f.amount || Number.isNaN(amt) || amt <= 0) e.amount = "Enter a positive number";
    if (!f.date) e.date = "Required";
    return { ok: Object.keys(e).length === 0, e, amt };
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const { ok, e, amt } = validate(form);
    setErrors(e);
    if (!ok) return;
    onSubmit({ ...form, amount: amt });
    setForm({ title: "", amount: "", category: CATEGORIES[0], date: todayISO(), note: "" });
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <form onSubmit={handleSubmit} className="panel p-4 space-y-4" ref={formTopRef}>
      <div className="flex items-center justify-between">
        <h2 className="panel-header">Add Expense</h2>
        <div className="badge">Local Save</div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="panel-header">Title</label>
          <input
            className="input mt-1"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Chipotle, Metrocard, Netflix…"
          />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="panel-header">Amount</label>
          <input
            className="input mt-1"
            inputMode="decimal"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            placeholder="12.50"
          />
          {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
        </div>

        <div>
          <label className="panel-header">Category</label>
          <select
            className="select mt-1"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="panel-header">Date</label>
          <input
            className="input mt-1"
            type="date"
            max={todayISO()}
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          />
          {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
        </div>
      </div>

      <div>
        <label className="panel-header">Note</label>
        <textarea
          className="input mt-1"
          rows={2}
          value={form.note}
          onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          placeholder="Optional details"
        />
      </div>

      <div className="flex justify-end">
        <button className="btn btn-primary">Add Expense</button>
      </div>
    </form>
  );
}
