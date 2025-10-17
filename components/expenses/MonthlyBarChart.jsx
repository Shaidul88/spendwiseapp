"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { money } from "@/lib/utils";

export default function MonthlyBarChart({ data }) {
  // data: [{ month: "2025-10", total: 123 }]
  const pretty = data.map((d) => ({
    ...d,
    label: new Date(d.month + "-01").toLocaleString(undefined, { month: "short" }),
  }));

  return (
    <div className="chart-card">
      <div className="panel-header mb-2">Monthly Spend (Last 6)</div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={pretty}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis tickFormatter={(v) => (v >= 1000 ? `${Math.round(v/100)/10}k` : v)} />
            <Tooltip formatter={(v) => money(v)} />
            <Bar dataKey="total" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
