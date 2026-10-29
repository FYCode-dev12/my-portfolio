import { cn } from "@/lib/cn";

// Glyph "satu batang" FY (brand/final/guideline.md): grid 5 x 5, F dan Y berbagi batang tengah.
const CELLS = [
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

/**
 * Glyph FY ukuran kecil (header). Digambar di grid pixel 19 x 19: blok 3 px, celah 1 px,
 * sehingga tajam di 19 px. Sesuai guideline, di bawah 48 px tanpa mata.
 * Warna dari `--brand-glyph`: navy di tema terang, putih kebiruan di tema gelap.
 */
export function FyGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 19 19"
      aria-hidden="true"
      focusable="false"
      className={cn("size-[19px] shrink-0 fill-brand-glyph", className)}
    >
      {CELLS.map(([c, r]) => (
        <rect key={`${c}-${r}`} x={c * 4} y={r * 4} width={3} height={3} rx={0.6} />
      ))}
    </svg>
  );
}
