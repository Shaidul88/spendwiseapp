"use client";

import { useState } from "react";
import Link from "next/link";
import InsightsAssistant from "@/components/InsightsAssistant";

export default function Page() {
  const [assistantOpen, setAssistantOpen] = useState(false);

  return (
    <div className="relative min-h-screen p-6 space-y-6">
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

      {/* Floating assistant bubble */}
      <button
        type="button"
        aria-label="Toggle Spendwise Assistant"
        aria-pressed={assistantOpen}
        aria-expanded={assistantOpen}
        onClick={() => setAssistantOpen((open) => !open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-900/40 border border-indigo-400/30 flex items-center justify-center transition z-50"
      >
        {assistantOpen ? "X" : "AI"}
      </button>

      {assistantOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-md z-40 drop-shadow-2xl">
          <InsightsAssistant />
        </div>
      )}
    </div>
  );
}
