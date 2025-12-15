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
            <defs>
              <linearGradient id="monthlyBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.95} />
                <stop offset="50%" stopColor="#4c6fff" stopOpacity={0.85} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.95} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" />
            <YAxis tickFormatter={(v) => (v >= 1000 ? `${Math.round(v/100)/10}k` : v)} />
            <Tooltip formatter={(v) => money(v)} />
            <Bar dataKey="total" fill="url(#monthlyBarGradient)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
