"use client";

import { useEffect, useRef } from "react";
import type { RakitReaction } from "./companion";
import { rakitReact } from "./react";

type Props = {
  /** Event dari elemen induk yang memicu reaksi. */
  on: "change" | "input";
  reaction: Omit<RakitReaction, "zone">;
};

/**
 * Rakit menanggapi isian di elemen induknya (tab dipilih, kolom diketik). Hanya Rakit yang
 * duduk di bagian yang sama yang bereaksi, paling sering sekali tiap 400 ms.
 */
export function RakitListen({ on, reaction }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const { act, expression, ms } = reaction;

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    const zone = host.closest("section") ?? host;
    let last = 0;
    const handler = () => {
      const now = performance.now();
      if (now - last < 400) return;
      last = now;
      rakitReact({ zone, act, expression, ms });
    };
    host.addEventListener(on, handler);
    return () => host.removeEventListener(on, handler);
  }, [on, act, expression, ms]);

  return <span ref={ref} hidden />;
}
