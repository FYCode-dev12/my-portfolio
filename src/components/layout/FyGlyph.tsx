import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

// Glyph "satu batang" FY (brand/final/guideline.md): grid 5 x 5, F dan Y berbagi batang tengah.
// Urutannya mengikuti cara glyph "dirakit" di intro: batang atas, lalu turun ke kaki Y.
export const CELLS = [
  [0, 0],
  [2, 0],
  [3, 0],
  [4, 0],
  [1, 1],
  [2, 1],
  [2, 2],
  [3, 2],
  [2, 3],
  [2, 4],
] as const;

type Props = {
  /** Sisi blok dan celah dalam piksel. Bawaan 5 + 1 = glyph 29 px yang tajam di header. */
  block?: number;
  gap?: number;
  className?: string;
};

/**
 * Glyph FY tanpa mata (sesuai guideline untuk ukuran di bawah 48 px). Digambar di grid piksel
 * utuh sehingga tajam. Tiap blok membawa `--c` (urutan) untuk animasi intro beranda.
 * Warna dari `--brand-glyph`: navy di tema terang, putih kebiruan di tema gelap.
 */
export function FyGlyph({ block = 5, gap = 1, className }: Props) {
  const step = block + gap;
  const size = step * 5 - gap;
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0 fill-brand-glyph", className)}
    >
      {CELLS.map(([c, r], i) => (
        <rect
          key={`${c}-${r}`}
          x={c * step}
          y={r * step}
          width={block}
          height={block}
          rx={block * 0.2}
          style={{ "--c": i } as CSSProperties}
        />
      ))}
    </svg>
  );
}
