"use client";
import { useState } from "react";
import { money } from "@/lib/utils";

function Row({ e, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: e.title, amount: String(e.amount), date: e.date, category: e.category, note: e.note || "" });

  const cellInput = "w-full border border-neutral-700 rounded px-2 py-1 bg-neutral-900 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/60";

  function save() {
    const amt = Number(form.amount);
    if (!form.title.trim() || Number.isNaN(amt) || amt <= 0) return;
    onUpdate(e.id, { ...form, amount: amt });
    setEditing(false);
  }

  if (editing) {
    return (
      <tr className="bg-neutral-800/60">
        <td className="p-2"><input className={cellInput} value={form.title} onChange={(ev)=>setForm({...form,title:ev.target.value})} /></td>
        <td className="p-2"><input className={cellInput} value={form.amount} onChange={(ev)=>setForm({...form,amount:ev.target.value})} /></td>
        <td className="p-2"><input type="date" className={cellInput} value={form.date} onChange={(ev)=>setForm({...form,date:ev.target.value})} /></td>
        <td className="p-2"><input className={cellInput} value={form.category} onChange={(ev)=>setForm({...form,category:ev.target.value})} /></td>
        <td className="p-2"><input className={cellInput} value={form.note} onChange={(ev)=>setForm({...form,note:ev.target.value})} /></td>
        <td className="p-2 text-right space-x-2">
          <button className="text-sm px-2 py-1 rounded bg-emerald-600 text-white" onClick={save}>Save</button>
          <button className="text-sm px-2 py-1 rounded bg-neutral-700" onClick={()=>setEditing(false)}>Cancel</button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-neutral-800/50">
      <td className="p-2 font-medium text-neutral-100">{e.title}</td>
      <td className="p-2 text-neutral-200">{money(e.amount)}</td>
      <td className="p-2 text-sm text-neutral-300">{e.date || "—"}</td>
      <td className="p-2 text-sm text-neutral-300">{e.category}</td>
      <td className="p-2 text-sm text-neutral-400">{e.note || ""}</td>
      <td className="p-2 text-right space-x-2">
        <button className="text-sm px-2 py-1 rounded bg-neutral-700" onClick={()=>setEditing(true)}>Edit</button>
        <button className="text-sm px-2 py-1 rounded bg-red-600 text-white" onClick={()=>onRemove(e.id)}>Delete</button>
      </td>
    </tr>
  );
}

export default function ExpenseList({ items, onUpdate, onRemove }) {
  if (!items.length) return <p className="text-sm text-neutral-400">No expenses yet.</p>;
  return (
    <div className="rounded-2xl bg-neutral-800 ring-1 ring-neutral-700 overflow-hidden">
      <table className="w-full text-sm text-neutral-200">
        <thead className="bg-neutral-700/60 text-left">
          <tr>
            <th className="p-2">Title</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Date</th>
            <th className="p-2">Category</th>
            <th className="p-2">Note</th>
            <th className="p-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((e) => <Row key={e.id} e={e} onUpdate={onUpdate} onRemove={onRemove} />)}
        </tbody>
      </table>
    </div>
  );
}
