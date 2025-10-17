"use client";
import { useState } from "react";
import { CATEGORIES, todayISO, money } from "@/lib/utils";

export default function ExpenseList({ items, onRemove, onUpdate }) {
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: "", amount: "", category: CATEGORIES[0], date: todayISO() });

  function startEdit(e) {
    setEditId(e.id);
    setForm({ title: e.title, amount: String(e.amount), category: e.category, date: e.date || todayISO() });
  }
  function cancelEdit() { setEditId(null); }
  function saveEdit(id) {
    const amt = Number(form.amount);
    if (!form.title.trim() || !amt || Number.isNaN(amt)) return;
    onUpdate(id, { title: form.title.trim(), amount: amt, category: form.category, date: form.date });
    setEditId(null);
  }

  if (!items.length) {
    return <div className="panel p-4 text-sm text-neutral-400">No expenses yet. Add one above.</div>;
  }

  return (
    <div className="panel p-2 overflow-auto">
      <table className="w-full text-sm">
        <thead className="text-neutral-300">
          <tr className="text-left">
            <th className="p-2">Title</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Category</th>
            <th className="p-2">Date</th>
            <th className="p-2 w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((e) => (
            <tr key={e.id} className="border-t border-neutral-700">
              <td className="p-2">
                {editId === e.id ? (
                  <input className="input" value={form.title} onChange={(ev) => setForm((f) => ({ ...f, title: ev.target.value }))}/>
                ) : e.title}
              </td>
              <td className="p-2">
                {editId === e.id ? (
                  <input className="input" inputMode="decimal" value={form.amount} onChange={(ev) => setForm((f) => ({ ...f, amount: ev.target.value }))}/>
                ) : money(e.amount)}
              </td>
              <td className="p-2">
                {editId === e.id ? (
                  <select className="select" value={form.category} onChange={(ev)=>setForm((f)=>({...f,category:ev.target.value}))}>
                    {CATEGORIES.map((c)=><option key={c}>{c}</option>)}
                  </select>
                ) : e.category}
              </td>
              <td className="p-2">
                {editId === e.id ? (
                  <input className="input" type="date" max={todayISO()} value={form.date} onChange={(ev)=>setForm((f)=>({...f,date:ev.target.value}))}/>
                ) : e.date}
              </td>
              <td className="p-2">
                {editId === e.id ? (
                  <div className="flex gap-2">
                    <button className="btn btn-primary" onClick={() => saveEdit(e.id)}>Save</button>
                    <button className="btn" onClick={cancelEdit}>Cancel</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button className="btn" onClick={() => startEdit(e)}>Edit</button>
                    <button className="btn" onClick={() => onRemove(e.id)}>Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
