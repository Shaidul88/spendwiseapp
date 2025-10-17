export default function Page() {
  return (
    <main className="min-h-screen">
      <h1 className="text-2xl font-semibold mb-3">Home</h1>
      <p className="text-neutral-400 text-sm">Jump to a section:</p>
      <div className="flex flex-wrap gap-2 mt-3">
        {[
          ["/dashboard","Dashboard"],
          ["/expenses","Expenses"],
          ["/reports","Reports"],
          ["/budgets","Budgets"],
          ["/settings","Settings"],
        ].map(([href,label]) => (
          <a key={href} href={href} className="btn">{label}</a>
        ))}
      </div>
    </main>
  );
}
