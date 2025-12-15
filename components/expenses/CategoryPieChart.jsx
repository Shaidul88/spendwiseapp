"use client";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { money } from "@/lib/utils";

export default function CategoryPieChart({ data }) {
  // data: [{ name, value }]
  const COLORS = ["#ff6b6b", "#ffa351", "#ffd166", "#6ee7b7", "#4dd0e1", "#7c3aed", "#f472b6", "#4c6fff", "#22c55e", "#fbbf24"];

  return (
    <div className="chart-card">
      <div className="panel-header mb-2">Spending by Category</div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={110} isAnimationActive>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#0f172a" strokeWidth={1} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => money(v)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
