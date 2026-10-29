import { ANTENNA, BLOCK, CELLS, EXPRESSIONS, eyeGeometry, type Expression } from "./rakit";

/**
 * Fisika pegas maskot Rakit. Dimuat lazy oleh `useMascot` setelah halaman idle dan maskot terlihat,
 * jadi SVG statis dari server sudah tampil lebih dulu dan tidak ada CLS.
 *
 * Aturan gerak (brand/final/guideline.md, SKILL maskot-logo):
 * - Diseret: tidak ada blok jangkar. Blok dekat titik pegangan lebih kaku, sisanya tertinggal paling
 *   jauh satu blok (batas lunak), lalu menyatu kembali.
 * - Dilepas: Rakit pulang ke tempatnya dengan efek magnet, supaya tidak tertinggal menutupi konten.
 * - Dibiarkan: aksi idle acak (lambai, jalan, lompat, toleh, geliat), jeda 3 sampai 6 detik.
 * - Tidak mengikuti kursor (AGENTS.md 6b). Hanya `transform`. rAF berhenti saat diam, di luar
 *   viewport, dan saat tab tidak aktif. `prefers-reduced-motion`: tanpa lag, pegas, dan aksi idle,
 *   tapi tetap bisa digeser.
 */

export type RakitOptions = {
  /** Elemen yang lebarnya menjadi jalur aksi jalan. Tanpa ini, Rakit tidak berpindah tempat. */
  walkWithin?: Element | null;
};

export type RakitEngine = {
  setExpression(expression: Expression): void;
  destroy(): void;
};

type Mode = "idle" | "drag" | "settle" | "return";
type Point = { x: number; y: number };

type CellState = {
  g: SVGGElement;
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
  // posisi yang diminta aksi idle untuk blok ini
  ex: number;
  ey: number;
  er: number;
};

type ActOut = {
  tilt: number;
  antenna: number;
  bodyX: number | null;
  hopY: number;
  expression: Expression | null;
  hand: CellState | null;
  /** Geser mata ke samping (satuan), untuk menoleh. */
  look: number;
  feet: { l: Point; r: Point };
};

type Act = {
  dur: number;
  expression?: Expression;
  start?(a: ActState): void;
  run(
    t: number,
    a: ActState,
    out: ActOut,
    cell: (c: CellState, x: number, y: number, r: number) => void,
  ): void;
};
type ActState = { name: ActName; t: number; dur: number; dir: number; from: number; dist: number };
type ActName = "lambai" | "jalan" | "lompat" | "toleh" | "geliat";

const STEP = 1 / 240;
const IDLE_AFTER = 3500;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

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

const ACT_WEIGHTS: Record<ActName, number> = {
  jalan: 32,
  lambai: 22,
  toleh: 20,
  lompat: 14,
  geliat: 12,
};

