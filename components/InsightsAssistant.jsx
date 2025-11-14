"use client";

import { useState } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { useBudgets } from "@/hooks/useBudgets";
import { money, monthName } from "@/lib/utils";

// Spendwise Insights Assistant cheat sheet:
// - The hooks feed us live expenses/budgets; every helper below just reads those arrays.
// - Helper functions do the math (monthly totals, avg/day, category pressure, etc).
// - getAnswer is the "router": lowercase the user message, find the best helper, reply with a string.
// - The UI at the bottom simply renders a fake chat thread and wires the input box to getAnswer.
// If you add new insights, drop a helper near the others, then add a new branch inside getAnswer.
// Use plain strings for now so everything stays fast and offline-friendly.

// Finds how much you spent this month by looping through expenses for the current month.
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

// Calculates your average daily spending so far this month.
function avgPerDayThisMonth(expenses) {
  const total = monthlyTotal(expenses);
  const todayDayNum = new Date().getDate(); // 1..31
  if (!todayDayNum) return 0;
  return total / todayDayNum;
}

// Checks each category to see how close you are to your budget limit.
function analyzeBudgets(expenses, budgets) {
  // Think of this as the budget "pressure gauge": we total this month's spend per category,
  // normalize whatever format the budgets hook returned, then compute pct used + money left.
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

// Finds which category you spent the most on this month.
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

function budgetImprovementTips(expenses, budgets) {
  // Friendly, opinionated advice: highlight the categories that are blowing up,
  // remind the user where they still have slack, and nudge them toward tweaking budgets.
  const analysis = analyzeBudgets(expenses, budgets);
  const { report, summary } = analysis;

  if (!report.length) {
    return summary;
  }

  const overLimit = report.filter((r) => r.spent > r.limit);
  const heatingUp = report.filter((r) => r.spent <= r.limit && r.pct >= 80);
  const slack = report
    .filter((r) => r.limit > 0 && r.left > 0 && r.pct <= 50)
    .sort((a, b) => a.pct - b.pct);

  const tips = [];

  if (overLimit.length) {
    const details = overLimit
      .slice(0, 2)
      .map((r) => `${r.category} (${money(r.spent)} vs ${money(r.limit)})`)
      .join(", ");
    tips.push(`Dial back ${details}; they're already beyond their limits.`);
  } else if (heatingUp.length) {
    const details = heatingUp
      .slice(0, 2)
      .map((r) => `${r.category} (${Math.round(r.pct)}%)`)
      .join(", ");
    tips.push(`Watch ${details} — they're on pace to blow the cap.`);
  } else {
    tips.push(summary);
  }

  if (slack.length) {
    const details = slack
      .slice(0, 2)
      .map((r) => `${r.category} (${money(r.left)} left)`)
      .join(", ");
    tips.push(
      `There is room in ${details}. Trim those a bit to free cash for the hotter categories.`
    );
  }

  tips.push(
    "Adjust limits or split categories inside Budgets to make future advice even sharper."
  );

  return tips.join(" ");
}

function budgetHeadroomSummary(expenses, budgets) {
  // Quick way to answer "how much room do I have left overall?" without hopping to the Budgets tab.
  const analysis = analyzeBudgets(expenses, budgets);
  const { report, summary } = analysis;

  if (!report.length) {
    return summary;
  }

  const totals = report.reduce(
    (acc, r) => {
      acc.limit += r.limit;
      acc.spent += r.spent;
      return acc;
    },
    { limit: 0, spent: 0 }
  );

  if (totals.limit <= 0) {
    return "You have budgets recorded but no limits. Add limits to track remaining room.";
  }

  const remaining = totals.limit - totals.spent;
  const pctUsed = Math.round((totals.spent / totals.limit) * 100);

  if (remaining >= 0) {
    return `Combined budgets are ${pctUsed}% used (${money(totals.spent)} of ${money(
      totals.limit
    )}). ${money(remaining)} remains for the rest of the month.`;
  }

  return `You've already overspent combined budgets by ${money(
    Math.abs(remaining)
  )} (${money(totals.spent)} of ${money(totals.limit)}).`;
}

// "brain": route the question to the right helper
function getAnswer(rawMsg, { expenses, budgets }) {
  // We keep routing dead-simple: lowercase the string, check for keywords, return the first match.
  // If you're adding a new intent, place it near the top with the most specific wording first.
  const msg = rawMsg.toLowerCase();

  if (
    (msg.includes("improve") ||
      msg.includes("better") ||
      msg.includes("optimize") ||
      msg.includes("fix") ||
      msg.includes("tips") ||
      msg.includes("advice")) &&
    (msg.includes("budget") || msg.includes("spend") || msg.includes("money"))
  ) {
    return budgetImprovementTips(expenses, budgets);
  }

  if (
    (msg.includes("left") ||
      msg.includes("remaining") ||
      msg.includes("room") ||
      msg.includes("balance")) &&
    msg.includes("budget")
  ) {
    return budgetHeadroomSummary(expenses, budgets);
  }

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
      "Hey there! I'm Spendwise Assistant. Try asking:\n" +
      "- Which budget is in danger?\n" +
      "- How much did I spend this month?\n" +
      "- What's my average per day?\n" +
      "- Where am I spending the most?\n" +
      "- How can I improve my budget?"
    );
  }

  // fallback
  return (
    "I didn't fully get that yet, but you can ask:\n" +
    "- Which budget is in danger?\n" +
    "- How much did I spend this month?\n" +
    "- What's my average per day?\n" +
    "- Where am I spending the most?\n" +
    "- How can I improve my budget?"
  );
}

// The main chat UI that shows your messages and the assistant's responses.
export default function InsightsAssistant() {
  // Align with hooks: useExpenses returns { items },
  // useBudgets returns an object map { [category]: limit }
  const { items: expenses } = useExpenses();
  const { budgets } = useBudgets();

  // We fake a tiny chat log locally; first message is the bot saying hi.
  const [chat, setChat] = useState([
    {
      from: "bot",
      text: "Hey there! I'm Spendwise Assistant. Ask me about your spending, budgets, or daily average.",
    },
  ]);

  const [input, setInput] = useState("");

  function handleSend(e) {
    // Keep the UX snappy: prevent reload, trim, bail on empty, then append user + bot replies.
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
