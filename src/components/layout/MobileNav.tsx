"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { NavItem } from "@/content/site";
import { isActive } from "./NavLinks";

/**
 * Menu hamburger untuk ponsel (di bawah `sm`). Memakai `<details>` agar tetap bisa dibuka tanpa
 * JS; JS hanya menambah penutupan otomatis: setelah memilih tautan, pindah halaman, Escape, atau
 * ketuk di luar menu. Panelnya diposisikan terhadap `.nav-shell`, jadi selebar bilah navigasi.
 */
export function MobileNav({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDetailsElement>(null);

  // tutup setiap kali halaman berganti (termasuk tombol kembali di browser)
  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const details = ref.current;
    if (!details) return;
    const close = (refocus: boolean) => {
      details.open = false;
      if (refocus) details.querySelector("summary")?.focus();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    const onPointer = (event: PointerEvent) => {
      if (!details.contains(event.target as Node)) close(false);
    };
    // listener global hanya terpasang selama menu terbuka
    const onToggle = () => {
      if (details.open) {
        document.addEventListener("keydown", onKey);
        document.addEventListener("pointerdown", onPointer);
      } else {
        document.removeEventListener("keydown", onKey);
        document.removeEventListener("pointerdown", onPointer);
      }
    };
    details.addEventListener("toggle", onToggle);
    return () => {
      details.removeEventListener("toggle", onToggle);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  return (
    <details ref={ref} className="group sm:hidden">
      <summary
        aria-label="Menu navigasi"
        className="press inline-flex size-10 cursor-pointer list-none items-center justify-center rounded-md bg-surface text-muted transition-colors hover:text-fg group-open:text-fg [&::-webkit-details-marker]:hidden"
      >
        <Menu aria-hidden="true" className="size-5 group-open:hidden" />
        <X aria-hidden="true" className="hidden size-5 group-open:block" />
      </summary>
      <nav aria-label="Navigasi utama" className="mobile-nav-panel">
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                onClick={() => {
                  if (ref.current) ref.current.open = false;
                }}
                className="mobile-nav-link flex h-12 items-center rounded-md px-4 text-base text-muted transition-colors hover:text-fg aria-[current=page]:text-fg"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
