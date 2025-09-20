export const CATEGORIES = [
"Food",
"Transport",
"Groceries",
"Housing",
"Utilities",
"Health",
"Education",
"Entertainment",
"Other",
];


export function todayISO() {
const d = new Date();
return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}


export function money(n) {
if (!Number.isFinite(n)) return "—";
return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}


export function uid() {
return Math.random().toString(36).slice(2, 9);
}


// Build a unique list of YYYY-MM strings present in the dataset, sorted desc
export function monthOptions(dates) {
const set = new Set();
for (const d of dates) if (d && d.length >= 7) set.add(d.slice(0, 7));
return Array.from(set).sort().reverse();
}