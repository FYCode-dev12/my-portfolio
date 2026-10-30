/**
 * Geometri dan ekspresi maskot Rakit, dalam satuan viewBox (1 blok = 28).
 * Sumber aslinya `brand/tools/build_mascot.py` di repo MaskotYoel; angka di sini harus sama.
 */

export const VIEWBOX = { width: 128, height: 168 } as const;
export const BLOCK = 28;
const GAP = 2;
const BODY_X = 20;
const BODY_Y = 56;
const CENTER_X = 64;
/** Pusat vertikal mata: 4 satuan di atas pusat baris tengah, seperti gambar referensi. */
export const EYE_Y = 96;

export type Cell = { col: number; row: number; x: number; y: number };

export const CELLS: Cell[] = Array.from({ length: 9 }, (_, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  return { col, row, x: BODY_X + col * (BLOCK + GAP), y: BODY_Y + row * (BLOCK + GAP) };
});

export const ANTENNA = {
  stem: { x: CENTER_X - 2, y: BODY_Y - 25, width: 4, height: 25 },
  caret: { x: CENTER_X - 9, y: BODY_Y - 49, width: 18, height: 24 },
  /** Titik putar antena: dasar batang. */
  pivot: { x: CENTER_X, y: BODY_Y },
} as const;

export const FEET = [
  { side: "l", x: CENTER_X - 32, y: BODY_Y + 3 * BLOCK + 2 * GAP },
  { side: "r", x: CENTER_X + 8, y: BODY_Y + 3 * BLOCK + 2 * GAP },
] as const;

type ExpressionSpec = {
  /** Setengah jarak antar pusat mata. 15 = tepat di celah antarkolom. */
  spread: number;
  w: number;
  h: number;
  dyl: number;
  dyr: number;
  /** Kemiringan mata (derajat); ujung atas condong ke luar. */
  tilt: number;
  /** "bottom": tepi bawah tetap, mata pendek terbaca sebagai kelopak setengah tertutup. */
  anchor: "center" | "bottom";
  antenna: number;
  fastCaret: boolean;
  /** "arc": mata lengkung `^ ^` (senyum mata), menggantikan batang. */
  shape?: "bar" | "arc";
};

export const EXPRESSIONS = {
  netral: {
    spread: 15,
    w: 10,
    h: 26,
    dyl: 0,
    dyr: 0,
    tilt: 0,
    anchor: "center",
    antenna: 0,
    fastCaret: false,
  },
  // Mata lengkung `^ ^`. Versi lama (batang pendek miring) terbaca seperti alis marah.
  senang: {
    spread: 15,
    w: 10,
    h: 17,
    dyl: 0,
    dyr: 0,
    tilt: 0,
    anchor: "center",
    antenna: -6,
    fastCaret: false,
    shape: "arc",
  },
  fokus: {
    spread: 8,
    w: 10,
    h: 30,
    dyl: -3,
    dyr: -3,
    tilt: 0,
    anchor: "center",
    antenna: 0,
    fastCaret: false,
  },
  bingung: {
    spread: 15,
    w: 10,
    h: 26,
    dyl: 1,
    dyr: -5,
    tilt: 0,
    anchor: "center",
    antenna: 14,
    fastCaret: false,
  },
  loading: {
    spread: 15,
    w: 10,
    h: 13,
    dyl: 0,
    dyr: 0,
    tilt: 0,
    anchor: "bottom",
    antenna: 0,
    fastCaret: true,
  },
  // mata terpejam jadi garis tipis; antena terkulai
  tidur: {
    spread: 15,
    w: 12,
    h: 4,
    dyl: 0,
    dyr: 0,
    tilt: 0,
    anchor: "bottom",
    antenna: -18,
    fastCaret: false,
  },
  // mata membulat besar
  kaget: {
    spread: 16,
    w: 14,
    h: 30,
    dyl: -2,
    dyr: -2,
    tilt: 0,
    anchor: "center",
    antenna: 0,
    fastCaret: true,
  },
  // mata ditutup tangan saat cilukba (tidak terlihat)
  tutup: {
    spread: 15,
    w: 10,
    h: 0,
    dyl: 0,
    dyr: 0,
    tilt: 0,
    anchor: "bottom",
    antenna: 0,
    fastCaret: false,
  },
} as const satisfies Record<string, ExpressionSpec>;

export type Expression = keyof typeof EXPRESSIONS;

export type EyeGeometry = {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  tilt: number;
};

/** Geometri satu mata. `side` = -1 untuk kiri, 1 untuk kanan. */
export function eyeGeometry(expression: Expression, side: -1 | 1): EyeGeometry {
  const e: ExpressionSpec = EXPRESSIONS[expression];
  const cx = CENTER_X + side * e.spread;
  const dy = side < 0 ? e.dyl : e.dyr;
  const y = e.anchor === "bottom" ? EYE_Y + 13 - e.h + dy : EYE_Y - e.h / 2 + dy;
  return {
    x: cx - e.w / 2,
    y,
    w: e.w,
    h: e.h,
    cx,
    cy: y + e.h / 2,
    tilt: e.tilt ? e.tilt * -side : 0,
  };
}

/** Bentuk mata sebuah ekspresi. */
export const eyeShape = (expression: Expression) =>
  (EXPRESSIONS[expression] as ExpressionSpec).shape ?? "bar";

/** Lengkung mata senang `^`, berpusat di mata netral sisi `side`. */
export function eyeArc(side: -1 | 1): string {
  const cx = CENTER_X + side * 15;
  const cy = EYE_Y - 1;
  return `M${cx - 8} ${cy + 4}Q${cx} ${cy - 11} ${cx + 8} ${cy + 4}`;
}
