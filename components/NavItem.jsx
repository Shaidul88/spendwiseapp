"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavItem({ href, label, collapsed }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`nav__item ${active ? "nav__item--active" : ""}`}
    >
      {/* placeholder for dots change later*/}
      <span className="dot" />
      <span className={collapsed ? "hidden" : ""}>{label}</span>
    </Link>
  );
}
