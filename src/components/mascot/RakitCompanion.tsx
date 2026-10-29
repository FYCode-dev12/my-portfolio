"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import type { Companion, SeatInfo } from "./companion";
import { RakitSvg } from "./RakitSvg";

/** Tunggu browser idle; fallback setTimeout untuk Safari yang belum punya requestIdleCallback. */
function whenIdle(cb: () => void) {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(cb, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(cb, 500);
  return () => window.clearTimeout(id);
}

/**
 * Satu Rakit hidup untuk seluruh situs. Dipasang sekali di layout; mesin fisikanya
 * (companion.ts) diambil sebagai chunk terpisah setelah halaman idle, jadi konten dan LCP
 * tidak menunggu. SVG-nya dirender lewat portal ke kursi aktif, sehingga Rakit ikut tergulir
 * bersama halaman tanpa kerja JS. Sampai mesin siap, kursi dengan `fallback` menampilkan
 * Rakit statis dari server.
 */
export function RakitCompanion() {
  const pathname = usePathname();
  const [seat, setSeat] = useState<SeatInfo | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const companion = useRef<Companion | null>(null);

  useEffect(() => {
    let cancelled = false;
    const cancelIdle = whenIdle(() => {
      import("./companion")
        .then(({ createCompanion }) => {
          if (cancelled) return;
          companion.current = createCompanion({ onSeat: setSeat });
        })
        .catch((error: unknown) => {
          // Rakit statis di kursi tetap tampil; situs tidak bergantung pada maskot.
          console.warn("Rakit: gagal memuat animasi, maskot tetap statis.", error);
        });
    });
    return () => {
      cancelled = true;
      cancelIdle();
      companion.current?.destroy();
      companion.current = null;
      document.documentElement.classList.remove("rakit-live");
    };
  }, []);

  useEffect(() => {
    companion.current?.rescan();
  }, [pathname]);

  useLayoutEffect(() => {
    if (!seat || !svgRef.current) return;
    document.documentElement.classList.add("rakit-live");
    companion.current?.attach(svgRef.current, seat);
  }, [seat]);

  if (!seat) return null;
  return createPortal(
    <RakitSvg
      key={seat.id}
      ref={svgRef}
      expression={seat.expression}
      className={cn("rakit-live-svg", seat.tone && `rakit-tone-${seat.tone}`)}
    />,
    seat.el,
  );
}
