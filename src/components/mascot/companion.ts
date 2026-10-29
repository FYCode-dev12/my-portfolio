import {
  ACTS,
  IDLE_WEIGHTS,
  TAP_ACTS,
  type ActName,
  type ActOut,
  type ActState,
  type FxName,
} from "./acts";
import { ANTENNA, BLOCK, CELLS, EXPRESSIONS, eyeGeometry, type Expression } from "./rakit";

/**
 * Rakit pendamping: satu Rakit hidup yang menemani pengunjung dari kursi ke kursi
 * (`[data-rakit-seat]`, lihat RakitSeat). Dimuat lazy oleh RakitCompanion setelah halaman idle.
 *
 * - Pindah kursi: kursi yang paling dekat dengan pandangan menang (dengan histeresis). Rakit
 *   dipindah lewat portal React, lalu terbang dari posisi lamanya ke kursi baru (FLIP) dengan efek
 *   magnet: sisi depan memimpin, blok lain tertinggal paling jauh satu blok lalu menyatu.
 * - Diseret: tanpa blok jangkar. Dijatuhkan di atas `[data-rakit-drop]` (bingkai karya), elemen itu
 *   menerima event `rakit:drop`; Rakit lalu pulang ke kursinya.
 * - Strip karya yang digeser mengirim `rakit:walk`: Rakit berjalan di tempat seperti di treadmill.
 * - Halaman bisa mengirim `rakit:react` (misalnya perintah terminal): ekspresi sementara dan/atau
 *   satu aksi, hanya bila kursi Rakit ada di dalam `zone` yang dikirim.
 * - Elemen `[data-rakit-drop="click"]` diklik saat Rakit dijatuhkan di atasnya (misalnya tab).
 * - Mata melirik kursor (keputusan pemilik 29 Okt 2026, pengecualian AGENTS.md 6b).
 * - Diketuk: satu aksi lucu acak; diketuk beruntun atau diguncang saat diseret: pusing. Disentuh
 *   kursor: geli. Efek kecil di atas kepala (hati, not, tanda seru) lewat `data-fx` dan CSS.
 * - Dibiarkan: aksi idle acak, lalu tertidur setelah lama tanpa interaksi. Tidur murni CSS
 *   (`rakit-sleeping`), jadi rAF tetap berhenti; dibangunkan kursor yang mendekat, Rakit kaget.
 * - Hanya `transform`. rAF berhenti saat diam, di luar viewport, dan saat tab tidak aktif.
 *   `prefers-reduced-motion`: tanpa terbang, pegas, lirikan, aksi idle, dan tidur.
 */

/** "light": di atas bidang terang. "inverse": di atas bidang warna teks (kebalikan tema). */
export type SeatTone = "light" | "inverse";

export type RakitReaction = {
  /** Hanya bereaksi bila kursi Rakit ada di dalam elemen ini. */
  zone?: Element;
  expression?: Expression;
  /** Lama ekspresi sementara (ms). */
  ms?: number;
  act?: ActName;
};

export type SeatInfo = {
  id: number;
  el: HTMLElement;
  expression: Expression;
  tone?: SeatTone;
  arrive?: ActName;
};

export type Companion = {
  /** Dipanggil RakitCompanion setelah SVG Rakit terpasang di kursi baru. */
  attach(svg: SVGSVGElement, seat: SeatInfo): void;
  /** Cari ulang kursi (misalnya setelah pindah halaman). */
  rescan(): void;
  destroy(): void;
};

type Mode = "idle" | "drag" | "travel" | "settle";
type Point = { x: number; y: number };

type CellState = {
  g: SVGGElement | null;
  col: number;
  row: number;
  cx: number;
  cy: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  rx: number;
  ry: number;
  ex: number;
  ey: number;
  er: number;
};

type Eye = {
  side: -1 | 1;
  wrap: SVGGElement;
  tilt: SVGGElement;
  rect: SVGRectElement;
  hosts: CellState[];
};

const STEP = 1 / 240;
const IDLE_AFTER = 3500;
const SLEEP_AFTER = 28000;
/** Aksi yang tidak diputus oleh sentuhan kursor (geli). */
const BIG_ACTS: ReadonlySet<ActName> = new Set(["salto", "cilukba", "kaget", "pusing", "geli"]);
const LOOK_RADIUS = 360;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function spring(
  x: number,
  v: number,
  target: number,
  w: number,
  z: number,
  dt: number,
): [number, number] {
  const a = -w * w * (x - target) - 2 * z * w * v;
  v += a * dt;
  return [x + v * dt, v];
}