export function createRakit(svg: SVGSVGElement, options: RakitOptions = {}): RakitEngine {
  const q = <T extends Element>(sel: string) => svg.querySelector<T>(sel);
  const cells: CellState[] = CELLS.map((c) => ({
    g: q<SVGGElement>(`[data-cell="${c.col}-${c.row}"]`)!,
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
  const antenna = q<SVGGElement>("[data-antenna]")!;
  const eyes = (["l", "r"] as const).map((side) => {
    const wrap = q<SVGGElement>(`[data-eye="${side}"]`)!;
    return {
      side: side === "l" ? (-1 as const) : (1 as const),
      wrap,
      tilt: wrap.querySelector<SVGGElement>("[data-tilt]")!,
      rect: wrap.querySelector<SVGRectElement>("rect")!,
      hosts: [] as CellState[],
    };
  });
  const feet = { l: q<SVGGElement>('[data-foot="l"]')!, r: q<SVGGElement>('[data-foot="r"]')! };

  const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = () => mqReduced.matches;

  const S = {
    mode: "idle" as Mode,
    expr: (svg.dataset.expression as Expression) ?? "netral",
    baseExpr: (svg.dataset.expression as Expression) ?? "netral",
    scale: 1,
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
    act: null as ActState | null,
    lastAct: null as ActName | null,
    lastInput: performance.now(),
    nextActAt: performance.now() + IDLE_AFTER,
    visible: true,
    pageVisible: document.visibilityState === "visible",
    hand: null as CellState | null,
    look: 0,
    feet: { l: { x: 0, y: 0 }, r: { x: 0, y: 0 } },
  };

  const measure = () => {
    S.scale = svg.getBoundingClientRect().width / 128 || 1;
  };
  measure();

  // rentang jalan (px, relatif ke posisi awal), diukur saat aksi dimulai sehingga ikut resize
  function walkRange() {
    const box = options.walkWithin?.getBoundingClientRect();
    if (!box) return { min: S.restX, max: S.restX };
    const r = svg.getBoundingClientRect();
    const homeLeft = r.left - S.px;
    return { min: box.left - homeLeft, max: box.right - homeLeft - r.width };
  }

  // ---- ekspresi: geometri mata, sudut diam antena, kecepatan kedip caret
  function setEyes(name: Expression) {
    if (S.expr === name && eyes[0].hosts.length) return;
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
    svg.classList.toggle("rakit-loading", EXPRESSIONS[name].fastCaret);
  }
  setEyes(S.expr);

  // ---- aksi idle: tiap aksi mengembalikan target per frame; pegas yang mengejarnya, jadi semua halus
  const ACTS: Record<ActName, Act> = {
    lambai: {
      dur: 2.4,
      expression: "senang",
      run(t, a, out, put) {
        const env = smooth(t / 0.35) * smooth((a.dur - t) / 0.4);
        const hand = cell(2, 1);
        put(hand, 11 * env, -15 * env, env * (-18 + 26 * Math.sin(t * Math.PI * 2 * 2.1)));
        put(cell(2, 0), 2 * env, -2 * env, 4 * env);
        out.hand = hand;
        out.tilt = -3 * env;
        out.antenna = -6 * env;
      },
    },
    jalan: {
      dur: 0,
      start(a) {
        const r = walkRange();
        let dir = Math.random() < 0.5 ? -1 : 1;
        if ((dir > 0 ? r.max - S.px : S.px - r.min) < 40) dir = -dir;
        const room = Math.max(0, dir > 0 ? r.max - S.px : S.px - r.min);
        a.dir = dir;
        a.from = S.px;
        a.dist = Math.min(room, 60 + Math.random() * 160);
        a.dur = a.dist < 8 ? 0.01 : Math.max(1.2, a.dist / 55 + 0.6);
      },
      run(t, a, out, put) {
        const p = smooth(clamp((t - 0.3) / Math.max(0.01, a.dur - 0.6), 0, 1));
        out.bodyX = a.from + a.dir * a.dist * p;
        const walking = smooth(t / 0.3) * smooth((a.dur - t) / 0.3);
        const ph = t * Math.PI * 2 * 1.9;
        const bob = Math.abs(Math.sin(ph)) * 3.6 * walking;
        for (const c of cells) put(c, (c.row === 2 ? 1.2 * Math.sin(ph) : 0) * walking, -bob, 0);
        out.feet.l = {
          x: a.dir * 4 * Math.sin(ph) * walking,
          y: -7 * Math.max(0, Math.sin(ph)) * walking,
        };
        out.feet.r = {
          x: a.dir * 4 * Math.sin(ph + Math.PI) * walking,
          y: -7 * Math.max(0, Math.sin(ph + Math.PI)) * walking,
        };
        out.tilt = (a.dir * 2 + 3.5 * Math.sin(ph)) * walking; // goyang dari kaki ke kaki
        out.antenna = -2.5 * Math.sin(ph) * walking;
      },
    },
    lompat: {
      dur: 1.3,
      run(t, _a, out, put) {
        const crouch = smooth(t / 0.22) * (1 - smooth((t - 0.22) / 0.08));
        const air = t > 0.28 && t < 0.78 ? Math.sin(((t - 0.28) / 0.5) * Math.PI) : 0;
        const land =
          t > 0.78
            ? Math.sin(clamp((t - 0.78) / 0.35, 0, 1) * Math.PI) * (1 - smooth((t - 1.0) / 0.3))
            : 0;
        const squash = crouch + land * 0.8;
        for (const c of cells)
          put(
            c,
            (c.col - 1) * 1.5 * squash,
            (2 - c.row) * 2.4 * squash - (2 - c.row) * 1.6 * air,
            0,
          );
        out.hopY = -46 * air;
        if (air > 0.3) out.expression = "senang";
      },
    },
    toleh: {
      dur: 2.6,
      run(t, _a, out, put) {
        const l = smooth((t - 0.15) / 0.25) * (1 - smooth((t - 0.95) / 0.25));
        const r = smooth((t - 1.25) / 0.25) * (1 - smooth((t - 2.05) / 0.3));
        const x = -4 * l + 4 * r;
        for (const c of cells) if (c.row === 0) put(c, x * 0.4, 0, 0);
        out.look = x;
        out.antenna = -x * 1.6;
      },
    },
    geliat: {
      dur: 2.4,
      run(t, _a, out, put) {
        const up = smooth(t / 0.5) * (1 - smooth((t - 1.3) / 0.3));
        const shake =
          t > 1.6 ? Math.sin((t - 1.6) * Math.PI * 2 * 7) * (1 - smooth((t - 1.6) / 0.7)) : 0;
        for (const c of cells)
          put(
            c,
            (c.col - 1) * -1.2 * up + shake * 1.6 * (c.row === 2 ? 0.4 : 1),
            -(2 - c.row) * 3.2 * up,
            shake * 3,
          );
        if (up > 0.5) out.expression = "loading";
        out.antenna = shake * 8;
      },
    },
  };

  function playAct(name: ActName) {
    if (reduced() || S.mode !== "idle") return;
    const a: ActState = { name, t: 0, dur: ACTS[name].dur, dir: 1, from: S.px, dist: 0 };
    ACTS[name].start?.(a);
    S.act = a;
    S.lastAct = name;
    wake();
  }
  function endAct() {
    if (!S.act) return;
    if (S.act.name === "jalan") S.restX = S.px;
    S.act = null;
    for (const c of cells) c.ex = c.ey = c.er = 0;
    S.hopY = 0;
    S.tx = S.restX;
    S.ty = 0;
    setEyes(S.baseExpr);
    S.nextActAt = performance.now() + 3000 + Math.random() * 3000;
  }
  function pickAct(): ActName {
    const names = (Object.keys(ACT_WEIGHTS) as ActName[]).filter((n) => n !== S.lastAct);
    let r = Math.random() * names.reduce((s, n) => s + ACT_WEIGHTS[n], 0);
    for (const n of names) if ((r -= ACT_WEIGHTS[n]) <= 0) return n;
    return names[0];
  }
  const scheduler = window.setInterval(() => {
    const now = performance.now();
    if (!S.visible || !S.pageVisible || reduced() || S.act || S.mode !== "idle") return;
    if (now - S.lastInput < IDLE_AFTER || now < S.nextActAt) return;
    playAct(pickAct());
  }, 500);

  // ---- seret: tubuh mengejar pointer dengan pegas kaku, dibatasi agar tetap di layar
  function onDown(ev: PointerEvent) {
    if (ev.button !== 0) return;
    ev.preventDefault();
    endAct();
    S.lastInput = performance.now();
    svg.setPointerCapture(ev.pointerId);
    svg.classList.add("rakit-dragging");
    measure();
    const r = svg.getBoundingClientRect();
    const homeLeft = r.left - S.px;
    const homeTop = r.top - S.py - S.hopY;
    S.bounds = {
      x0: -homeLeft,
      x1: window.innerWidth - (homeLeft + r.width),
      y0: -homeTop,
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
    S.tx = clamp(ev.clientX - S.grabDX, S.bounds.x0, S.bounds.x1);
    S.ty = clamp(ev.clientY - S.grabDY, S.bounds.y0, S.bounds.y1);
  }
  function onUp() {
    if (S.mode !== "drag") return;
    svg.classList.remove("rakit-dragging");
    S.lastInput = performance.now();
    setEyes(S.baseExpr);
    // pulang ke tempat diam: sisi yang menghadap rumah memimpin, sisanya tertinggal seperti ditarik magnet
    const dx = S.restX - S.px;
    const dy = -S.py;
    const len = Math.hypot(dx, dy);
    S.tx = S.restX;
    S.ty = 0;
    if (len < 4 || reduced()) {
      S.mode = "settle";
      if (reduced()) {
        S.px = S.tx;
        S.py = S.ty;
      }
    } else {
      S.mode = "return";
      S.grab = { x: 64 + (dx / len) * 44, y: 100 + (dy / len) * 44 };
    }
    wake();
  }
  svg.addEventListener("pointerdown", onDown);
  svg.addEventListener("pointermove", onMove);
  svg.addEventListener("pointerup", onUp);
  svg.addEventListener("pointercancel", onUp);

  // ---- simulasi
  const out: ActOut = {
    tilt: 0,
    antenna: 0,
    bodyX: null,
    hopY: 0,
    expression: null,
    hand: null,
    look: 0,
    feet: { l: { x: 0, y: 0 }, r: { x: 0, y: 0 } },
  };
  const put = (c: CellState, x: number, y: number, r: number) => {
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
    out.tilt = out.antenna = out.hopY = 0;
    out.bodyX = null;
    out.expression = null;
    out.hand = null;
    out.look = 0;
    out.feet = { l: { x: 0, y: 0 }, r: { x: 0, y: 0 } };
    for (const c of cells) c.ex = c.ey = c.er = 0;
    if (S.act) {
      S.act.t += dt;
      ACTS[S.act.name].run(S.act.t, S.act, out, put);
      setEyes(out.expression ?? ACTS[S.act.name].expression ?? S.baseExpr);
      if (S.act.t >= S.act.dur) endAct();
    }
    S.hopY = out.hopY;
    S.hand = out.hand;
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
    } else if (S.mode === "return") {
      [S.px, S.bvx] = spring(S.px, S.bvx, S.tx, 8, 0.78, dt);
      [S.py, S.bvy] = spring(S.py, S.bvy, S.ty, 8, 0.78, dt);
      if (Math.hypot(S.px - S.tx, S.py - S.ty) < 0.5 && Math.hypot(S.bvx, S.bvy) < 6) {
        S.px = S.tx;
        S.py = S.ty;
        S.bvx = S.bvy = 0;
        S.mode = "settle";
        S.omega += 300; // mendarat: antena tuing
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
    const moving = S.mode === "drag" || S.mode === "return";
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
      const soft = m > 0 ? (limit * Math.tanh(m / limit)) / m : 0; // melambat menuju batas, tidak membentur
      c.rx = c.ex + lx * soft;
      c.ry = c.ey + ly * soft;
      const wobble = moving
        ? clamp(
            c.vx * 0.05 - c.vy * 0.02,
            S.mode === "return" ? -10 : -5,
            S.mode === "return" ? 10 : 5,
          )
        : 0;
      [c.rot, c.vr] = spring(c.rot, c.vr, c.er + wobble, 16, 0.5, dt);
      worst = Math.max(worst, m * soft);
    }

    // seluruh tubuh condong ke arah gerak, bergoyang sedikit saat berhenti
    if (rm) {
      S.tilt = 0;
      S.vtilt = 0;
    } else
      [S.tilt, S.vtilt] = spring(
        S.tilt,
        S.vtilt,
        out.tilt + (moving ? clamp(S.velX * 0.008, -7, 7) : 0),
        11,
        0.42,
        dt,
      );

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

    if (
      S.mode === "settle" &&
      worst < 0.5 &&
      Math.hypot(S.px - S.tx, S.py - S.ty) < 0.5 &&
      cells.every((c) => Math.hypot(c.vx, c.vy) < 2)
    ) {
      S.mode = "idle";
      S.grab = null;
    }
  }

  const tf = (x: number, y: number, rot = 0, cx = 0, cy = 0) =>
    `translate(${x.toFixed(2)} ${y.toFixed(2)})` +
    (Math.abs(rot) > 0.01 ? ` rotate(${rot.toFixed(2)} ${cx} ${cy})` : "");

  function render() {
    svg.style.transform =
      S.px || S.py || S.hopY || S.tilt
        ? `translate(${S.px.toFixed(2)}px, ${(S.py + S.hopY).toFixed(2)}px) rotate(${S.tilt.toFixed(2)}deg)`
        : "";
    for (const c of cells) c.g.setAttribute("transform", tf(c.rx, c.ry, c.rot, c.cx, c.cy));
    for (const e of eyes) {
      const hosts = e.hosts.length > 1 ? e.hosts.filter((c) => c !== S.hand) : e.hosts;
      const ox = hosts.reduce((s, c) => s + c.rx, 0) / hosts.length;
      const oy = hosts.reduce((s, c) => s + c.ry, 0) / hosts.length;
      e.wrap.setAttribute("transform", tf(ox + S.look, oy));
    }
    const top = cell(1, 0);
    antenna.setAttribute(
      "transform",
      tf(top.rx, top.ry, S.theta, ANTENNA.pivot.x, ANTENNA.pivot.y),
    );
    const fl = cell(0, 2);
    const fr = cell(2, 2);
    feet.l.setAttribute("transform", tf(fl.rx + S.feet.l.x, fl.ry + S.feet.l.y));
    feet.r.setAttribute("transform", tf(fr.rx + S.feet.r.x, fr.ry + S.feet.r.y));
  }

  function atRest() {
    if (S.act || S.mode !== "idle") return false;
    return (
      Math.abs(S.theta - EXPRESSIONS[S.expr].antenna) < 0.01 &&
      S.omega === 0 &&
      Math.abs(S.tilt) < 0.02 &&
      Math.abs(S.vtilt) < 0.05 &&
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
    raf = S.visible && S.pageVisible ? requestAnimationFrame(frame) : 0;
  }
  function wake() {
    if (raf || !S.visible || !S.pageVisible) return;
    last = performance.now();
    acc = 0;
    raf = requestAnimationFrame(frame);
  }

  const io = new IntersectionObserver(([e]) => {
    S.visible = e.isIntersecting;
    svg.classList.toggle("rakit-paused", !S.visible);
    if (S.visible) wake();
  });
  io.observe(svg);
  const onVisibility = () => {
    S.pageVisible = document.visibilityState === "visible";
    if (S.pageVisible) wake();
  };
  document.addEventListener("visibilitychange", onVisibility);
  const onReduced = () => {
    if (reduced()) endAct();
    wake();
  };
  mqReduced.addEventListener("change", onReduced);
  window.addEventListener("resize", measure);

  return {
    setExpression(expression) {
      S.baseExpr = expression;
      if (!S.act && S.mode !== "drag") setEyes(expression);
      wake();
    },
    destroy() {
      cancelAnimationFrame(raf);
      raf = 0;
      window.clearInterval(scheduler);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      mqReduced.removeEventListener("change", onReduced);
      window.removeEventListener("resize", measure);
      svg.removeEventListener("pointerdown", onDown);
      svg.removeEventListener("pointermove", onMove);
      svg.removeEventListener("pointerup", onUp);
      svg.removeEventListener("pointercancel", onUp);
      svg.classList.remove("rakit-dragging", "rakit-paused");
      svg.style.transform = "";
    },
  };
}
