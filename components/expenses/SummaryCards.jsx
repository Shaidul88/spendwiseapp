import { money } from "@/lib/utils";

function Card({ label, value }) {
  return (
    <div className="panel p-4">
      <div className="panel-header">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}

export default function SummaryCards({ monthTotal, txCount, avgPerDay, topCategory }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card label="Spent This Month" value={money(monthTotal)} />
      <Card label="Transactions" value={txCount} />
      <Card label="Avg / Day (MTD)" value={money(avgPerDay)} />
      <Card label="Top Category" value={topCategory || "-"} />
    </div>
  );
}
