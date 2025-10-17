// lib/utils.js
export const CATEGORIES = [
  "Food", "Groceries", "Transport", "Shopping", "Bills",
  "Entertainment", "Health", "Education", "Travel", "Other",
];

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function money(n) {
  const v = Number(n) || 0;
  return v.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export function monthKey(iso) {
  // "2025-10-08" to "2025-10"
  return (iso || todayISO()).slice(0, 7);
}
