"use client";
import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function MonthlyBarChart({ items, expenses }) {
  const src = Array.isArray(items) ? items : Array.isArray(expenses) ? expenses : [];
  const [range, setRange] = useState("6");

  const ymKey = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

  const parseYM = (ym) => {
    const [y, m] = ym.split("-").map(Number);
    return new Date(y, m - 1, 1);
  };

  const addMonths = (date, delta) => new Date(date.getFullYear(), date.getMonth() + delta, 1);

  // Raw totals
  const totalsMap = useMemo(() => {
    const map = new Map();
    for (const e of src) {
      if (!e?.date) continue;
      const d = new Date(e.date);
      if (isNaN(d)) continue;
      const key = ymKey(new Date(d.getFullYear(), d.getMonth(), 1));
      map.set(key, (map.get(key) || 0) + (Number(e?.amount) || 0));
    }
    return map;
  }, [src]);

  // Fill months helper
  const fillMonths = (startKey, endKey, totalsMap) => {
    const start = parseYM(startKey);
    const end = parseYM(endKey);
    const out = [];
    for (let d = new Date(start); d <= end; d = addMonths(d, 1)) {
      const key = ymKey(d);
      out.push({ month: key, total: totalsMap.get(key) ?? 0 });
    }
    return out;
  };

  // Range data
  const data = useMemo(() => {
    const today = new Date();
    const currentKey = ymKey(new Date(today.getFullYear(), today.getMonth(), 1));

    if (range !== "all") {
      const n = Number(range);
      const start = addMonths(parseYM(currentKey), -(n - 1));
      return fillMonths(ymKey(start), currentKey, totalsMap);
    }

    const keys = Array.from(totalsMap.keys()).sort();
    const startKey = keys.length ? keys[0] : currentKey;
    return fillMonths(startKey, currentKey, totalsMap);
  }, [totalsMap, range]);

  // Total spending
  const totalSpending = useMemo(
    () => data.reduce((s, m) => s + (Number(m.total) || 0), 0),
    [data]
  );

  const fMoney = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }),
    []
  );

  const rangeLabel =
    range === "6" ? "Last 6 Months" : range === "12" ? "Last 12 Months" : "All Months";

  // Format month labels to month year
  const formatMonth = (ym) => {
    const d = parseYM(ym);
    return d.toLocaleDateString(undefined, {
      month: "short",
      year: "2-digit",
    });
  };

  return (
    <div className="p-4 rounded-2xl shadow bg-white/90 dark:bg-neutral-900">
      <div className="flex items-center justify-between mb-3 gap-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Total Spending — {rangeLabel}
          </div>
          <div className="text-2xl font-semibold">{fMoney.format(totalSpending)}</div>
        </div>

        <label className="text-sm flex items-center gap-2">
          <span className="text-neutral-500 dark:text-neutral-300">Range:</span>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-2 py-1 rounded bg-gray-200 dark:bg-neutral-700 dark:text-neutral-100"
          >
            <option value="6">Last 6 Months</option>
            <option value="12">Last 12 Months</option>
            <option value="all">All</option>
          </select>
        </label>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-gray-500">No expenses for this range.</p>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonth}
                interval={0} // show all labels
              />
              <YAxis />
              <Tooltip formatter={(value) => fMoney.format(value)} labelFormatter={formatMonth} />
              <Bar dataKey="total" fill="#8884d8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
