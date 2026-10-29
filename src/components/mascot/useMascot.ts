"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { RakitEngine } from "./engine";
import type { Expression } from "./rakit";

/** Tunggu browser idle; fallback setTimeout untuk Safari yang belum punya requestIdleCallback. */
function whenIdle(cb: () => void) {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(cb, { timeout: 2500 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(cb, 600);
  return () => window.clearTimeout(id);
}

/**
 * Hidupkan Rakit pada SVG yang sudah dirender server. Mesin fisika (`engine.ts`) diambil
 * sebagai chunk terpisah hanya setelah maskot terlihat dan browser idle, jadi tidak ikut
 * bundle awal dan tidak menunda LCP. Gagal memuat chunk cukup membuat Rakit tetap statis.
 */
export function useMascot(ref: RefObject<SVGSVGElement | null>, expression: Expression) {
  const engine = useRef<RakitEngine | null>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    let cancelled = false;
    let cancelIdle: (() => void) | undefined;

    const observer = new IntersectionObserver((records) => {
      if (!records.some((r) => r.isIntersecting)) return;
      observer.disconnect();
      cancelIdle = whenIdle(() => {
        import("./engine")
          .then(({ createRakit }) => {
            // Rakit berjalan sepanjang elemen induknya (di hero: tepi atas terminal)
            if (!cancelled) engine.current = createRakit(svg, { walkWithin: svg.parentElement });
          })
          .catch((error: unknown) => {
            console.warn("Rakit: gagal memuat animasi, maskot tetap statis.", error);
          });
      });
    });
    observer.observe(svg);

    return () => {
      cancelled = true;
      observer.disconnect();
      cancelIdle?.();
      engine.current?.destroy();
      engine.current = null;
    };
  }, [ref]);

  useEffect(() => {
    engine.current?.setExpression(expression);
  }, [expression]);
}
