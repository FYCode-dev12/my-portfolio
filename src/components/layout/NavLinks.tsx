"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/content/site";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Tautan navigasi utama dengan penanda halaman aktif (`aria-current`). */
export function NavLinks({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-1">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="nav-link relative inline-flex h-10 items-center rounded-md px-3 text-[0.9375rem] text-muted transition-colors hover:text-fg aria-[current=page]:text-fg"
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
