"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";
import type { Expression } from "./rakit";
import { RakitSvg } from "./RakitSvg";
import { useMascot } from "./useMascot";

type Props = {
  /** Ekspresi dasar. Aksi idle dan drag bisa mengubahnya sementara. */
  state?: Expression;
  className?: string;
};

/**
 * Rakit interaktif: bisa diseret dan bermain sendiri saat dibiarkan. Markup SVG dirender
 * di server (ukuran tetap dari `className`, tanpa CLS); animasinya menyala belakangan.
 * Dekoratif: `aria-hidden`, tidak bisa difokus, `touch-action: none` hanya pada maskot.
 */
export function Mascot({ state = "netral", className }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  useMascot(ref, state);
  return <RakitSvg ref={ref} expression={state} className={cn("rakit-interactive", className)} />;
}
