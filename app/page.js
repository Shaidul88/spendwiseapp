"use client";

import Link from "next/link";
import InsightsAssistant from "@/components/InsightsAssistant";

export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-white">Home</h1>
        <p className="text-sm text-neutral-400">
          Jump to a section:
        </p>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard"
            className="px-3 py-2 rounded-lg ring-1 ring-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-sm"
          >
            Dashboard
          </Link>
          <Link
            href="/expenses"
            className="px-3 py-2 rounded-lg ring-1 ring-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-sm"
          >
            Expenses
          </Link>
          <Link
            href="/budgets"
            className="px-3 py-2 rounded-lg ring-1 ring-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-sm"
          >
            Budgets
          </Link>
          <Link
            href="/reports"
            className="px-3 py-2 rounded-lg ring-1 ring-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-sm"
          >
            Reports
          </Link>
          <Link
            href="/settings"
            className="px-3 py-2 rounded-lg ring-1 ring-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-sm"
          >
            Settings
          </Link>
          <Link
            href="/profile"
            className="px-3 py-2 rounded-lg ring-1 ring-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-sm"
          >
            Profile
          </Link>
        </div>
      </div>

      {/* AI assistant card */}
      <div>
        <InsightsAssistant />
      </div>
    </div>
  );
}
