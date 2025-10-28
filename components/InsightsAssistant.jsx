"use client";

import { useState } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { useBudgets } from "@/hooks/useBudgets";
import { money, monthName } from "@/lib/utils";

// helpers that read your real data

// total spent in the current month
function monthlyTotal(expenses) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth(); // 0-11
  let total = 0;
  expenses.forEach((e) => {
    const d = new Date(e.date);
    if (d.getFullYear() === y && d.getMonth() === m) {
      total += e.amount;
    }
  });
  return total;
}

// average spent per day in current month
function avgPerDayThisMonth(expenses) {
  const total = monthlyTotal(expenses);
  const todayDayNum = new Date().getDate(); // 1..31
  if (!todayDayNum) return 0;
  return total / todayDayNum;
}

// for each category, how close are we to the budget?
function analyzeBudgets(expenses, budgets) {
  // sum spending by category (this month only)
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  const spentByCat = {};
  expenses.forEach((e) => {
    const d = new Date(e.date);
    if (d.getFullYear() === y && d.getMonth() === m) {
      spentByCat[e.category] = (spentByCat[e.category] || 0) + e.amount;
    }
  });

  // normalize budgets to array of { category, limit }
  const budgetList = Array.isArray(budgets)
    ? budgets
    : Object.entries(budgets || {}).map(([category, limit]) => ({ category, limit }));

  // build report comparing spend vs limit
  const report = budgetList.map((b) => {
    const spent = spentByCat[b.category] || 0;
    const pct = b.limit > 0 ? (spent / b.limit) * 100 : 0;
    return {
      category: b.category,
      limit: b.limit,
      spent,
      left: b.limit - spent,
      pct,
    };
  });

  if (report.length === 0) {
    return {
      summary:
        "You don't have any budgets set yet. Go to Budgets and add one so I can track pressure.",
      hottest: null,
      report,
    };
  }

  // sort by % used, highest first
  report.sort((a, b) => b.pct - a.pct);
  const hottest = report[0];

  let summary;
  const pctRounded = Math.round(hottest.pct);

  if (pctRounded >= 100) {
    summary = `Your ${hottest.category} budget is already blown. You set ${money(
      hottest.limit
    )} but you've spent ${money(hottest.spent)}.`;
  } else if (pctRounded >= 80) {
    summary = `Your ${hottest.category} budget is getting hot (${pctRounded}%). You've spent ${money(
      hottest.spent
    )} out of ${money(hottest.limit)}.`;
  } else {
    summary = `So far you're fine. The highest pressure is ${hottest.category} at ${pctRounded}% (${money(
      hottest.spent
    )}/${money(hottest.limit)}).`;
  }

  return { summary, hottest, report };
}

// which category am I spending the most on this month?
function topSpendingCategory(expenses) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  const spentByCat = {};
  expenses.forEach((e) => {
    const d = new Date(e.date);
    if (d.getFullYear() === y && d.getMonth() === m) {
      spentByCat[e.category] = (spentByCat[e.category] || 0) + e.amount;
    }
  });

  let top = null;
  Object.entries(spentByCat).forEach(([cat, amt]) => {
    if (!top || amt > top.amt) {
      top = { cat, amt };
    }
  });

  if (!top) {
    return "You haven't logged any spending this month.";
  }

  return `Your top category this month is ${top.cat} at ${money(top.amt)}.`;
}

// "brain": route the question to the right helper
function getAnswer(rawMsg, { expenses, budgets }) {
  const msg = rawMsg.toLowerCase();

  // budgets pressure / overspending
  if (
    msg.includes("budget") ||
    msg.includes("overspend") ||
    msg.includes("too high") ||
    msg.includes("in danger") ||
    msg.includes("hot")
  ) {
    const result = analyzeBudgets(expenses, budgets);
    return result.summary;
  }

  // total spent this month
  if (
    msg.includes("how much did i spend") ||
    msg.includes("total this month") ||
    msg.includes("spent this month") ||
    msg.includes("spend this month")
  ) {
    const total = monthlyTotal(expenses);
    const now = new Date();
    return `You've spent ${money(
      total
    )} so far in ${monthName(now.getMonth())}.`;
  }

  // daily average burn
  if (
    msg.includes("average") ||
    msg.includes("per day") ||
    msg.includes("daily")
  ) {
    const avg = avgPerDayThisMonth(expenses);
    return `You're averaging ${money(avg)} per day this month.`;
  }

  // top category
  if (
    msg.includes("top category") ||
    msg.includes("biggest category") ||
    msg.includes("most on") ||
    msg.includes("where am i spending")
  ) {
    return topSpendingCategory(expenses);
  }

  // greeting / help
  if (
    msg.includes("hello") ||
    msg.includes("hi") ||
    msg.includes("help") ||
    msg.includes("what can you do")
  ) {
    return (
      "Hey 👋 I'm Spendwise Assistant. Try asking:\n" +
      "• Which budget is in danger?\n" +
      "• How much did I spend this month?\n" +
      "• What's my average per day?\n" +
      "• Where am I spending the most?"
    );
  }

  // fallback
  return (
    "I didn't fully get that yet, but you can ask:\n" +
    "• Which budget is in danger?\n" +
    "• How much did I spend this month?\n" +
    "• What's my average per day?\n" +
    "• Where am I spending the most?"
  );
}

//the UI component 
export default function InsightsAssistant() {
  // Align with hooks: useExpenses returns { items },
  // useBudgets returns an object map { [category]: limit }
  const { items: expenses } = useExpenses();
  const { budgets } = useBudgets();

  const [chat, setChat] = useState([
    {
      from: "bot",
      text: "Hey 👋 I'm Spendwise Assistant. Ask me about your spending, budgets, or daily average.",
    },
  ]);

  const [input, setInput] = useState("");

  function handleSend(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { from: "you", text: trimmed };
    const botReply = {
      from: "bot",
      text: getAnswer(trimmed, { expenses, budgets }),
    };

    setChat((old) => [...old, userMsg, botReply]);
    setInput("");
  }

  return (
    <div className="rounded-2xl bg-neutral-900 border border-neutral-700 p-4 flex flex-col max-w-lg h-[320px] text-neutral-100">
      {/* header */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-white">
          Spendwise Assistant
        </div>
        <div className="text-[10px] text-neutral-400">
          local / offline
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto space-y-2 text-sm pr-2">
        {chat.map((m, i) => (
          <div
            key={i}
            className={m.from === "you" ? "text-right" : "text-left"}
          >
            <div
              className={
                "inline-block px-3 py-2 rounded-xl " +
                (m.from === "you"
                  ? "bg-indigo-600 text-white"
                  : "bg-neutral-800 text-neutral-100 border border-neutral-700")
              }
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* input */}
      <form onSubmit={handleSend} className="mt-3 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 text-sm bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          placeholder="Ask: which budget is in danger?"
        />
        <button
          type="submit"
          className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-3 py-2"
        >
          Send
        </button>
      </form>
    </div>
  );
}
