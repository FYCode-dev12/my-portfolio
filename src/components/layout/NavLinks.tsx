"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import type { NavItem } from "@/content/site";

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Tautan navigasi utama dengan penanda halaman aktif (`aria-current`): pil kaca bercahaya yang
 * bergeser ke tautan aktif saat pindah halaman. Sebelum JS berjalan, pil digambar langsung di
 * tautan aktif lewat CSS, jadi tidak ada kedipan.
 */
export function NavLinks({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();
  const listRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    const pill = pillRef.current;
    if (!list || !pill) return;
    const place = () => {
      const link = list.querySelector<HTMLElement>('[aria-current="page"]');
      if (!link) {
        delete pill.dataset.on;
        return;
      }
      pill.style.width = `${link.offsetWidth}px`;
      pill.style.transform = `translateX(${link.offsetLeft}px)`;
      pill.dataset.on = "";
      list.dataset.pill = "";
    };
    place();
    // posisi pertama tanpa transisi; setelah itu pil meluncur
    const frame = requestAnimationFrame(() => {
      pill.dataset.ready = "";
    });
    const ro = new ResizeObserver(place);
    ro.observe(list);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [pathname]);

  return (
    <div ref={listRef} className="nav-list relative">
      <span ref={pillRef} aria-hidden="true" className="nav-pill" />
      <ul className="relative flex items-center gap-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="nav-link relative inline-flex h-10 items-center rounded-full px-3.5 text-[0.9375rem] text-muted transition-colors hover:text-fg aria-[current=page]:text-fg"
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
