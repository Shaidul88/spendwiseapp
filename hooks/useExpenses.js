"use client";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "spendwise:expenses";

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);

  // load/save
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

  // derived
  const stats = useMemo(() => {
    const count = expenses.length;
    const total = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
    const avg = count ? total / count : 0;
    return { total, count, avg };
  }, [expenses]);

  // CRUD
  function addExpense({ title, amount, category, date }) {
    const amt = Number(amount);
    if (!title?.trim()) throw new Error("Title required");
    if (!Number.isFinite(amt) || amt <= 0) throw new Error("Amount invalid");
    const when = date || new Date().toISOString().slice(0, 10);

    setExpenses((prev) => [
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        amount: amt,
        category,
        date: when,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }

  function removeExpense(id) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  function updateExpense(id, patch) {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
    );
  }

  return { expenses, stats, addExpense, removeExpense, updateExpense };
}
