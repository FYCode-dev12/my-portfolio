import type { Ref } from "react";
import { cn } from "@/lib/cn";
import {
  ANTENNA,
  BLOCK,
  CELLS,
  EXPRESSIONS,
  FEET,
  VIEWBOX,
  eyeGeometry,
  type Expression,
} from "./rakit";

type Props = {
  expression?: Expression;
  className?: string;
  ref?: Ref<SVGSVGElement>;
};

function Eye({ expression, side }: { expression: Expression; side: -1 | 1 }) {
  const g = eyeGeometry(expression, side);
  return (
    // Bungkus luar digeser oleh engine, bungkus dalam memegang kemiringan ekspresi, dan rect
    // berkedip lewat CSS. Dipisah supaya transform-origin CSS tidak menggeser rotate().
    <g data-eye={side < 0 ? "l" : "r"}>
      <g data-tilt="" transform={g.tilt ? `rotate(${g.tilt} ${g.cx} ${g.cy})` : undefined}>
        <rect className="rk-eye rakit-blink" x={g.x} y={g.y} width={g.w} height={g.h} rx={5} />
      </g>
    </g>
  );
}

/**
 * SVG berlapis maskot Rakit, tanpa state, aman dirender di server (404, loading).
 * Warna dari variabel `--rakit-*` di globals.css, jadi ikut tema terang/gelap.
 * Bagian-bagian ditandai `data-*` (bukan `id`) agar beberapa salinan tidak bentrok.
 */
export function RakitSvg({ expression = "netral", className, ref }: Props) {
  const spec = EXPRESSIONS[expression];
  const { stem, caret, pivot } = ANTENNA;
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      aria-hidden="true"
      focusable="false"
      data-expression={expression}
      className={cn("rakit", spec.fastCaret && "rakit-loading", className)}
    >
      <g className="rakit-breathe">
        <g
          data-antenna=""
          transform={spec.antenna ? `rotate(${spec.antenna} ${pivot.x} ${pivot.y})` : undefined}
        >
          <rect className="rk-stem" {...stem} />
          <rect className="rk-caret rakit-caret" rx={4} {...caret} />
        </g>
        <g className="rk-body">
          {CELLS.map((c) => (
            <g key={`${c.col}-${c.row}`} data-cell={`${c.col}-${c.row}`}>
              <rect x={c.x} y={c.y} width={BLOCK} height={BLOCK} rx={6} />
            </g>
          ))}
        </g>
        <g className="rakit-eyes">
          <Eye expression={expression} side={-1} />
          <Eye expression={expression} side={1} />
        </g>
        <g className="rk-body">
          {FEET.map((f) => (
            <g key={f.side} data-foot={f.side}>
              <rect x={f.x} y={f.y} width={24} height={14} rx={5} />
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}
