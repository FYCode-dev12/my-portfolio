"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { RakitSvg } from "./RakitSvg";

type Engine = typeof import("./companion");

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
 * Satu Rakit hidup untuk seluruh situs, bebas ditaruh di mana saja di layar. Dipasang sekali di
 * layout; mesin fisikanya (companion.ts) diambil sebagai chunk terpisah setelah halaman idle, jadi
 * konten dan LCP tidak menunggu. Lapisan `fixed` dan gelembung percakapannya baru dirender setelah
 * mesin siap; mesin menaruh Rakit di luar layar lebih dulu, lalu menyambut pengunjung.
 * Dekoratif: seluruh lapisan `aria-hidden`.
 */
export function RakitCompanion() {
  const [engine, setEngine] = useState<Engine | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const bubbleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let cancelled = false;
    const cancelIdle = whenIdle(() => {
      import("./companion")
        .then((mod) => {
          if (!cancelled) setEngine(mod);
        })
        .catch((error: unknown) => {
          // Situs tidak bergantung pada maskot; tanpa mesin, Rakit tidak ditampilkan.
          console.warn("Rakit: gagal memuat animasi, maskot tidak ditampilkan.", error);
        });
    });
    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, []);

  useLayoutEffect(() => {
    if (!engine || !svgRef.current || !bubbleRef.current) return;
    const companion = engine.createCompanion(svgRef.current, bubbleRef.current);
    return () => companion.destroy();
  }, [engine]);

  if (!engine) return null;
  return (
    <div aria-hidden="true" className="rakit-stage">
      <RakitSvg ref={svgRef} className="rakit-live-svg" />
      <p ref={bubbleRef} className="rakit-bubble" />
    </div>
  );
}
