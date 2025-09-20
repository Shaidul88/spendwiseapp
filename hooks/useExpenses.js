"use client";
import { useEffect, useMemo, useState } from "react";

const KEY = "spendwise:expenses";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function useExpenses() {
  // ✅ Initialize from localStorage synchronously on first render
  const [items, setItems] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : [];
      }
    } catch {}
    return [];
  });

  // ✅ Persist only when items actually change (no early overwrite)
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(KEY, JSON.stringify(items));
      }
    } catch (e) {
      console.warn("Failed to write local data:", e);
    }
  }, [items]);

  const stats = useMemo(() => {
    const total = items.reduce((s, e) => s + e.amount, 0);
    const count = items.length;
    const avg = count ? total / count : 0;
    return { total, count, avg };
  }, [items]);

  function addExpense({ title, amount, date, category, note }) {
    const amt = Number(amount);
    setItems(prev => [{ id: uid(), title, amount: amt, date, category, note }, ...prev]);
  }
  function updateExpense(id, patch) {
    setItems(prev => prev.map(e => (e.id === id ? { ...e, ...patch } : e)));
  }
  function removeExpense(id) {
    setItems(prev => prev.filter(e => e.id !== id));
  }
  function clearAll() {
    if (confirm("Delete all expenses?")) setItems([]);
  }

  return { items, stats, addExpense, updateExpense, removeExpense, clearAll };
}