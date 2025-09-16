"use client";

import { useState } from "react";
import NavItem from "./NavItem";

const NAV = [
  { label: "Dashboard", href: "/" },
  { label: "Expenses",  href: "/expenses" },
  { label: "Budgets",   href: "/budgets" },
  { label: "Reports",   href: "/reports" },
  { label: "Settings",  href: "/settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar__top">
        <span className={`brand ${collapsed ? "hidden" : ""}`}>Spendwise</span>
        <button className="toggle" onClick={() => setCollapsed(v => !v)}>
          {collapsed ? "»" : "«"}
        </button>
      </div>

      <nav className="nav">
        {NAV.map(item => (
          <NavItem key={item.href} {...item} collapsed={collapsed} />
        ))}
      </nav>
    </aside>
  );
}
