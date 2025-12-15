"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import InsightsAssistant from "@/components/InsightsAssistant";
import MonthlyBarChart from "@/components/expenses/MonthlyBarChart";
import CategoryPieChart from "@/components/expenses/CategoryPieChart";
import { useExpenses } from "@/hooks/useExpenses";
import { useBudgets } from "@/hooks/useBudgets";
import { CATEGORIES, money, monthKey } from "@/lib/utils";

export default function Page() {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const { items } = useExpenses();
  const { budgets } = useBudgets();

  const reportData = useMemo(() => {
    const nowMonth = monthKey(new Date().toISOString().slice(0, 10));
    const thisMonth = items.filter((e) => monthKey(e.date) === nowMonth);
    const monthTotal = thisMonth.reduce((s, e) => s + (Number(e.amount) || 0), 0);

    const byCat = Object.values(
      thisMonth.reduce((acc, e) => {
        acc[e.category] = acc[e.category] || { name: e.category, value: 0 };
        acc[e.category].value += Number(e.amount) || 0;
        return acc;
      }, {})
    );

    const last6 = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const m = d.toISOString().slice(0, 7);
      const total = items
        .filter((e) => monthKey(e.date) === m)
        .reduce((s, x) => s + (Number(x.amount) || 0), 0);
      return { month: m, total };
    });

    return { monthTotal, byCat, last6 };
  }, [items]);

  const budgetSummary = useMemo(() => {
    const currentMonth = monthKey(new Date().toISOString().slice(0, 10));
    const spentByCat = items.reduce((map, e) => {
      if (monthKey(e.date) !== currentMonth) return map;
      map[e.category] = (map[e.category] || 0) + (Number(e.amount) || 0);
      return map;
    }, {});

    return CATEGORIES.map((cat) => {
      const budget = Number(budgets?.[cat] || 0);
      const spent = Number(spentByCat?.[cat] || 0);
      const remaining = Math.max(0, budget - spent);
      return { category: cat, budget, spent, remaining };
    });
  }, [budgets, items]);

  const slides = useMemo(
    () => [
      {
        key: "reports",
        title: "Spending Reports",
        subtitle: "Recent performance at a glance",
        content: (
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
              <div className="text-sm text-neutral-400 mb-2">Last 6 Months</div>
              <MonthlyBarChart data={reportData.last6} />
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
              <div className="text-sm text-neutral-400 mb-2">This Month by Category</div>
              {reportData.byCat.length ? (
                <CategoryPieChart data={reportData.byCat} />
              ) : (
                <div className="h-48 flex items-center justify-center text-sm text-neutral-500">
                  Add expenses to see category mix.
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        key: "budgets",
        title: "Available by Category",
        subtitle: "Remaining spend for this month",
        content: (
          <div className="grid md:grid-cols-2 gap-3">
            {budgetSummary.map((row) => {
              const pct = row.budget ? Math.min(100, (row.spent / row.budget) * 100) : 0;
              return (
                <div
                  key={row.category}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4"
                >
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-neutral-100">{row.category}</span>
                    <span className="text-neutral-400" suppressHydrationWarning>
                      {row.budget ? `${money(row.spent)} / ${money(row.budget)}` : "No limit set"}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${row.spent > row.budget ? "bg-red-500" : "bg-green-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mt-2">
                    <span>Spent {money(row.spent)}</span>
                    <span className={row.spent > row.budget ? "text-red-400" : "text-green-400"} suppressHydrationWarning>
                      {row.spent > row.budget
                        ? `Over by ${money(row.spent - row.budget)}`
                        : `Left ${money(row.remaining)}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ),
      },
    ],
    [reportData.byCat, reportData.last6, budgetSummary]
  );

  useEffect(() => {
    if (!slides.length) return;
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % slides.length);
    }, 6500);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="relative min-h-screen p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-white">Home</h1>
        <p className="text-sm text-neutral-400">Jump to a section:</p>

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

      <section className="max-w-5xl mx-auto w-full">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-950/60 backdrop-blur p-6 shadow-2xl shadow-black/40">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500">Highlights</div>
              <h2 className="text-xl font-semibold text-white">{slides[slide]?.title}</h2>
              <p className="text-sm text-neutral-400">{slides[slide]?.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSlide((s) => (s - 1 + slides.length) % slides.length)}
                className="px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-sm"
                aria-label="Previous slide"
              >
                Prev
              </button>
              <button
                onClick={() => setSlide((s) => (s + 1) % slides.length)}
                className="px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-sm"
                aria-label="Next slide"
              >
                Next
              </button>
            </div>
          </div>

          <div className="transition-all duration-300">{slides[slide]?.content}</div>

          <div className="flex items-center justify-center gap-2 mt-4">
            {slides.map((s, idx) => (
              <button
                key={s.key}
                onClick={() => setSlide(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  idx === slide ? "w-8 bg-indigo-500" : "w-3 bg-neutral-700 hover:bg-neutral-600"
                }`}
                aria-label={`Go to ${s.title}`}
              />
            ))}
          </div>
        </div>
      </section>

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