export function createCompanion({ onSeat }: { onSeat: (seat: SeatInfo) => void }): Companion {
  const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = () => mqReduced.matches;

  // Keadaan fisika bertahan saat Rakit pindah elemen, jadi gerakannya tidak putus.
  const cells: CellState[] = CELLS.map((c) => ({
    g: null,
    col: c.col,
    row: c.row,
    cx: c.x + BLOCK / 2,
    cy: c.y + BLOCK / 2,
    ox: 0,
    oy: 0,
    vx: 0,
    vy: 0,
    rot: 0,
    vr: 0,
    rx: 0,
    ry: 0,
    ex: 0,
    ey: 0,
    er: 0,
  }));
  const cell = (col: number, row: number) => cells[row * 3 + col];

  let svg: SVGSVGElement | null = null;
  let antenna: SVGGElement | null = null;
  let feetEls: { l: SVGGElement | null; r: SVGGElement | null } = { l: null, r: null };
  let eyes: Eye[] = [];
  let seat: SeatInfo | null = null;
  let fromRect: DOMRect | null = null;
  let pendingArrive: ActName | null = null;

  const seatIds = new WeakMap<Element, number>();
  let nextSeatId = 1;

  const S = {
    mode: "idle" as Mode,
    expr: "netral" as Expression,
    baseExpr: "netral" as Expression,
    mood: "netral" as Expression,
    moodUntil: 0,
    scale: 0.5,
    px: 0,
    py: 0,
    bvx: 0,
    bvy: 0,
    tx: 0,
    ty: 0,
    restX: 0,
    grab: null as Point | null,
    grabDX: 0,
    grabDY: 0,
    bounds: { x0: -Infinity, x1: Infinity, y0: -Infinity, y1: Infinity },
    hopY: 0,
    tilt: 0,
    vtilt: 0,
    theta: 0,
    omega: 0,
    velX: 0,
    lookX: 0,
    lookY: 0,
    lookTX: 0,
    lookTY: 0,
    pointer: null as Point | null,
    act: null as ActState | null,
    lastAct: null as ActName | null,
    lastInput: performance.now(),
    nextActAt: performance.now() + IDLE_AFTER,
    visible: true,
    pageVisible: document.visibilityState === "visible",
    hands: [] as number[],
    spin: 0,
    sleeping: false,
    look: 0,
    feet: { l: { x: 0, y: 0 }, r: { x: 0, y: 0 } },
  };

  // ---- ekspresi
  function setEyes(name: Expression, force = false) {
    if (!force && S.expr === name) return;
    S.expr = name;
    for (const e of eyes) {
      const g = eyeGeometry(name, e.side);
      e.rect.setAttribute("x", String(g.x));
      e.rect.setAttribute("y", String(g.y));
      e.rect.setAttribute("width", String(g.w));
      e.rect.setAttribute("height", String(g.h));
      if (g.tilt) e.tilt.setAttribute("transform", `rotate(${g.tilt} ${g.cx} ${g.cy})`);
      else e.tilt.removeAttribute("transform");
      // mata di celah antarkolom ikut rata-rata dua blok yang mengapitnya
      const ds = cells.map((c) => Math.hypot(c.cx - g.cx, c.cy - g.cy));
      const min = Math.min(...ds);
      e.hosts = cells.filter((_, i) => ds[i] < min + 0.5);
    }
    svg?.classList.toggle("rakit-loading", EXPRESSIONS[name].fastCaret);
  }

  /** Ekspresi dasar: ekspresi kursi, atau ekspresi sementara dari `rakit:react`. */
  const base = (): Expression =>
    S.sleeping ? "tidur" : performance.now() < S.moodUntil ? S.mood : S.baseExpr;

  // ---- efek di atas kepala: diputar ulang dengan melepas lalu memasang `data-fx`
  let fxTimer = 0;
  function showFx(name: FxName, ms = 1700) {
    if (!svg || reduced()) return;
    window.clearTimeout(fxTimer);
    delete svg.dataset.fx;
    void svg.getBoundingClientRect();
    svg.dataset.fx = name;
    if (ms > 0) fxTimer = window.setTimeout(clearFx, ms);
  }
  function clearFx() {
    window.clearTimeout(fxTimer);
    if (svg) delete svg.dataset.fx;
  }

  // ---- tidur: pose dan zzz dari CSS, mesin fisika diam
  function sleep() {
    if (!svg || S.sleeping || reduced()) return;
    endAct();
    S.sleeping = true;
    svg.classList.add("rakit-sleeping");
    setEyes("tidur");
    showFx("zzz", 0);
    wake();
  }
  function wakeUp(startled: boolean) {
    if (!S.sleeping) return;
    S.sleeping = false;
    S.lastInput = performance.now();
    svg?.classList.remove("rakit-sleeping");
    clearFx();
    setEyes(base());
    if (startled) playAct("kaget");
  }

  // ---- aksi
  function seatRange() {
    if (!seat || !svg) return { min: 0, max: 0 };
    const room = Math.max(
      0,
      (seat.el.getBoundingClientRect().width - svg.getBoundingClientRect().width) / 2,
    );
    return { min: -room, max: room };
  }
  function playAct(name: ActName, dir = 1) {
    if (reduced() || !svg || S.mode !== "idle") return;
    wakeUp(false);
    const a: ActState = { name, t: 0, dur: ACTS[name].dur, dir, from: S.px, dist: 0 };
    ACTS[name].start?.(a, seatRange(), S.px);
    S.act = a;
    if (name !== "treadmill") S.lastAct = name;
    if (name === "lambai") lastWave = performance.now();
    wake();
  }
  function endAct() {
    if (!S.act) return;
    if (S.act.name === "jalan") S.restX = S.px;
    S.act = null;
    for (const c of cells) c.ex = c.ey = c.er = 0;
    S.hopY = 0;
    S.spin = 0;
    S.tx = S.restX;
    S.ty = 0;
    setEyes(base());
    S.nextActAt = performance.now() + 3000 + Math.random() * 3000;
  }
  function pickAct(): ActName {
    const names = (Object.keys(IDLE_WEIGHTS) as ActName[]).filter((n) => n !== S.lastAct);
    let r = Math.random() * names.reduce((s, n) => s + (IDLE_WEIGHTS[n] ?? 0), 0);
    for (const n of names) if ((r -= IDLE_WEIGHTS[n] ?? 0) <= 0) return n;
    return names[0];
  }
  const scheduler = window.setInterval(() => {
    const now = performance.now();
    if (!svg || !S.visible || !S.pageVisible || reduced() || S.act || S.mode !== "idle") return;
    if (S.sleeping) return;
    if (now - S.lastInput > SLEEP_AFTER) return sleep();
    if (now - S.lastInput < IDLE_AFTER || now < S.nextActAt) return;
    playAct(pickAct());
  }, 500);
  const tuing = (dir = 1) => {
    if (!reduced()) {
      S.omega += 340 * dir;
      wake();
    }
  };

  // ---- kursi: yang paling dekat dengan 62% tinggi layar menang
  function seatInfo(el: HTMLElement): SeatInfo {
    let id = seatIds.get(el);
    if (!id) {
      id = nextSeatId++;
      seatIds.set(el, id);
    }
    return {
      id,
      el,
      expression: (el.dataset.expression as Expression | undefined) ?? "netral",
      tone: el.dataset.tone as SeatTone | undefined,
      arrive: el.dataset.arrive as ActName | undefined,
    };
  }
  function pickSeat() {
    if (S.mode === "drag") return;
    const vh = window.innerHeight;
    const anchor = vh * 0.62;
    let best: HTMLElement | null = null;
    let bestScore = Infinity;
    let currentScore = Infinity;
    for (const el of document.querySelectorAll<HTMLElement>("[data-rakit-seat]")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue; // disembunyikan di breakpoint ini
      // Rakit berdiri di tepi bawah kursi setinggi kira-kira kursinya: kursi dihitung terlihat hanya
      // bila separuh tubuh Rakit di atasnya ada di layar (di bawah header, di atas tepi bawah)
      const visible = r.bottom - r.height * 0.5 > 72 && r.bottom - r.height * 0.5 < vh;
      const score = Math.abs(r.bottom - anchor);
      if (seat?.el === el) currentScore = visible ? score : Infinity;
      if (visible && score < bestScore) {
        best = el;
        bestScore = score;
      }
    }
    if (!best || best === seat?.el) return;
    // histeresis: kursi sekarang yang masih terlihat dipertahankan kecuali kalah jauh
    if (seat?.el.isConnected && currentScore < bestScore + 140) return;
    fromRect = svg?.isConnected ? svg.getBoundingClientRect() : null;
    endAct();
    S.sleeping = false;
    S.lastInput = performance.now();
    onSeat(seatInfo(best));
  }
  let pickTimer = 0;
  const schedulePick = () => {
    if (pickTimer) return;
    pickTimer = window.setTimeout(() => {
      pickTimer = 0;
      pickSeat();
    }, 160);
  };

  // ---- seret, ketuk, guncang
  const press = { at: 0, x: 0, y: 0, moved: 0, lastX: 0, dirX: 0, flips: 0 };
  let taps: number[] = [];
  let lastTapAct: ActName | null = null;
  function onDown(ev: PointerEvent) {
    if (ev.button !== 0 || !svg) return;
    ev.preventDefault();
    wakeUp(false);
    endAct();
    clearFx();
    S.lastInput = performance.now();
    Object.assign(press, {
      at: S.lastInput,
      x: ev.clientX,
      y: ev.clientY,
      moved: 0,
      lastX: ev.clientX,
      dirX: 0,
      flips: 0,
    });
    svg.setPointerCapture(ev.pointerId);
    svg.classList.add("rakit-dragging");
    const r = svg.getBoundingClientRect();
    S.scale = r.width / 128 || S.scale;
    const homeLeft = r.left - S.px;
    const homeTop = r.top - S.py - S.hopY * S.scale;
    S.bounds = {
      x0: -homeLeft,
      x1: window.innerWidth - (homeLeft + r.width),
      y0: -homeTop + 64,
      y1: window.innerHeight - (homeTop + r.height),
    };
    S.mode = "drag";
    S.grab = { x: (ev.clientX - r.left) / S.scale, y: (ev.clientY - r.top) / S.scale };
    S.grabDX = ev.clientX - S.px;
    S.grabDY = ev.clientY - S.py;
    S.tx = S.px;
    S.ty = S.py;
    setEyes("senang");
    wake();
  }
  function onMove(ev: PointerEvent) {
    if (S.mode !== "drag") return;
    press.moved = Math.max(press.moved, Math.hypot(ev.clientX - press.x, ev.clientY - press.y));
    // guncangan: arah gerak horizontal berbalik berkali-kali
    const dx = ev.clientX - press.lastX;
    if (Math.abs(dx) > 14) {
      const dir = Math.sign(dx);
      if (press.dirX && dir !== press.dirX) press.flips++;
      press.dirX = dir;
      press.lastX = ev.clientX;
    }
    S.tx = clamp(ev.clientX - S.grabDX, S.bounds.x0, S.bounds.x1);
    S.ty = clamp(ev.clientY - S.grabDY, S.bounds.y0, S.bounds.y1);
  }
  /** Elemen `[data-rakit-drop]` di bawah kaki Rakit, kalau ada. */
  function dropTarget(): Element | null {
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height * 0.97;
    for (const el of document.elementsFromPoint(x, y)) {
      if (svg.contains(el)) continue;
      const hit = el.closest("[data-rakit-drop]");
      if (hit) return hit;
    }
    return null;
  }
  function onUp() {
    if (S.mode !== "drag" || !svg) return;
    svg.classList.remove("rakit-dragging");
    S.lastInput = performance.now();
    setEyes(base());
    const target = dropTarget();
    const handled = !target?.dispatchEvent(
      new CustomEvent("rakit:drop", { bubbles: true, cancelable: true }),
    );
    if (!handled && target instanceof HTMLElement && target.dataset.rakitDrop === "click") {
      target.click();
    }
    const now = performance.now();
    if (press.moved < 6 && now - press.at < 400) {
      // diketuk: aksi lucu acak; empat ketukan beruntun membuatnya pusing
      taps = [...taps.filter((t) => now - t < 1600), now];
      if (taps.length >= 4) {
        taps = [];
        pendingArrive = "pusing";
      } else {
        const options = TAP_ACTS.filter((n) => n !== lastTapAct);
        lastTapAct = options[Math.floor(Math.random() * options.length)];
        pendingArrive = lastTapAct;
      }
    } else if (press.flips >= 5) {
      pendingArrive = "pusing";
    } else if (target) {
      showFx("heart");
    }
    goHome();
  }
  /** Kursor menyentuh Rakit: geli, paling sering sekali tiap 2,5 detik. */
  let lastTickle = -Infinity;
  function onEnter(ev: PointerEvent) {
    if (ev.pointerType !== "mouse" || S.mode !== "idle" || reduced()) return;
    if (S.sleeping) return wakeUp(true);
    if (S.act && BIG_ACTS.has(S.act.name)) return;
    const now = performance.now();
    if (now - lastTickle < 2500) return;
    lastTickle = now;
    endAct();
    playAct("geli");
  }
  /** Pulang ke tempat duduk: sisi yang menghadap rumah memimpin, sisanya tertinggal. */
  function goHome() {
    const dx = S.restX - S.px;
    const dy = -S.py;
    const len = Math.hypot(dx, dy);
    S.tx = S.restX;
    S.ty = 0;
    if (reduced()) {
      S.px = S.tx;
      S.py = S.ty;
      S.mode = "settle";
    } else if (len < 4) {
      S.mode = "settle";
    } else {
      S.mode = "travel";
      S.grab = { x: 64 + (dx / len) * 44, y: 100 + (dy / len) * 44 };
    }
    wake();
  }

  // ---- simulasi
  const out: ActOut = {
    tilt: 0,
    antenna: 0,
    bodyX: null,
    hopY: 0,
    spin: 0,
    expression: null,
    hands: [],
    look: 0,
    feet: { l: { x: 0, y: 0 }, r: { x: 0, y: 0 } },
  };
  const put = (index: number, x: number, y: number, r: number) => {
    const c = cells[index];
    c.ex += x;
    c.ey += y;
    c.er += r;
  };
  let raf = 0;
  let last = 0;
  let acc = 0;
  let prevPX = 0;
  let prevPY = 0;

  function step(dt: number) {
    const rm = reduced();
    out.tilt = out.antenna = out.hopY = out.look = out.spin = 0;
    out.bodyX = null;
    out.expression = null;
    out.hands = [];
    out.feet = { l: { x: 0, y: 0 }, r: { x: 0, y: 0 } };
    for (const c of cells) c.ex = c.ey = c.er = 0;
    if (S.act) {
      S.act.t += dt;
      const spec = ACTS[S.act.name];
      spec.run(S.act.t, S.act, out, put);
      setEyes(out.expression ?? spec.expression ?? base());
      if (spec.fx && !S.act.fxShown && S.act.t >= (spec.fx.at ?? 0)) {
        S.act.fxShown = true;
        showFx(spec.fx.name);
      }
      if (S.act.t >= S.act.dur) endAct();
    }
    S.hopY = out.hopY;
    S.spin = out.spin;
    S.hands = out.hands;
    S.look = out.look;
    S.feet = out.feet;

    // tubuh
    if (S.mode === "drag") {
      if (rm) {
        S.px = S.tx;
        S.py = S.ty;
        S.bvx = S.bvy = 0;
      } else {
        [S.px, S.bvx] = spring(S.px, S.bvx, S.tx, 30, 0.9, dt);
        [S.py, S.bvy] = spring(S.py, S.bvy, S.ty, 30, 0.9, dt);
      }
    } else if (S.mode === "travel") {
      [S.px, S.bvx] = spring(S.px, S.bvx, S.tx, 8.5, 0.8, dt);
      [S.py, S.bvy] = spring(S.py, S.bvy, S.ty, 8.5, 0.8, dt);
      if (Math.hypot(S.px - S.tx, S.py - S.ty) < 0.5 && Math.hypot(S.bvx, S.bvy) < 6) {
        S.px = S.tx;
        S.py = S.ty;
        S.bvx = S.bvy = 0;
        S.mode = "settle";
        tuing(); // mendarat: antena tuing
      }
    } else if (out.bodyX != null) {
      S.px = out.bodyX;
    } else if (S.mode === "settle") {
      [S.px, S.bvx] = spring(S.px, S.bvx, S.tx, 26, 1, dt);
      [S.py, S.bvy] = spring(S.py, S.bvy, S.ty, 26, 1, dt);
    }
    const dX = (S.px - prevPX) / S.scale;
    const dY = (S.py - prevPY) / S.scale;
    prevPX = S.px;
    prevPY = S.py;
    S.velX += ((dX * S.scale) / dt - S.velX) * Math.min(1, dt * 14);
    if (Math.abs(S.velX) < 0.5) S.velX = 0; // peluruhan eksponensial tidak pernah nol sendiri

    // blok: mewarisi gerak tubuh sebagai lag, lalu kembali ke target aksi
    const moving = S.mode === "drag" || S.mode === "travel";
    let worst = 0;
    for (const c of cells) {
      if (rm) {
        c.ox = c.oy = c.vx = c.vy = c.rot = c.vr = c.rx = c.ry = 0;
        continue;
      }
      const d = moving && S.grab ? Math.hypot(c.cx - S.grab.x, c.cy - S.grab.y) / 30 : 1;
      c.ox -= dX;
      c.oy -= dY;
      const w = moving ? 30 / (1 + 0.5 * d) : S.mode === "settle" ? 22 : 17;
      const z = moving ? 0.78 : S.mode === "settle" ? 0.55 : 0.62;
      [c.ox, c.vx] = spring(c.ox, c.vx, c.ex, w, z, dt);
      [c.oy, c.vy] = spring(c.oy, c.vy, c.ey, w, z, dt);
      let lx = c.ox - c.ex;
      let ly = c.oy - c.ey;
      if (moving && S.grab) {
        // boleh tertinggal menjauh dari titik pegangan, tapi menekan ke arahnya paling jauh sepertiga blok
        const hx = c.cx - S.grab.x;
        const hy = c.cy - S.grab.y;
        const hl = Math.hypot(hx, hy) || 1;
        const press = -(lx * hx + ly * hy) / hl;
        if (press > BLOCK / 3) {
          const k = (press - BLOCK / 3) / hl;
          c.ox += hx * k;
          c.oy += hy * k;
          lx += hx * k;
          ly += hy * k;
        }
      }
      const limit = Math.min(BLOCK, 10 + 7 * d);
      let m = Math.hypot(lx, ly);
      if (m > limit * 1.6) {
        const k = (limit * 1.6) / m;
        c.ox = c.ex + lx * k;
        c.oy = c.ey + ly * k;
        lx *= k;
        ly *= k;
        m = limit * 1.6;
      }
      const soft = m > 0 ? (limit * Math.tanh(m / limit)) / m : 0; // melambat menuju batas
      c.rx = c.ex + lx * soft;
      c.ry = c.ey + ly * soft;
      const cap = S.mode === "travel" ? 10 : 5;
      const wobble = moving ? clamp(c.vx * 0.05 - c.vy * 0.02, -cap, cap) : 0;
      [c.rot, c.vr] = spring(c.rot, c.vr, c.er + wobble, 16, 0.5, dt);
      worst = Math.max(worst, m * soft);
    }

    // seluruh tubuh condong ke arah gerak, bergoyang sedikit saat berhenti
    if (rm) {
      S.tilt = 0;
      S.vtilt = 0;
    } else {
      const lean = out.tilt + (moving ? clamp(S.velX * 0.008, -7, 7) : 0);
      [S.tilt, S.vtilt] = spring(S.tilt, S.vtilt, lean, 11, 0.42, dt);
    }

    // antena: miring melawan gerak, berayun seperti pegas saat berhenti
    const rest = EXPRESSIONS[S.expr].antenna;
    if (rm) {
      S.theta = rest;
      S.omega = 0;
    } else {
      const target = rest + out.antenna + clamp(-S.velX * 0.03, -25, 25);
      [S.theta, S.omega] = spring(S.theta, S.omega, target, 19, 0.22, dt);
      if (!S.act && !moving && Math.abs(S.theta - target) < 0.15 && Math.abs(S.omega) < 3) {
        S.theta = target;
        S.omega = 0;
      }
    }

    // mata: melirik kursor dalam radius, atau ke arah yang diminta aksi
    let lx = out.look;
    let ly = 0;
    if (!rm && S.pointer && svg && !S.act) {
      const r = svg.getBoundingClientRect();
      const vx = S.pointer.x - (r.left + r.width / 2);
      const vy = S.pointer.y - (r.top + r.height * 0.57);
      const dist = Math.hypot(vx, vy);
      if (dist < LOOK_RADIUS && dist > 1) {
        const k = Math.min(4, dist / 40) / dist;
        lx = vx * k;
        ly = vy * k;
      }
    }
    S.lookTX = lx;
    S.lookTY = ly;
    const ease = 1 - Math.exp(-dt * 10);
    S.lookX += (lx - S.lookX) * ease;
    S.lookY += (ly - S.lookY) * ease;
    if (Math.abs(S.lookX - lx) < 0.01) S.lookX = lx;
    if (Math.abs(S.lookY - ly) < 0.01) S.lookY = ly;

    if (
      S.mode === "settle" &&
      worst < 0.5 &&
      Math.hypot(S.px - S.tx, S.py - S.ty) < 0.5 &&
      cells.every((c) => Math.hypot(c.vx, c.vy) < 2)
    ) {
      S.mode = "idle";
      S.grab = null;
      if (pendingArrive) {
        const act = pendingArrive;
        pendingArrive = null;
        playAct(act);
      }
    }
  }

  const tf = (x: number, y: number, rot = 0, cx = 0, cy = 0) =>
    `translate(${x.toFixed(2)} ${y.toFixed(2)})` +
    (Math.abs(rot) > 0.01 ? ` rotate(${rot.toFixed(2)} ${cx} ${cy})` : "");

  function render() {
    if (!svg) return;
    const moved = S.px || S.py || S.hopY || S.tilt || S.spin;
    // transform-origin di kaki (94%); salto berputar di pusat tubuh (57%), 37% tinggi di atasnya
    const lift = 0.37 * 168 * S.scale;
    const spin = S.spin
      ? ` translateY(${-lift}px) rotate(${S.spin.toFixed(2)}deg) translateY(${lift}px)`
      : "";
    svg.style.transform = moved
      ? `translate(${S.px.toFixed(2)}px, ${(S.py + S.hopY * S.scale).toFixed(2)}px) rotate(${S.tilt.toFixed(2)}deg)${spin}`
      : "";
    for (const c of cells) c.g?.setAttribute("transform", tf(c.rx, c.ry, c.rot, c.cx, c.cy));
    for (const e of eyes) {
      const free = e.hosts.filter((c) => !S.hands.includes(cells.indexOf(c)));
      const hosts = free.length > 0 ? free : e.hosts;
      const ox = hosts.reduce((s, c) => s + c.rx, 0) / hosts.length;
      const oy = hosts.reduce((s, c) => s + c.ry, 0) / hosts.length;
      e.wrap.setAttribute("transform", tf(ox + S.lookX, oy + S.lookY));
    }
    const top = cell(1, 0);
    antenna?.setAttribute(
      "transform",
      tf(top.rx, top.ry, S.theta, ANTENNA.pivot.x, ANTENNA.pivot.y),
    );
    const fl = cell(0, 2);
    const fr = cell(2, 2);
    feetEls.l?.setAttribute("transform", tf(fl.rx + S.feet.l.x, fl.ry + S.feet.l.y));
    feetEls.r?.setAttribute("transform", tf(fr.rx + S.feet.r.x, fr.ry + S.feet.r.y));
  }

  function atRest() {
    if (S.act || S.mode !== "idle") return false;
    return (
      Math.abs(S.theta - EXPRESSIONS[S.expr].antenna) < 0.01 &&
      S.omega === 0 &&
      Math.abs(S.tilt) < 0.02 &&
      Math.abs(S.vtilt) < 0.05 &&
      S.lookX === S.lookTX &&
      S.lookY === S.lookTY &&
      cells.every(
        (c) =>
          Math.hypot(c.ox, c.oy) < 0.03 &&
          Math.hypot(c.vx, c.vy) < 0.05 &&
          Math.abs(c.rot) < 0.02 &&
          Math.abs(c.vr) < 0.05,
      )
    );
  }

  function frame(t: number) {
    acc += Math.min(0.05, (t - last) / 1000);
    last = t;
    while (acc >= STEP) {
      step(STEP);
      acc -= STEP;
    }
    if (atRest()) {
      for (const c of cells) c.ox = c.oy = c.vx = c.vy = c.rot = c.vr = c.rx = c.ry = 0;
      S.tilt = S.vtilt = 0;
      render();
      raf = 0;
      return;
    }
    render();
    raf = svg && S.visible && S.pageVisible ? requestAnimationFrame(frame) : 0;
  }
  function wake() {
    if (raf || !svg || !S.visible || !S.pageVisible) return;
    last = performance.now();
    acc = 0;
    raf = requestAnimationFrame(frame);
  }

  // ---- event global
  // Pantau kursinya, bukan SVG: SVG yang sedang terbang dari posisi jauh tergeser keluar layar,
  // sehingga dianggap tidak terlihat dan loop berhenti di tengah jalan.
  const io = new IntersectionObserver((entries) => {
    const entry = entries.find((e) => e.target === seat?.el);
    if (!entry) return;
    S.visible = entry.isIntersecting;
    svg?.classList.toggle("rakit-paused", !S.visible);
    if (S.visible) wake();
  });
  // Tinggi halaman berubah (konten halaman baru tampil, gambar dimuat): pilih ulang kursi.
  const ro = new ResizeObserver(schedulePick);
  ro.observe(document.body);
  const onVisibility = () => {
    S.pageVisible = document.visibilityState === "visible";
    if (S.pageVisible) wake();
  };
  let wasNear = false;
  let lastWave = -Infinity;
  const onPointer = (ev: PointerEvent) => {
    S.pointer = { x: ev.clientX, y: ev.clientY };
    if (!svg || reduced() || !S.visible) return;
    const r = svg.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const near = Math.hypot(ev.clientX - cx, ev.clientY - (r.top + r.height / 2)) < LOOK_RADIUS;
    if (near) {
      // ada orang di dekatnya: berhenti bermain sendiri, antena tuing, lalu menoleh;
      // melambai menyapa paling sering sekali tiap 12 detik
      if (S.sleeping) {
        if (S.mode === "idle") wakeUp(true);
        wasNear = true;
        return;
      }
      S.lastInput = performance.now();
      if (!wasNear && S.mode === "idle") {
        if (S.act && S.act.name !== "lambai") endAct();
        tuing(ev.clientX > cx ? -1 : 1);
        if (!S.act && performance.now() - lastWave > 12000) playAct("lambai");
      }
    }
    wasNear = near;
    if (near || S.lookX || S.lookY) wake();
  };
  const onWalk = (ev: Event) => {
    const detail = (ev as CustomEvent<{ zone: Element; dir: number }>).detail;
    if (!seat || !svg || reduced() || S.mode !== "idle" || !detail?.zone.contains(seat.el)) return;
    wakeUp(false);
    if (S.act?.name === "treadmill") {
      S.act.dir = detail.dir;
      S.act.dur = Math.max(S.act.dur, S.act.t + 0.45);
      return;
    }
    if (S.act) endAct();
    playAct("treadmill", detail.dir);
  };
  let moodTimer = 0;
  const onReact = (ev: Event) => {
    const d = (ev as CustomEvent<RakitReaction>).detail;
    if (!d || !seat || !svg || S.mode === "drag") return;
    if (d.zone && !d.zone.contains(seat.el)) return;
    wakeUp(false);
    S.lastInput = performance.now();
    if (d.expression) {
      const ms = d.ms ?? 1800;
      S.mood = d.expression;
      S.moodUntil = performance.now() + ms;
      window.clearTimeout(moodTimer);
      moodTimer = window.setTimeout(() => {
        if (!S.act && S.mode !== "drag") setEyes(base());
        wake();
      }, ms);
    }
    // reaksi dari halaman menghentikan aksi idle yang sedang dimainkan
    if (S.act) endAct();
    if (d.act && !reduced() && S.mode === "idle") {
      playAct(d.act);
    } else {
      setEyes(base());
      tuing();
    }
    wake();
  };
  const onReduced = () => {
    if (reduced()) {
      endAct();
      wakeUp(false);
      clearFx();
    }
    wake();
  };
  window.addEventListener("scroll", schedulePick, { passive: true });
  window.addEventListener("resize", schedulePick);
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("rakit:walk", onWalk);
  window.addEventListener("rakit:react", onReact);
  document.addEventListener("visibilitychange", onVisibility);
  mqReduced.addEventListener("change", onReduced);
  pickSeat();

  function detachSvg() {
    if (seat) io.unobserve(seat.el);
    if (!svg) return;
    svg.removeEventListener("pointerdown", onDown);
    svg.removeEventListener("pointermove", onMove);
    svg.removeEventListener("pointerup", onUp);
    svg.removeEventListener("pointercancel", onUp);
    svg.removeEventListener("pointerenter", onEnter);
  }

  return {
    attach(next, info) {
      detachSvg();
      svg = next;
      seat = info;
      const q = <T extends Element>(sel: string) => next.querySelector<T>(sel);
      for (const c of cells) c.g = q<SVGGElement>(`[data-cell="${c.col}-${c.row}"]`);
      antenna = q<SVGGElement>("[data-antenna]");
      feetEls = { l: q<SVGGElement>('[data-foot="l"]'), r: q<SVGGElement>('[data-foot="r"]') };
      eyes = (["l", "r"] as const).flatMap((side) => {
        const wrap = q<SVGGElement>(`[data-eye="${side}"]`);
        const tilt = wrap?.querySelector<SVGGElement>("[data-tilt]");
        const rect = wrap?.querySelector<SVGRectElement>("rect");
        return wrap && tilt && rect
          ? [{ side: side === "l" ? (-1 as const) : (1 as const), wrap, tilt, rect, hosts: [] }]
          : [];
      });
      S.baseExpr = info.expression;
      S.sleeping = false;
      setEyes(info.expression, true);
      next.addEventListener("pointerdown", onDown);
      next.addEventListener("pointermove", onMove);
      next.addEventListener("pointerup", onUp);
      next.addEventListener("pointercancel", onUp);
      next.addEventListener("pointerenter", onEnter);
      S.visible = true;
      io.observe(info.el);

      const home = next.getBoundingClientRect();
      S.scale = home.width / 128 || S.scale;
      S.restX = 0;
      S.tx = 0;
      S.ty = 0;
      S.hopY = 0;
      if (fromRect && !reduced()) {
        // FLIP: mulai dari posisi lama (dibatasi ke tepi layar), terbang ke kursi baru
        S.px = clamp(fromRect.left - home.left, -window.innerWidth * 0.6, window.innerWidth * 0.6);
        S.py = clamp(fromRect.top - home.top, -window.innerHeight * 0.6, window.innerHeight * 0.6);
        const len = Math.hypot(S.px, S.py) || 1;
        S.mode = "travel";
        S.grab = { x: 64 - (S.px / len) * 44, y: 100 - (S.py / len) * 44 };
      } else {
        S.px = 0;
        S.py = 0;
        S.mode = "settle";
      }
      S.bvx = S.bvy = 0;
      prevPX = S.px;
      prevPY = S.py;
      pendingArrive = info.arrive ?? null;
      fromRect = null;
      render();
      wake();
    },
    rescan() {
      window.setTimeout(pickSeat, 60);
    },
    destroy() {
      cancelAnimationFrame(raf);
      raf = 0;
      window.clearInterval(scheduler);
      window.clearTimeout(pickTimer);
      window.clearTimeout(moodTimer);
      window.clearTimeout(fxTimer);
      detachSvg();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", schedulePick);
      window.removeEventListener("resize", schedulePick);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("rakit:walk", onWalk);
      window.removeEventListener("rakit:react", onReact);
      document.removeEventListener("visibilitychange", onVisibility);
      mqReduced.removeEventListener("change", onReduced);
      if (svg) svg.style.transform = "";
      svg = null;
    },
  };
}
