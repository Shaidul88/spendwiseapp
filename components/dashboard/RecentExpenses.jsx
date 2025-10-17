// components/dashboard/RecentExpenses.jsx
"use client";
import { money } from "@/lib/utils";

export default function RecentExpenses({ items }) {
  const recent = [...items]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  if (!recent.length) {
    return <div className="panel p-4 text-sm text-neutral-400">No recent expenses yet.</div>;
  }

  return (
    <div className="panel p-2 overflow-auto">
      <table className="w-full text-sm">
        <thead className="text-neutral-300">
          <tr className="text-left">
            <th className="p-2">Title</th>
            <th className="p-2">Category</th>
            <th className="p-2">Date</th>
            <th className="p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {recent.map((e) => (
            <tr key={e.id} className="border-t border-neutral-700">
              <td className="p-2">{e.title}</td>
              <td className="p-2">{e.category}</td>
              <td className="p-2">{e.date}</td>
              <td className="p-2">{money(e.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
