"use client";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";

const KEY = "spendwise:expenses:v1";

/* helpers */
function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function readStorage() {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(KEY);
    const val = raw ? JSON.parse(raw) : [];
    return Array.isArray(val) ? val : [];
  } catch {
    return [];
  }
}
function writeStorage(items) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
}

export function useExpenses() {
  const [items, setItems] = useState([]);     // hydrate on client
  const hydrated = useRef(false);

  // Hydrate after client nav/render (next tick)
  useEffect(() => {
    const t = setTimeout(() => {
      setItems(readStorage());
      hydrated.current = true;
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // Recheck storage when tab regains focus (covers page switches)
  useEffect(() => {
    const onFocus = () => setItems(readStorage());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === KEY) setItems(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Persist after hydrate when items change
  useEffect(() => {
    if (!hydrated.current) return;
    writeStorage(items);
  }, [items]);

  // Mutations (write immediately for durability)
  const addExpense = useCallback((e) => {
    setItems((prev) => {
      const next = [{ id: uuid(), ...e }, ...prev];
      writeStorage(next);
      return next;
    });
  }, []);

  const updateExpense = useCallback((id, patch) => {
    setItems((prev) => {
      const next = prev.map((it) => (it.id === id ? { ...it, ...patch } : it));
      writeStorage(next);
      return next;
    });
  }, []);

  const removeExpense = useCallback((id) => {
    setItems((prev) => {
      const next = prev.filter((it) => it.id !== id);
      writeStorage(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    writeStorage([]);
  }, []);

  const stats = useMemo(() => {
    const total = items.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    return { count: items.length, total };
  }, [items]);

  return { items, addExpense, updateExpense, removeExpense, clearAll, stats, hydrated: hydrated.current };
}
