"use client";
import { useState } from "react";
import { CATEGORIES, todayISO, money } from "@/lib/utils";

export default function ExpenseForm({ onSubmit }) {
  const [form, setForm] = useState({ title: "", amount: "", category: CATEGORIES[0], date: todayISO(), note: "" });
  const [errors, setErrors] = useState({});

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
  }

  const panel = "space-y-3 p-4 rounded-2xl bg-neutral-800 ring-1 ring-neutral-700 text-neutral-100";
  const label = "text-sm text-neutral-300";
  const input = "w-full rounded-xl px-3 py-2 bg-neutral-700 border border-neutral-600 text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500";
  const select = input;

  return (
    <form onSubmit={handleSubmit} className={panel}>
      <h2 className="font-semibold">Add expense</h2>

      <div className="space-y-1">
        <label className={label}>Title</label>
        <input className={input} value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} placeholder="Coffee" />
        {errors.title && <p className="text-xs text-red-400">{errors.title}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className={label}>Amount</label>
          <input className={input} value={form.amount} onChange={(e)=>setForm({...form,amount:e.target.value})} placeholder="3.75" />
          {errors.amount && <p className="text-xs text-red-400">{errors.amount}</p>}
        </div>
        <div className="space-y-1">
          <label className={label}>Date</label>
          <input type="date" className={input} value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} />
          {errors.date && <p className="text-xs text-red-400">{errors.date}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className={label}>Category</label>
          <select className={select} value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className={label}>Note (optional)</label>
          <input className={input} value={form.note} onChange={(e)=>setForm({...form,note:e.target.value})} placeholder="extra details" />
        </div>
      </div>

      <button className="w-full rounded-xl py-2 bg-emerald-600 hover:bg-emerald-500 text-white">
        Save {form.amount && `(${money(Number(form.amount))})`}
      </button>
    </form>
  );
}
