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

const HEART = "M0 6 L-7 -1 A3.8 3.8 0 0 1 0 -5 A3.8 3.8 0 0 1 7 -1 Z";
const SPARKLE = "M0 -9 L2 -2 L9 0 L2 2 L0 9 L-2 2 L-9 0 L-2 -2 Z";

/** Satu butir efek: bungkus luar memegang posisi, bungkus dalam dianimasikan CSS. */
function FxItem({
  x,
  y,
  s = 1,
  k = 0,
  children,
}: {
  x: number;
  y: number;
  s?: number;
  k?: number;
  children: React.ReactNode;
}) {
  return (
    // efek digambar di grid kecil, lalu diperbesar 1,6x agar terbaca di samping kepala
    <g transform={`translate(${x} ${y}) scale(${s * 1.6})`}>
      <g className="rk-fx-item" style={{ "--k": k } as React.CSSProperties}>
        {children}
      </g>
    </g>
  );
}

/**
 * Efek kecil di atas kepala, tersembunyi sampai mesin memasang `data-fx` di <svg>; tiap kelompok
 * ditandai `data-fxg`.
 * Warnanya `--rakit-caret`: bagian dari palet maskot, bukan warna UI.
 */
function Fx() {
  return (
    <g className="rk-fx-layer" aria-hidden="true">
      <g data-fxg="heart">
        <FxItem x={102} y={30}>
          <path d={HEART} />
        </FxItem>
        <FxItem x={26} y={40} s={0.7} k={1}>
          <path d={HEART} />
        </FxItem>
        <FxItem x={112} y={6} s={0.55} k={2}>
          <path d={HEART} />
        </FxItem>
      </g>
      <g data-fxg="sparkle">
        <FxItem x={108} y={24}>
          <path d={SPARKLE} />
        </FxItem>
        <FxItem x={18} y={34} s={0.7} k={1}>
          <path d={SPARKLE} />
        </FxItem>
        <FxItem x={96} y={2} s={0.5} k={2}>
          <path d={SPARKLE} />
        </FxItem>
      </g>
      <g data-fxg="zzz" className="rk-fx-text">
        <FxItem x={88} y={34} s={0.8}>
          <text>z</text>
        </FxItem>
        <FxItem x={100} y={18} k={1}>
          <text>z</text>
        </FxItem>
        <FxItem x={114} y={0} s={1.25} k={2}>
          <text>z</text>
        </FxItem>
      </g>
      <g data-fxg="alert">
        <FxItem x={100} y={18}>
          <rect x={-3.5} y={-16} width={7} height={18} rx={2.5} />
          <rect x={-3.5} y={5} width={7} height={7} rx={2.5} />
        </FxItem>
      </g>
      <g data-fxg="question" className="rk-fx-text">
        <FxItem x={102} y={28}>
          <text>?</text>
        </FxItem>
        <FxItem x={24} y={36} s={0.7} k={2}>
          <text>?</text>
        </FxItem>
      </g>
      <g data-fxg="note">
        {[
          [104, 28, 1, 0],
          [22, 40, 0.75, 1],
          [112, 4, 0.6, 2],
        ].map(([x, y, sc, k]) => (
          <FxItem key={k} x={x} y={y} s={sc} k={k}>
            <ellipse cx={-1} cy={4} rx={5} ry={4} />
            <rect x={2.5} y={-14} width={3} height={18} />
            <rect x={2.5} y={-14} width={9} height={4} rx={1} />
          </FxItem>
        ))}
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
      <Fx />
    </svg>
  );
}
