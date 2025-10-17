"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/expenses", label: "Expenses" },
  { href: "/reports", label: "Reports" },
  { href: "/budgets", label: "Budgets" },
  { href: "/profile", label: "Profile" },   // ← added
  { href: "/settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:block border-r border-neutral-800 p-4 sticky top-0 h-screen">
      <div className="text-xl font-semibold mb-6">Spendwise</div>
      <nav className="space-y-1">
        {links.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`block px-3 py-2 rounded-lg ${
                active ? "bg-neutral-800 ring-1 ring-neutral-700" : "hover:bg-neutral-800"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
