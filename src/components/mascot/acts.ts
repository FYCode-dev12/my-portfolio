import type { Expression } from "./rakit";

/**
 * Aksi Rakit. Tiap aksi hanya menghitung target per frame (geser blok, condong tubuh, langkah kaki);
 * pegas di companion.ts yang mengejarnya, jadi setiap aksi mulai dan berakhir halus di pose diam.
 */
export type ActName =
  | "lambai"
  | "jalan"
  | "lompat"
  | "toleh"
  | "geliat"
  | "joget"
  | "salto"
  | "cilukba"
  | "kaget"
  | "pusing"
  | "geli"
  | "sambut"
  | "berserakan";

/** Efek kecil di atas kepala Rakit (lihat RakitSvg). */
export type FxName = "heart" | "zzz" | "alert" | "question" | "note" | "sparkle";

export type Point = { x: number; y: number };

export type ActOut = {
  tilt: number;
  antenna: number;
  /** Posisi horizontal tubuh (px, relatif ke kursi) untuk aksi yang berpindah tempat. */
  bodyX: number | null;
  /** Tinggi lompatan, dalam satuan viewBox (ikut ukuran Rakit). */
  hopY: number;
  /** Putaran seluruh tubuh di sekitar pusatnya (derajat), untuk salto. */
  spin: number;
  expression: Expression | null;
  /** Indeks blok yang sedang jadi "tangan"; mata tidak ikut terseret olehnya. */
  hands: number[];
  /** Geser mata ke samping (satuan viewBox), untuk menoleh atau melihat arah jalan. */
  look: number;
  feet: { l: Point; r: Point };
  /** Blok yang posisinya diatur langsung oleh aksi (tanpa pegas), mis. pecahan yang terlempar. */
  exact: number[];
};

/** Satu blok yang terlepas saat berserakan: posisi, laju, dan titik awal lompatan pulang. */
type Shard = {
  i: number;
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  vr: number;
  /** Detik mulai melompat pulang. */
  home: number;
  from: { x: number; y: number; r: number } | null;
};

export type ActState = {
  name: ActName;
  t: number;
  dur: number;
  dir: number;
  from: number;
  dist: number;
  /** Kekuatan aksi 0..1 (berserakan: seberapa keras Rakit menghantam lantai). */
  power: number;
  /** Simulasi pecahan berserakan, diisi `start`. */
  shards?: Shard[];
  /** Waktu langkah simulasi terakhir. */
  last?: number;
  /** Efek aksi ini sudah dimunculkan. */
  fxShown?: boolean;
};

/** Geser blok `index` (baris * 3 + kolom) sejauh x, y satuan dan putar r derajat. */
export type Put = (index: number, x: number, y: number, r: number) => void;

