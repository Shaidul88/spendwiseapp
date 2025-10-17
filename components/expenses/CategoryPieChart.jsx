"use client";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { money } from "@/lib/utils";

export default function CategoryPieChart({ data }) {
  // data: [{ name, value }]
  return (
    <div className="chart-card">
      <div className="panel-header mb-2">Spending by Category</div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={110} isAnimationActive>
              {data.map((_, i) => <Cell key={i} />)}
            </Pie>
            <Tooltip formatter={(v) => money(v)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
