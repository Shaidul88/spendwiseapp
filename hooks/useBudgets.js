"use client";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "spendwise:budgets:v1";

function readStorage() {
  try {
    if (typeof window === "undefined") return {};
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStorage(obj) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {}
}

export function useBudgets() {
  const [budgets, setBudgets] = useState({});
  const hydrated = useRef(false);

  //  Hydrate *after* the browser has rendered the page
  useEffect(() => {
    // Delay to next tick ensures DOM + storage ready after client nav
    const timer = setTimeout(() => {
      const data = readStorage();
      setBudgets(data);
      hydrated.current = true;
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Rehydrate when page becomes visible again (e.g. after nav) 
  useEffect(() => {
    const handleFocus = () => {
      const latest = readStorage();
      setBudgets(latest);
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // Persist when budgets change 
  useEffect(() => {
    if (!hydrated.current) return;
    writeStorage(budgets);
  }, [budgets]);

  //  Mutators (write immediately) 
  function setBudget(category, amount) {
    setBudgets((b) => {
      const next = { ...b, [category]: Number(amount) || 0 };
      writeStorage(next);
      return next;
    });
  }

  function removeBudget(category) {
    setBudgets((b) => {
      const copy = { ...b };
      delete copy[category];
      writeStorage(copy);
      return copy;
    });
  }

  function clearBudgets() {
    setBudgets({});
    writeStorage({});
  }

  return { budgets, setBudget, removeBudget, clearBudgets };
}