type Act = {
  dur: number;
  expression?: Expression;
  /** Efek yang dimunculkan saat aksi mencapai detik `at`. */
  fx?: { name: FxName; at?: number };
  /** Celetukan di gelembung saat aksi ini dimainkan karena diketuk (satu dipilih acak). */
  say?: string[];
  /** Rentang jalan di layar (px, posisi kiri Rakit) dan posisi sekarang. */
  start?(a: ActState, range: { min: number; max: number }, px: number): void;
  run(t: number, a: ActState, out: ActOut, put: Put): void;
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const ALL = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const row = (i: number) => Math.floor(i / 3);
const col = (i: number) => i % 3;
/** Pusat vertikal tiap baris blok (viewBox), untuk lantai pecahan berserakan. */
const CELL_CY = [70, 100, 130];

/** Langkah kaki, badan naik-turun, dan goyang kiri-kanan saat berjalan. */
function step(t: number, dir: number, walking: number, out: ActOut, put: Put) {
  const ph = t * Math.PI * 2 * 1.9;
  const bob = Math.abs(Math.sin(ph)) * 3.6 * walking;
  for (const i of ALL) put(i, (row(i) === 2 ? 1.2 * Math.sin(ph) : 0) * walking, -bob, 0);
  out.feet.l = { x: dir * 4 * Math.sin(ph) * walking, y: -7 * Math.max(0, Math.sin(ph)) * walking };
  out.feet.r = {
    x: dir * 4 * Math.sin(ph + Math.PI) * walking,
    y: -7 * Math.max(0, Math.sin(ph + Math.PI)) * walking,
  };
  out.tilt = (dir * 2 + 3.5 * Math.sin(ph)) * walking;
  out.antenna = -2.5 * Math.sin(ph) * walking;
  out.look = dir * 3 * walking;
}

export const ACTS: Record<ActName, Act> = {
  // blok kanan tengah terangkat ke samping dan melambai seperti tangan
  lambai: {
    dur: 2.4,
    expression: "senang",
    run(t, a, out, put) {
      const env = smooth(t / 0.35) * smooth((a.dur - t) / 0.4);
      put(5, 11 * env, -15 * env, env * (-18 + 26 * Math.sin(t * Math.PI * 2 * 2.1)));
      put(2, 2 * env, -2 * env, 4 * env);
      out.hands = [5];
      out.tilt = -3 * env;
      out.antenna = -6 * env;
    },
  },
  // berjalan ke titik lain di layar
  jalan: {
    dur: 0,
    start(a, range, px) {
      let dir = Math.random() < 0.5 ? -1 : 1;
      if ((dir > 0 ? range.max - px : px - range.min) < 40) dir = -dir;
      const room = Math.max(0, dir > 0 ? range.max - px : px - range.min);
      a.dir = dir;
      a.from = px;
      a.dist = Math.min(room, 50 + Math.random() * 150);
      a.dur = a.dist < 8 ? 0.01 : Math.max(1.2, a.dist / 55 + 0.6);
    },
    run(t, a, out, put) {
      const p = smooth(clamp((t - 0.3) / Math.max(0.01, a.dur - 0.6), 0, 1));
      out.bodyX = a.from + a.dir * a.dist * p;
      step(t, a.dir, smooth(t / 0.3) * smooth((a.dur - t) / 0.3), out, put);
    },
  },
  // jongkok, lompat, mendarat sedikit gepeng
  lompat: {
    dur: 1.3,
    say: ["Hop!", "Hup, hup!"],
    run(t, _a, out, put) {
      const crouch = smooth(t / 0.22) * (1 - smooth((t - 0.22) / 0.08));
      const air = t > 0.28 && t < 0.78 ? Math.sin(((t - 0.28) / 0.5) * Math.PI) : 0;
      const land =
        t > 0.78
          ? Math.sin(clamp((t - 0.78) / 0.35, 0, 1) * Math.PI) * (1 - smooth((t - 1.0) / 0.3))
          : 0;
      const squash = crouch + land * 0.8;
      for (const i of ALL)
        put(
          i,
          (col(i) - 1) * 1.5 * squash,
          (2 - row(i)) * 2.4 * squash - (2 - row(i)) * 1.6 * air,
          0,
        );
      out.hopY = -64 * air;
      if (air > 0.3) out.expression = "senang";
    },
  },
  // menoleh ke kiri lalu ke kanan; baris atas ikut seperti kepala
  toleh: {
    dur: 2.6,
    run(t, _a, out, put) {
      const l = smooth((t - 0.15) / 0.25) * (1 - smooth((t - 0.95) / 0.25));
      const r = smooth((t - 1.25) / 0.25) * (1 - smooth((t - 2.05) / 0.3));
      const x = -4 * l + 4 * r;
      for (const i of [0, 1, 2]) put(i, x * 0.4, 0, 0);
      out.look = x;
      out.antenna = -x * 1.6;
    },
  },
  // meregang ke atas dengan mata mengantuk, lalu menggoyangkan badan
  geliat: {
    dur: 2.4,
    run(t, _a, out, put) {
      const up = smooth(t / 0.5) * (1 - smooth((t - 1.3) / 0.3));
      const shake =
        t > 1.6 ? Math.sin((t - 1.6) * Math.PI * 2 * 7) * (1 - smooth((t - 1.6) / 0.7)) : 0;
      for (const i of ALL)
        put(
          i,
          (col(i) - 1) * -1.2 * up + shake * 1.6 * (row(i) === 2 ? 0.4 : 1),
          -(2 - row(i)) * 3.2 * up,
          shake * 3,
        );
      if (up > 0.5) out.expression = "loading";
      out.antenna = shake * 8;
    },
  },
  // berjoget: badan bergoyang kiri-kanan mengikuti ketukan, tangan naik bergantian
  joget: {
    dur: 3.4,
    expression: "senang",
    say: ["Ayo joget!", "La la la~"],
    fx: { name: "note", at: 0.2 },
    run(t, a, out, put) {
      const env = smooth(t / 0.3) * smooth((a.dur - t) / 0.35);
      const side = Math.sin(t * Math.PI * 2 * 1.25);
      const beat = Math.abs(Math.sin(t * Math.PI * 2 * 1.25));
      for (const i of ALL) {
        const k = row(i) === 0 ? 1.4 : row(i) === 1 ? 0.8 : 0.2;
        put(i, side * 3 * k * env, -beat * 3 * env, side * 4 * k * env);
      }
      put(3, -4 * env, -9 * Math.max(0, side) * env, -24 * Math.max(0, side) * env);
      put(5, 4 * env, -9 * Math.max(0, -side) * env, 24 * Math.max(0, -side) * env);
      out.hands = [3, 5];
      out.hopY = -beat * 6 * env;
      out.tilt = side * 6 * env;
      out.antenna = -side * 16 * env;
      out.look = side * 2 * env;
      out.feet.l = { x: 0, y: -6 * Math.max(0, side) * env };
      out.feet.r = { x: 0, y: -6 * Math.max(0, -side) * env };
    },
  },
  // jongkok, melenting tinggi sambil berputar satu kali, mendarat gepeng
  salto: {
    dur: 1.6,
    say: ["Lihat, salto!", "Hiyaa!"],
    fx: { name: "sparkle", at: 1.05 },
    start(a) {
      a.dir = Math.random() < 0.5 ? -1 : 1;
    },
    run(t, a, out, put) {
      const crouch = smooth(t / 0.25) * (1 - smooth((t - 0.25) / 0.08));
      const air = t > 0.3 && t < 1.0 ? Math.sin(((t - 0.3) / 0.7) * Math.PI) : 0;
      const land =
        t > 1.0
          ? Math.sin(clamp((t - 1.0) / 0.35, 0, 1) * Math.PI) * (1 - smooth((t - 1.2) / 0.3))
          : 0;
      const squash = crouch + land * 0.9;
      for (const i of ALL) {
        // saat di udara blok sedikit merapat seperti meringkuk
        const tuck = air * 2;
        put(
          i,
          (col(i) - 1) * (1.6 * squash - tuck),
          (2 - row(i)) * 2.6 * squash - (row(i) - 1) * tuck,
          0,
        );
      }
      out.hopY = -84 * air;
      out.spin = a.dir * 360 * smooth((t - 0.34) / 0.6);
      out.expression = air > 0.2 ? "senang" : crouch > 0.5 ? "fokus" : null;
    },
  },
  // cilukba: kedua tangan menutup mata, lalu terbuka lebar sambil melompat kecil
  cilukba: {
    dur: 2.8,
    say: ["Cilukba!"],
    fx: { name: "sparkle", at: 1.55 },
    run(t, _a, out, put) {
      const cover = smooth((t - 0.15) / 0.3) * (1 - smooth((t - 1.45) / 0.12));
      const open = smooth((t - 1.45) / 0.15) * (1 - smooth((t - 2.3) / 0.45));
      const peek = t > 0.6 && t < 1.4 ? Math.sin((t - 0.6) * Math.PI * 2 * 1.5) : 0;
      put(3, 16 * cover - 10 * open, -6 * cover - 16 * open, 8 * peek * cover - 28 * open);
      put(5, -16 * cover + 10 * open, -6 * cover - 16 * open, -8 * peek * cover + 28 * open);
      for (const i of [0, 1, 2]) put(i, 0, -2 * cover - 3 * open + peek * cover, 0);
      out.hands = [3, 5];
      out.hopY = -22 * Math.sin(clamp((t - 1.45) / 0.45, 0, 1) * Math.PI);
      out.antenna = 18 * open * Math.sin((t - 1.45) * Math.PI * 4);
      out.expression = cover > 0.6 ? "tutup" : open > 0.1 ? "senang" : null;
    },
  },
  // kaget saat dibangunkan: melompat kecil, badan mengembang, antena bergetar
  kaget: {
    dur: 1.1,
    expression: "kaget",
    fx: { name: "alert" },
    run(t, _a, out, put) {
      const air = t < 0.45 ? Math.sin((t / 0.45) * Math.PI) : 0;
      const puff = Math.sin(clamp(t / 0.7, 0, 1) * Math.PI);
      for (const i of ALL) put(i, (col(i) - 1) * 3 * puff, (row(i) - 1) * 2.4 * puff, 0);
      out.hopY = -40 * air;
      out.antenna = 22 * Math.sin(t * Math.PI * 7) * (1 - smooth(t / 1.1));
    },
  },
  // pusing setelah diguncang atau diketuk berkali-kali: kepala berputar, badan sempoyongan
  pusing: {
    dur: 2.6,
    expression: "bingung",
    say: ["Pusiiing…", "Dunia berputar…"],
    fx: { name: "question", at: 0.3 },
    run(t, a, out, put) {
      const env = smooth(t / 0.3) * smooth((a.dur - t) / 0.5);
      const w = Math.sin(t * Math.PI * 2 * 1.4);
      for (const i of [0, 1, 2]) put(i, Math.cos(t * 9) * 3 * env, Math.sin(t * 9) * 2 * env, 0);
      for (const i of [3, 4, 5]) put(i, Math.cos(t * 9 - 0.8) * 1.5 * env, 0, 0);
      out.tilt = 9 * w * env;
      out.look = 3 * Math.sin(t * 10) * env;
      out.antenna = 26 * Math.sin(t * Math.PI * 2 * 2) * env;
    },
  },
  // geli saat disentuh kursor: menggeliat cepat dan tersipu
  geli: {
    dur: 1.2,
    expression: "senang",
    say: ["Hihi, geli!", "Aduh, geli!"],
    fx: { name: "heart" },
    run(t, a, out, put) {
      const s = Math.sin(t * Math.PI * 2 * 5) * (1 - smooth(t / a.dur));
      for (const i of ALL) put(i, s * 2 * (row(i) === 1 ? 1 : 0.5), -Math.abs(s) * 1.5, s * 4);
      out.tilt = s * 3;
      out.antenna = s * 12;
    },
  },
  // menyambut pengunjung: lompat kecil, lalu kedua tangan terangkat dan melambai bergantian
  sambut: {
    dur: 3,
    expression: "senang",
    fx: { name: "heart", at: 0.45 },
    run(t, a, out, put) {
      const hop = t < 0.5 ? Math.sin((t / 0.5) * Math.PI) : 0;
      const env = smooth((t - 0.3) / 0.35) * smooth((a.dur - t) / 0.45);
      const wave = Math.sin(t * Math.PI * 2 * 2.2);
      put(5, 11 * env, -16 * env, env * (-20 + 26 * wave));
      put(3, -11 * env, -16 * env, env * (20 + 26 * wave));
      for (const i of [0, 1, 2]) put(i, wave * 1.2 * env, -1.5 * env, 0);
      out.hands = [3, 5];
      out.hopY = -30 * hop;
      out.tilt = 2.5 * wave * env;
      out.antenna = -10 * env + 6 * wave * env;
      out.feet.l = { x: 0, y: -5 * hop };
      out.feet.r = { x: 0, y: -5 * hop };
    },
  },
  // jatuh dari tempat tinggi: badan tergencet, 1-3 blok kepala terlepas dan melenting dengan
  // gravitasi (memantul, tergelincir, lalu rebah), Rakit melirik ke arahnya, lalu blok-blok itu
  // melompat pulang satu per satu. Lantai = telapak kaki (y 158 viewBox).
  berserakan: {
    dur: 2.4,
    fx: { name: "sparkle", at: 1.9 },
    start(a) {
      // Hanya blok kepala (baris atas) yang lepas, 1-3 tergantung kerasnya benturan; wajah (baris
      // tengah) dan kaki tetap utuh supaya Rakit masih terbaca sebagai Rakit.
      const pool = [0, 1, 2].sort(() => Math.random() - 0.5);
      const count = 1 + (a.power > 0.62 ? 1 : 0) + (a.power > 0.9 ? 1 : 0);
      a.shards = pool.slice(0, count).map((i, n) => {
        const side = col(i) === 1 ? (Math.random() < 0.5 ? -1 : 1) : col(i) - 1;
        return {
          i,
          x: 0,
          y: 0,
          r: 0,
          // ke arah tepi layar yang dekat (`dir` berlawanan) blok hanya terlempar pelan
          vx:
            (side * (45 + Math.random() * 85) * (a.dir * side < -0.3 ? 0.3 : 1) + a.dir * 40) *
            a.power,
          vy: -(210 + Math.random() * 140) * a.power,
          vr: side * (200 + Math.random() * 360),
          home: 1.25 + n * 0.16,
          from: null,
        };
      });
      a.dur = 1.25 + (count - 1) * 0.16 + 0.85;
      a.last = 0;
    },
    run(t, a, out, put) {
      const shards = a.shards ?? [];
      const dt = Math.min(0.05, Math.max(0, t - (a.last ?? 0)));
      a.last = t;
      const loose = new Set(shards.map((p) => p.i));
      // badan yang tersisa tergencet lalu memantul kembali
      const squash = Math.exp(-t * 7) * Math.cos(t * 17) * a.power;
      for (const i of ALL) {
        if (loose.has(i)) continue;
        put(i, (col(i) - 1) * 5 * squash, (2 - row(i)) * 7 * squash, 0);
      }
      let lookX = 0;
      let snap = 0;
      for (const p of shards) {
        if (t < p.home) {
          // gravitasi (satuan viewBox), pantulan, gesekan lantai, dan rebah ke sisi terdekat
          p.vy += 1500 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.r += p.vr * dt;
          const rad = (p.r * Math.PI) / 180;
          const half = 14 * (Math.abs(Math.cos(rad)) + Math.abs(Math.sin(rad)));
          const floor = 158 - (CELL_CY[row(p.i)] + half);
          if (p.y >= floor) {
            p.y = floor;
            if (p.vy > 60) {
              p.vy = -p.vy * 0.36;
              p.vx *= 0.7;
              p.vr *= 0.55;
            } else {
              p.vy = 0;
              p.vx *= Math.exp(-dt * 7);
              p.vr *= Math.exp(-dt * 12);
              p.r += (Math.round(p.r / 90) * 90 - p.r) * Math.min(1, dt * 9);
            }
          }
          lookX += p.x;
        } else {
          // lompat pulang dalam busur, putarannya kembali ke kelipatan 360 terdekat
          p.from ??= { x: p.x, y: p.y, r: p.r };
          const q = smooth((t - p.home) / 0.38);
          const turns = Math.round(p.from.r / 360) * 360;
          p.x = p.from.x * (1 - q);
          p.y = p.from.y * (1 - q) - (24 + Math.abs(p.from.x) * 0.2) * Math.sin(Math.PI * q);
          p.r = p.from.r + (turns - p.from.r) * q;
          if (q >= 1) {
            p.r = 0;
            snap = Math.max(snap, 1 - (t - p.home - 0.38) / 0.3);
          }
        }
        put(p.i, p.x, p.y, p.r);
      }
      out.exact = [...loose];
      out.hands = shards.filter((p) => t < p.home + 0.38).map((p) => p.i);
      // melirik ke pecahannya, lalu antena tersentak tiap blok terpasang kembali
      out.look = t > 0.45 ? clamp(lookX / (shards.length || 1) / 12, -4, 4) : 0;
      out.antenna = 26 * Math.exp(-t * 4) * Math.sin(t * 22) + 10 * Math.max(0, snap);
      const done = shards.at(-1)?.home ?? 0;
      out.expression = t < 0.5 ? "kaget" : t < done + 0.4 ? "bingung" : "senang";
    },
  },
};

/** Bobot aksi idle acak; aksi yang sama tidak diulang dua kali berturut-turut. */
export const IDLE_WEIGHTS: Partial<Record<ActName, number>> = {
  jalan: 24,
  lambai: 14,
  toleh: 14,
  lompat: 11,
  geliat: 9,
  joget: 10,
  cilukba: 10,
  salto: 6,
};

/** Aksi acak saat Rakit diketuk. */
export const TAP_ACTS: ActName[] = ["lompat", "cilukba", "joget", "salto", "geli"];
