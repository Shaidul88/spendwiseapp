"use client";

function fmtMoney(n) {
  return Number(n || 0).toLocaleString(undefined, { style: "currency", currency: "USD" });
}
function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return "-";
  }
}

export default function RecentExpenses({ items, limit = 8 }) {
  const rows = [...items]
    .sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0))
    .slice(0, limit);

  if (!rows.length) {
    return <div className="text-neutral-400 text-sm">No expenses yet — add one to get started.</div>;
  }

  return (
    <ul className="divide-y divide-neutral-800">
      {rows.map((e) => (
        <li key={e.id || `${e.title}-${e.date}-${e.amount}`} className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-xl bg-neutral-800 flex items-center justify-center text-sm">
              {String(e.category || "?").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="truncate">{e.title || "Expense"}</div>
              <div className="text-xs text-neutral-400">
                {e.category || "Uncategorized"} · {fmtDate(e.date || e.createdAt)}
              </div>
            </div>
          </div>
          <div className="font-medium">{fmtMoney(e.amount)}</div>
        </li>
      ))}
    </ul>
  );
}
