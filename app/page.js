"use client";
import StatCard from "@/components/StatCard";
import { useExpenses } from "@/hooks/useExpenses";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function fmtMoney(n) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default function Dashboard() {
  const { stats } = useExpenses();
  const router = useRouter();

  // OPTIONAL: keyboard shortcut → “n” or “+” jumps to /expenses
  useEffect(() => {
    const onKey = (e) => {
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key.toLowerCase() === "n" || e.key === "+") {
          router.push("/expenses");
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <main className="min-h-screen p-6 text-neutral-200 bg-neutral-900">
      {/* this wrapper centers content and limits width */}
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Spendwise</h1>
          <div className="text-sm">
            Total Spent:{" "}
            <span className="font-semibold">{fmtMoney((stats?.total ?? 0))}</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <StatCard label="Total Spent" value={fmtMoney(stats.total)} />
          <StatCard label="Transactions" value={stats.count} />
          <StatCard label="Avg / Trxn" value={fmtMoney(stats.avg)} />
        </div>

        {/* CTA to Expenses */}
        <div>
          <a
            href="/expenses"
            className="inline-flex items-center rounded-md border border-neutral-700/60 bg-neutral-800 px-3 py-2 text-sm hover:bg-neutral-700"
          >
            Add / Manage Expenses →
          </a>
          <span className="ml-2 text-xs text-neutral-400">(press “N”)</span>
        </div>
      </div>
    </main>
  );
}
