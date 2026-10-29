import {
  ACTS,
  IDLE_WEIGHTS,
  TAP_ACTS,
  type ActName,
  type ActOut,
  type ActState,
  type FxName,
} from "./acts";
import {
  BLOCK,
  CELLS,
  ANTENNA,
  EXPRESSIONS,
  VIEWBOX,
  eyeGeometry,
  eyeShape,
  type Expression,
} from "./rakit";
import { scanSurfaces, surfaceBelow, type Surface } from "./ground";
import { connectRakit } from "./react";

/**
 * Rakit pendamping: satu Rakit hidup yang bebas ditaruh di mana saja di layar (keputusan pemilik
 * 30 Okt 2026, menggantikan sistem kursi). Dimuat lazy oleh RakitCompanion setelah halaman idle.
 *
 * - Posisi: lapisan `fixed`. Rakit tidak melayang: ia berdiri di tepi bawah layar (seperti di
 *   bingkai laptop) atau di atas elemen halaman (ground.ts). Saat halaman digulir ia ikut terbawa
 *   pijakannya; pijakan yang keluar layar atau hilang membuatnya jatuh lagi. Posisi horizontal
 *   terakhir disimpan (rasio terhadap lebar layar) di localStorage. Bawaan: kanan bawah.
 * - Sambutan: Rakit naik dari tepi bawah layar setelah intro beranda selesai, melambai dengan dua
 *   tangan, dan menyapa sesuai waktu setempat lewat gelembung percakapan.
 * - Diseret: tanpa blok jangkar. Dilepas: jatuh dengan gravitasi (membawa laju lemparan) sampai
 *   kakinya menapak pijakan. Jatuh dari tempat tinggi: blok-bloknya berserakan lalu merakit ulang.
 *   Dilepas di atas `[data-rakit-drop]`, elemen itu menerima event `rakit:drop`;
 *   `[data-rakit-drop="click"]` diklik.
 * - Halaman bisa memanggil `rakitReact` (react.ts): ekspresi sementara, satu aksi, dan/atau kalimat
 *   di gelembung. Reaksi ber-`zone` hanya berlaku saat zonanya terlihat di layar.
 * - Mata selalu mengikuti kursor, juga saat sedang beraksi (pengecualian AGENTS.md 6b). Posisinya
 *   dihitung dari keadaan mesin, tanpa membaca layout tiap frame.
 * - Diketuk: aksi lucu acak plus celetukan; diketuk beruntun atau diguncang saat diseret: pusing.
 *   Disentuh kursor: geli, tanpa memutus aksi yang sedang berjalan.
 * - Dibiarkan (pengunjung tidak bergerak): aksi idle acak, lalu tertidur. Tidur murni CSS
 *   (`rakit-sleeping`), jadi rAF berhenti; setelah tidur sebentar ia bangun sendiri dan menggeliat.
 *   Disentuh, diketuk, atau didekati kursor saat tidur: kaget.
 * - Hanya `transform`. rAF berhenti saat diam dan saat tab tidak aktif. `prefers-reduced-motion`:
 *   tanpa terbang, pegas, lirikan, aksi, dan tidur; tetap bisa digeser dan tetap bicara.
 */

export type RakitReaction = {
  /** Hanya bereaksi bila elemen ini sedang terlihat di layar. */
  zone?: Element;
  expression?: Expression;
  /** Lama ekspresi sementara (ms). */
  ms?: number;
  act?: ActName;
  /** Kalimat di gelembung percakapan. */
  say?: string;
};

export type Companion = { destroy(): void };

type Mode = "idle" | "drag" | "travel" | "settle" | "fall";
/** Elemen yang sedang dipijak; `offset` = jarak tepi pijakan dari tepi atas elemen. */
type Support = { el: Element; offset: number; left: number; right: number };
type Point = { x: number; y: number };

type CellState = {
  g: SVGGElement | null;
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
/** Pengunjung tidak bergerak selama ini: Rakit tertidur. */
const SLEEP_AFTER = 28000;
/** Lama tidur sebelum bangun sendiri (ms), acak di antara dua angka ini. */
const NAP_MIN = 18000;
const NAP_MAX = 34000;
/** Aksi yang tidak diputus oleh sentuhan kursor (geli). */
const BIG_ACTS: ReadonlySet<ActName> = new Set([
  "salto",
  "cilukba",
  "kaget",
  "pusing",
  "geli",
  "sambut",
]);
/** Kursor sedekat ini: Rakit menyapa, atau kaget bila sedang tidur. */
const NEAR = 360;
/** Jeda minimum antar celetukan yang tidak diminta (ms). */
const CHATTER_GAP = 8000;
const POS_KEY = "rakit-pos";
const SEEN_KEY = "rakit-seen";
const ASPECT = VIEWBOX.height / VIEWBOX.width;
/** Telapak kaki: y 158 dari tinggi viewBox 168. */
const FOOT = 158 / VIEWBOX.height;
/** Gravitasi dan laju jatuh maksimum (px/s², px/s). */
const GRAVITY = 3200;
const MAX_FALL = 2600;
/** Menghantam pijakan lebih cepat dari ini (±0,7 tinggi layar laptop): blok berserakan. */
const SCATTER_SPEED = 1500;

const LINES = {
  startled: ["Eh! Aku nggak tidur, kok!", "Waa! Kaget aku."],
  wake: ["Hoaam… eh, kamu masih di sini!", "Hoaam… tadi cuma merem sebentar."],
  back: ["Eh, kamu kembali!", "Hai lagi! Lanjut lihat-lihat?"],
  drag: ["Wiii, terbang!", "Pelan-pelan, ya!"],
  drop: ["Di sini juga enak.", "Oke, aku tunggu di sini."],
  scatter: ["Aduuh, berantakan!", "Bruk! Rakit ulang dulu…"],
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const pick = <T>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)];

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

/** localStorage bisa kosong atau melempar (mode privat, data situs diblokir). */
function readStore(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeStore(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Posisi dan sapaan hanya kenyamanan; tanpa penyimpanan Rakit kembali ke bawaan.
  }
}

function greeting() {
  const h = new Date().getHours();
  if (h >= 4 && h < 11) return "Selamat pagi";
  if (h >= 11 && h < 15) return "Selamat siang";
  if (h >= 15 && h < 18) return "Selamat sore";
  return "Selamat malam";
}

export function createCompanion(svg: SVGSVGElement, bubble: HTMLElement): Companion {
  const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = () => mqReduced.matches;
  const q = <T extends Element>(sel: string) => svg.querySelector<T>(sel);

  const cells: CellState[] = CELLS.map((c) => ({
    g: q<SVGGElement>(`[data-cell="${c.col}-${c.row}"]`),
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
  const antenna = q<SVGGElement>("[data-antenna]");
  const feetEls = { l: q<SVGGElement>('[data-foot="l"]'), r: q<SVGGElement>('[data-foot="r"]') };
  const eyes: Eye[] = (["l", "r"] as const).flatMap((side) => {
    const wrap = q<SVGGElement>(`[data-eye="${side}"]`);
    const tilt = wrap?.querySelector<SVGGElement>("[data-tilt]");
    const rect = wrap?.querySelector<SVGRectElement>("rect");
    return wrap && tilt && rect
      ? [{ side: side === "l" ? (-1 as const) : (1 as const), wrap, tilt, rect, hosts: [] }]
      : [];
  });

  // ---- ukuran dan tempat
  const view = { w: 0, h: 0, W: 0, H: 0, margin: 24 };
  function measure() {
    view.w = document.documentElement.clientWidth;
    view.h = window.innerHeight;
    view.W = parseFloat(getComputedStyle(svg).width) || 100;
    view.H = view.W * ASPECT;
    view.margin = view.w < 640 ? 12 : 24;
  }
  /** Batas posisi kiri-atas Rakit; telapak kaki menapak tepi bawah layar paling rendah. */
  const bounds = () => ({
    x0: 0,
    x1: Math.max(0, view.w - view.W),
    y0: 0,
    y1: Math.max(0, view.h - view.H * FOOT),
  });

  const S = {
    mode: "idle" as Mode,
    expr: "netral" as Expression,
    mood: "netral" as Expression,
    moodUntil: 0,
    scale: 1,
    px: 0,
    py: 0,
    bvx: 0,
    bvy: 0,
    tx: 0,
    ty: 0,
    restX: 0,
    restY: 0,
    /** Posisi horizontal sebagai rasio terhadap lebar layar, supaya tetap pas saat layar berubah. */
    ratio: 1,
    /** Laju jatuh (px/s). */
    fvx: 0,
    fvy: 0,
    grab: null as Point | null,
    grabDX: 0,
    grabDY: 0,
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
    /** Interaksi terakhir dengan Rakit (menunda aksi idle). */
    lastInput: performance.now(),
    /** Gerak terakhir pengunjung di mana pun (menunda tidur). */
    lastActive: performance.now(),
    nextActAt: performance.now() + IDLE_AFTER,
    wakeAt: 0,
    pageVisible: document.visibilityState === "visible",
    hiddenAt: 0,
    entering: true,
    hands: [] as number[],
    spin: 0,
    sleeping: false,
    feet: { l: { x: 0, y: 0 }, r: { x: 0, y: 0 } },
  };

  /** Tempat istirahat bawaan: di posisi horizontal tersimpan, berdiri di tepi bawah layar. */
  function applyRatio() {
    const b = bounds();
    S.restX = b.x0 + S.ratio * (b.x1 - b.x0);
    S.restY = b.y1;
  }
  function rememberRest() {
    const b = bounds();
    S.ratio = b.x1 > b.x0 ? clamp((S.restX - b.x0) / (b.x1 - b.x0), 0, 1) : 1;
    writeStore(POS_KEY, JSON.stringify({ x: S.ratio }));
  }
  function loadRest() {
    measure();
    S.scale = view.W / VIEWBOX.width;
    const b = bounds();
    // bawaan: kanan bawah, berjarak `margin` dari tepi kanan
    S.ratio = b.x1 > 0 ? (b.x1 - view.margin) / b.x1 : 1;
    try {
      const saved = JSON.parse(readStore(POS_KEY) ?? "null") as Partial<Point> | null;
      if (typeof saved?.x === "number") S.ratio = clamp(saved.x, 0, 1);
    } catch {
      // nilai rusak: pakai bawaan
    }
    applyRatio();
  }

  // ---- pijakan dan gravitasi
  let support: Support | null = null;
  let surfaces: Surface[] = [];
  let surfacesStale = false;
  /** Rentang kaki (tengah 40% lebar) di posisi `x`. */
  const feetAt = (x: number) => [x + view.W * 0.3, x + view.W * 0.7] as const;
  /** Tepi pijakan di bawah `fromY` (tepi bawah layar bila tidak ada). */
  function floorBelow(fromY: number): { y: number; surface: Surface | null } {
    const [l, r] = feetAt(S.px);
    const s = surfaceBelow(surfaces, l, r, fromY);
    return s && s.top < view.h ? { y: s.top, surface: s } : { y: view.h, surface: null };
  }
  /** Tepi atas pijakan sekarang, atau null bila elemennya hilang atau tidak terlihat lagi. */
  function supportTop(): number | null {
    if (!support?.el.isConnected) return null;
    const el = support.el;
    if (
      typeof el.checkVisibility === "function" &&
      !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })
    ) {
      return null;
    }
    const r = el.getBoundingClientRect();
    return r.height > 0 ? r.top + support.offset : null;
  }
  /** Lepas dari pijakan dan jatuh dengan laju awal (vx, vy). */
  function startFall(vx = 0, vy = 0) {
    endAct();
    support = null;
    surfaces = scanSurfaces(svg);
    surfacesStale = false;
    S.grab = null;
    if (reduced()) {
      land(floorBelow(S.py + view.H * FOOT), 0);
      render();
      return;
    }
    S.fvx = clamp(vx, -1400, 1400);
    S.fvy = clamp(vy, -900, MAX_FALL);
    S.mode = "fall";
    wake();
  }
  function land(floor: { y: number; surface: Surface | null }, speed: number) {
    S.py = floor.y - view.H * FOOT;
    S.restX = S.tx = S.px;
    S.restY = S.ty = S.py;
    S.bvx = S.bvy = S.fvx = S.fvy = 0;
    const s = floor.surface;
    support = s
      ? { el: s.el, offset: s.top - s.el.getBoundingClientRect().top, left: s.left, right: s.right }
      : null;
    S.mode = "settle";
    rememberRest();
    if (speed > SCATTER_SPEED && !reduced()) {
      // berhamburan tepat saat menghantam pijakan, tanpa menunggu blok tenang
      S.mode = "idle";
      pendingArrive = null;
      pendingSay = false;
      // dekat tepi layar: blok dihamburkan ke arah yang lapang
      const room = view.w - view.W - 2 * S.px;
      playAct(
        "berserakan",
        clamp(room / (view.W * 2), -1, 1),
        clamp(0.55 + (speed - SCATTER_SPEED) / 2200, 0.55, 1),
      );
      say(pick(LINES.scatter));
    } else if (speed > 500) {
      tuing(S.fvx >= 0 ? 1 : -1);
    }
  }
  /** Ikut terbawa pijakan (halaman digulir atau tata letak berubah); jatuh bila pijakan hilang. */
  function ride() {
    if (S.mode === "fall") {
      surfacesStale = true;
      return;
    }
    if (S.entering || !support || (S.mode !== "idle" && S.mode !== "settle")) return;
    let top = supportTop();
    // pijakan naik sampai kepala Rakit terpotong, atau hilang: jatuh dari tempatnya sekarang
    if (top === null || top < view.H * FOOT) return startFall();
    if (top > view.h) {
      support = null;
      top = view.h;
    }
    const y = top - view.H * FOOT;
    if (Math.abs(y - S.py) < 0.5) return;
    S.py = S.restY = S.ty = prevPY = y;
    render();
  }

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
    svg.dataset.eyes = eyeShape(name);
    svg.classList.toggle("rakit-loading", EXPRESSIONS[name].fastCaret);
  }

  /** Ekspresi dasar: netral, ekspresi sementara dari `rakitReact`, atau tidur. */
  const base = (): Expression =>
    S.sleeping ? "tidur" : performance.now() < S.moodUntil ? S.mood : "netral";

  // ---- efek di atas kepala: diputar ulang dengan melepas lalu memasang `data-fx`
  let fxTimer = 0;
  function showFx(name: FxName, ms = 1700) {
    if (reduced()) return;
    window.clearTimeout(fxTimer);
    delete svg.dataset.fx;
    void svg.getBoundingClientRect();
    svg.dataset.fx = name;
    if (ms > 0) fxTimer = window.setTimeout(clearFx, ms);
  }
  function clearFx() {
    window.clearTimeout(fxTimer);
    delete svg.dataset.fx;
  }

  // ---- gelembung percakapan: satu kalimat tampil, sisanya antre (paling banyak tiga)
  const talk = {
    queue: [] as string[],
    busy: false,
    timer: 0,
    w: 0,
    h: 0,
    lastAuto: -Infinity,
    pos: "",
  };
  function placeBubble(force = false) {
    const cx = S.px + view.W / 2;
    let top = S.py + view.H * 0.03 - talk.h - 12;
    const below = top < 8;
    if (below) top = S.py + view.H * 0.95 + 10;
    const left = clamp(cx - talk.w / 2, 8, Math.max(8, view.w - talk.w - 8));
    const tail = clamp(cx - left, 14, Math.max(14, talk.w - 14));
    const key = `${Math.round(left)},${Math.round(top)},${Math.round(tail)},${below}`;
    if (!force && key === talk.pos) return;
    talk.pos = key;
    bubble.style.translate = `${Math.round(left)}px ${Math.round(top)}px`;
    bubble.style.setProperty("--tail", `${Math.round(tail)}px`);
    bubble.toggleAttribute("data-below", below);
  }
  function showLine(text: string) {
    talk.busy = true;
    bubble.textContent = text;
    talk.w = bubble.offsetWidth;
    talk.h = bubble.offsetHeight;
    placeBubble(true);
    bubble.dataset.show = "";
    window.clearTimeout(talk.timer);
    talk.timer = window.setTimeout(hideLine, Math.min(5200, 1700 + text.length * 55));
  }
  function hideLine() {
    delete bubble.dataset.show;
    const next = talk.queue.shift();
    if (next) talk.timer = window.setTimeout(() => showLine(next), 380);
    else talk.busy = false;
  }
  function say(text: string) {
    if (!text) return;
    if (!talk.busy) return showLine(text);
    if (talk.queue.at(-1) !== text && talk.queue.length < 3) talk.queue.push(text);
  }
  /** Celetukan yang tidak diminta: dibatasi supaya Rakit tidak cerewet. */
  function chatter(lines: readonly string[] | undefined, chance = 1) {
    const now = performance.now();
    if (!lines?.length || talk.busy || Math.random() > chance) return;
    if (now - talk.lastAuto < CHATTER_GAP) return;
    talk.lastAuto = now;
    say(pick(lines));
  }

  // ---- tidur dan bangun
  function sleep() {
    if (S.sleeping || reduced()) return;
    endAct();
    S.sleeping = true;
    S.wakeAt = performance.now() + NAP_MIN + Math.random() * (NAP_MAX - NAP_MIN);
    svg.classList.add("rakit-sleeping");
    setEyes("tidur");
    showFx("zzz", 0);
    wake();
  }
  /** "quiet": bangun tanpa reaksi. "startled": disentuh atau didekati, kaget. "self": bangun sendiri. */
  function wakeUp(how: "quiet" | "startled" | "self") {
    if (!S.sleeping) return;
    S.sleeping = false;
    const now = performance.now();
    S.lastInput = now;
    S.lastActive = now;
    svg.classList.remove("rakit-sleeping");
    clearFx();
    setEyes(base());
    if (how === "startled") {
      playAct("kaget");
      say(pick(LINES.startled));
    } else if (how === "self") {
      playAct("geliat");
      say(pick(LINES.wake));
    }
  }

  // ---- aksi
  /** Rentang jalan: sepanjang pijakan (kaki tetap di atasnya), atau selebar layar di tepi bawah. */
  function walkRange() {
    let min = view.margin;
    let max = view.w - view.W - view.margin;
    if (support) {
      min = Math.max(min, support.left - view.W * 0.3);
      max = Math.min(max, support.right - view.W * 0.7);
    }
    return max > min ? { min, max } : { min: S.px, max: S.px };
  }
  function playAct(name: ActName, dir = 1, power = 1) {
    if (reduced() || S.mode !== "idle") return;
    wakeUp("quiet");
    const a: ActState = { name, t: 0, dur: ACTS[name].dur, dir, from: S.px, dist: 0, power };
    ACTS[name].start?.(a, walkRange(), S.px);
    S.act = a;
    S.lastAct = name;
    if (name === "lambai" || name === "sambut") lastWave = performance.now();
    wake();
  }
  function endAct() {
    if (!S.act) return;
    const ended = S.act.name;
    if (ended === "jalan") {
      S.restX = S.px;
      rememberRest();
    }
    S.act = null;
    for (const c of cells) c.ex = c.ey = c.er = 0;
    S.hopY = 0;
    S.spin = 0;
    S.tx = S.restX;
    S.ty = S.restY;
    setEyes(base());
    S.nextActAt = performance.now() + 3000 + Math.random() * 3000;
    if (ended === "sambut") flushEarly();
  }
  function pickAct(): ActName {
    const names = (Object.keys(IDLE_WEIGHTS) as ActName[]).filter((n) => n !== S.lastAct);
    let r = Math.random() * names.reduce((s, n) => s + (IDLE_WEIGHTS[n] ?? 0), 0);
    for (const n of names) if ((r -= IDLE_WEIGHTS[n] ?? 0) <= 0) return n;
    return names[0];
  }
  const scheduler = window.setInterval(() => {
    const now = performance.now();
    if (!S.pageVisible) return;
    // pijakan bisa bergeser atau hilang tanpa gulir (pindah halaman, kartu memudar)
    ride();
    if (reduced() || S.entering || S.mode !== "idle") return;
    if (S.sleeping) {
      if (now >= S.wakeAt) wakeUp("self");
      return;
    }
    if (S.act) return;
    if (now - S.lastActive > SLEEP_AFTER) return sleep();
    if (now - S.lastInput < IDLE_AFTER || now < S.nextActAt) return;
    const act = pickAct();
    playAct(act);
    chatter(ACTS[act].say, 0.25);
  }, 500);
  const tuing = (dir = 1) => {
    if (!reduced()) {
      S.omega += 340 * dir;
      wake();
    }
  };

  // ---- sambutan
  let introWatch: MutationObserver | null = null;
  function enter() {
    introWatch?.disconnect();
    introWatch = null;
    measure();
    applyRatio();
    support = null;
    S.tx = S.restX;
    S.ty = S.restY;
    pendingArrive = "sambut";
    if (reduced()) {
      S.px = S.restX;
      S.py = S.restY;
      S.mode = "settle";
    } else {
      // naik dari balik tepi bawah layar; sisi atas memimpin, blok bawah tertinggal
      S.px = S.restX;
      S.py = view.h + 24;
      S.mode = "travel";
      S.grab = { x: 64, y: 56 };
    }
    prevPX = S.px;
    prevPY = S.py;
    render();
    wake();
  }
  function greet() {
    const seen = Number(readStore(SEEN_KEY) ?? 0);
    const now = Date.now();
    if (!seen) {
      say(`${greeting()}! Selamat datang.`);
      say("Aku Rakit. Seret aku ke mana saja, ya!");
    } else if (now - seen < 30 * 60 * 1000) {
      say("Hai lagi!");
    } else {
      say(`${greeting()}! Selamat datang kembali.`);
    }
    writeStore(SEEN_KEY, String(now));
  }
  // Reaksi yang datang selama sambutan diputar setelah sambutan selesai.
  let early: RakitReaction[] = [];
  function flushEarly() {
    const list = early;
    early = [];
    for (const r of list) onReact(r);
  }

  // ---- seret, ketuk, guncang
  const press = { at: 0, x: 0, y: 0, moved: 0, lastX: 0, dirX: 0, flips: 0, spoke: false };
  let taps: number[] = [];
  let lastTapAct: ActName | null = null;
  let pendingArrive: ActName | null = null;
  let pendingSay = false;
  function onDown(ev: PointerEvent) {
    if (ev.button !== 0 || S.entering) return;
    ev.preventDefault();
    const now = performance.now();
    S.lastInput = now;
    S.lastActive = now;
    // tersentuh saat tidur: kaget dulu, baru bisa diseret pada sentuhan berikutnya
    if (S.sleeping) return wakeUp("startled");
    endAct();
    clearFx();
    Object.assign(press, {
      at: now,
      x: ev.clientX,
      y: ev.clientY,
      moved: 0,
      lastX: ev.clientX,
      dirX: 0,
      flips: 0,
      spoke: false,
    });
    svg.setPointerCapture(ev.pointerId);
    svg.classList.add("rakit-dragging");
    support = null;
    measure();
    S.scale = view.W / VIEWBOX.width;
    S.mode = "drag";
    S.grab = { x: (ev.clientX - S.px) / S.scale, y: (ev.clientY - S.py) / S.scale };
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
    if (press.moved > 40 && !press.spoke) {
      press.spoke = true;
      chatter(LINES.drag, 0.35);
    }
    // guncangan: arah gerak horizontal berbalik berkali-kali
    const dx = ev.clientX - press.lastX;
    if (Math.abs(dx) > 14) {
      const dir = Math.sign(dx);
      if (press.dirX && dir !== press.dirX) press.flips++;
      press.dirX = dir;
      press.lastX = ev.clientX;
    }
    const b = bounds();
    S.tx = clamp(ev.clientX - S.grabDX, b.x0, b.x1);
    S.ty = clamp(ev.clientY - S.grabDY, b.y0, b.y1);
  }
  /** Elemen `[data-rakit-drop]` di bawah kaki Rakit, kalau ada. */
  function dropTarget(): Element | null {
    const x = S.tx + view.W / 2;
    const y = S.ty + view.H * 0.97;
    for (const el of document.elementsFromPoint(x, y)) {
      if (svg.contains(el)) continue;
      const hit = el.closest("[data-rakit-drop]");
      if (hit) return hit;
    }
    return null;
  }
  let lastUp = -Infinity;
  function onUp() {
    if (S.mode !== "drag") return;
    svg.classList.remove("rakit-dragging");
    const now = performance.now();
    lastUp = now;
    S.lastInput = now;
    setEyes(base());
    const target = dropTarget();
    const handled = !target?.dispatchEvent(
      new CustomEvent("rakit:drop", { bubbles: true, cancelable: true }),
    );
    if (!handled && target instanceof HTMLElement && target.dataset.rakitDrop === "click") {
      target.click();
    }
    if (press.moved < 6 && now - press.at < 400) {
      // diketuk: aksi lucu acak; empat ketukan beruntun membuatnya pusing
      taps = [...taps.filter((t) => now - t < 1600), now];
      if (taps.length >= 4) {
        taps = [];
        pendingArrive = "pusing";
      } else {
        const options = TAP_ACTS.filter((n) => n !== lastTapAct);
        lastTapAct = pick(options);
        pendingArrive = lastTapAct;
      }
      pendingSay = true;
    } else if (press.flips >= 5) {
      pendingArrive = "pusing";
      pendingSay = true;
    } else if (target) {
      showFx("heart");
    } else if (press.moved > 60) {
      chatter(LINES.drop, 0.3);
    }
    // dilepas: jatuh membawa laju seretan terakhir sampai menapak pijakan
    startFall(S.bvx, S.bvy);
  }
  /** Kursor menyentuh Rakit: geli, paling sering sekali tiap 2,5 detik. */
  let lastTickle = -Infinity;
  function onEnter(ev: PointerEvent) {
    if (ev.pointerType !== "mouse" || S.mode !== "idle" || S.entering || reduced()) return;
    if (S.sleeping) return wakeUp("startled");
    const now = performance.now();
    // melepas pointer capture setelah diseret ikut memicu pointerenter: bukan sentuhan baru
    if (now - lastUp < 1500 || now - lastTickle < 2500) return;
    lastTickle = now;
    S.lastInput = now;
    // aksi yang sedang berjalan tidak diputus; Rakit cukup tersipu
    if (S.act) {
      if (!BIG_ACTS.has(S.act.name)) showFx("heart");
      return;
    }
    playAct("geli");
    chatter(ACTS.geli.say, 0.5);
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
    exact: [],
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
    out.exact = [];
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
    } else if (S.mode === "fall") {
      // jatuh bebas; lemparan horizontal melambat dan memantul pelan di tepi layar
      const b = bounds();
      if (surfacesStale) {
        surfaces = scanSurfaces(svg);
        surfacesStale = false;
      }
      const footBefore = S.py + view.H * FOOT;
      S.fvy = Math.min(S.fvy + GRAVITY * dt, MAX_FALL);
      S.fvx *= Math.exp(-dt * 1.4);
      S.px += S.fvx * dt;
      if (S.px < b.x0 || S.px > b.x1) {
        S.px = clamp(S.px, b.x0, b.x1);
        S.fvx *= -0.35;
      }
      S.py += S.fvy * dt;
      if (S.py < b.y0) {
        S.py = b.y0;
        S.fvy = Math.max(0, S.fvy);
      }
      const floor = floorBelow(footBefore);
      if (S.fvy >= 0 && S.py + view.H * FOOT >= floor.y) land(floor, S.fvy);
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
    const moving = S.mode === "drag" || S.mode === "travel" || S.mode === "fall";
    let worst = 0;
    for (const c of cells) {
      if (rm) {
        c.ox = c.oy = c.vx = c.vy = c.rot = c.vr = c.rx = c.ry = 0;
        continue;
      }
      if (out.exact.includes(cells.indexOf(c))) {
        // pecahan berserakan: posisinya hasil simulasi aksi, pegas tidak ikut campur
        c.ox = c.rx = c.ex;
        c.oy = c.ry = c.ey;
        c.rot = c.er;
        c.vx = c.vy = c.vr = 0;
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
        const push = -(lx * hx + ly * hy) / hl;
        if (push > BLOCK / 3) {
          const k = (push - BLOCK / 3) / hl;
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

    // mata: arah dari aksi ditambah lirikan ke kursor, kapan pun (juga saat beraksi)
    let lx = out.look;
    let ly = 0;
    if (!rm && S.pointer && !S.sleeping) {
      const vx = S.pointer.x - (S.px + view.W / 2);
      const vy = S.pointer.y - (S.py + S.hopY * S.scale + view.H * 0.57);
      const dist = Math.hypot(vx, vy);
      if (dist > 1) {
        const k = Math.min(4, dist / 40) / dist;
        lx += vx * k;
        ly += vy * k;
      }
    }
    lx = clamp(lx, -6, 6);
    ly = clamp(ly, -4.5, 4.5);
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
      if (S.entering) {
        S.entering = false;
        greet();
      }
      if (pendingArrive) {
        const act = pendingArrive;
        pendingArrive = null;
        playAct(act);
        if (pendingSay) say(pick(ACTS[act].say ?? [""]));
        pendingSay = false;
        if (reduced() && act === "sambut") flushEarly();
      }
    }
  }

  const tf = (x: number, y: number, rot = 0, cx = 0, cy = 0) =>
    `translate(${x.toFixed(2)} ${y.toFixed(2)})` +
    (Math.abs(rot) > 0.01 ? ` rotate(${rot.toFixed(2)} ${cx} ${cy})` : "");

  function render() {
    // transform-origin di kaki (94%); salto berputar di pusat tubuh (57%), 37% tinggi di atasnya
    const lift = 0.37 * view.H;
    const spin = S.spin
      ? ` translateY(${-lift}px) rotate(${S.spin.toFixed(2)}deg) translateY(${lift}px)`
      : "";
    svg.style.transform =
      `translate(${S.px.toFixed(2)}px, ${(S.py + S.hopY * S.scale).toFixed(2)}px)` +
      (Math.abs(S.tilt) > 0.01 ? ` rotate(${S.tilt.toFixed(2)}deg)` : "") +
      spin;
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
    if (talk.busy) placeBubble();
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
    raf = S.pageVisible ? requestAnimationFrame(frame) : 0;
  }
  function wake() {
    if (raf || !S.pageVisible) return;
    last = performance.now();
    acc = 0;
    raf = requestAnimationFrame(frame);
  }

  // ---- event global
  const onVisibility = () => {
    S.pageVisible = document.visibilityState === "visible";
    const now = performance.now();
    if (!S.pageVisible) {
      S.hiddenAt = now;
      return;
    }
    S.lastActive = now;
    // kembali setelah lebih dari semenit di tab lain: disapa lagi
    if (S.hiddenAt && now - S.hiddenAt > 60000 && !S.entering) {
      if (S.sleeping) wakeUp("quiet");
      if (S.mode === "idle" && !S.act) playAct("lambai");
      chatter(LINES.back);
    }
    wake();
  };
  let wasNear = false;
  let lastWave = -Infinity;
  const onPointer = (ev: PointerEvent) => {
    const now = performance.now();
    S.pointer = { x: ev.clientX, y: ev.clientY };
    S.lastActive = now;
    if (reduced() || S.entering) return;
    const cx = S.px + view.W / 2;
    const near = Math.hypot(ev.clientX - cx, ev.clientY - (S.py + view.H / 2)) < NEAR;
    if (near) {
      if (S.sleeping) {
        if (S.mode === "idle") wakeUp("startled");
        wasNear = true;
        return;
      }
      S.lastInput = now;
      // ada orang mendekat: antena tuing; melambai paling sering sekali tiap 15 detik
      if (!wasNear && S.mode === "idle" && !S.act) {
        tuing(ev.clientX > cx ? -1 : 1);
        if (now - lastWave > 15000) playAct("lambai");
      }
    }
    wasNear = near;
    wake();
  };
  const onLeave = () => {
    S.pointer = null;
    wake();
  };
  const onActive = () => {
    S.lastActive = performance.now();
  };
  const onScroll = () => {
    S.lastActive = performance.now();
    ride();
  };
  const onResize = () => {
    measure();
    S.scale = view.W / VIEWBOX.width;
    // masih menunggu intro di luar layar: cukup perbarui tujuan sambutannya
    if (S.entering && S.mode === "idle") {
      applyRatio();
      S.px = S.restX;
      S.py = view.h + 24;
      return render();
    }
    if (S.mode === "travel") {
      applyRatio();
      S.tx = S.restX;
      S.ty = S.restY;
      return wake();
    }
    if (S.mode === "drag" || S.mode === "fall") return;
    // tetap di posisi horizontal yang sama (relatif), lalu cari pijakan lagi dari ketinggiannya
    applyRatio();
    S.px = prevPX = S.restX;
    S.py = prevPY = Math.min(S.py, bounds().y1);
    startFall();
  };
  const onScreen = (el: Element) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
  };
  let moodTimer = 0;
  function onReact(d: RakitReaction) {
    if (S.mode === "drag") return;
    if (d.zone && !onScreen(d.zone)) return;
    if (S.entering || S.act?.name === "sambut") {
      early = [...early, d].slice(-3);
      return;
    }
    wakeUp("quiet");
    S.lastInput = performance.now();
    if (d.say) say(d.say);
    if (!d.act && !d.expression) return;
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
  }
  const onReduced = () => {
    if (reduced()) {
      endAct();
      wakeUp("quiet");
      clearFx();
    }
    wake();
  };

  svg.addEventListener("pointerdown", onDown);
  svg.addEventListener("pointermove", onMove);
  svg.addEventListener("pointerup", onUp);
  svg.addEventListener("pointercancel", onUp);
  svg.addEventListener("pointerenter", onEnter);
  window.addEventListener("pointermove", onPointer, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("keydown", onActive, { passive: true });
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVisibility);
  mqReduced.addEventListener("change", onReduced);
  const disconnect = connectRakit(onReact);

  // Mulai di luar layar (di bawah), lalu naik setelah intro beranda selesai.
  loadRest();
  S.px = S.restX;
  S.py = view.h + 24;
  S.tx = S.restX;
  S.ty = S.restY;
  setEyes("netral", true);
  render();
  const root = document.documentElement;
  if (root.hasAttribute("data-intro")) {
    introWatch = new MutationObserver(() => {
      if (!root.hasAttribute("data-intro")) enter();
    });
    introWatch.observe(root, { attributes: true, attributeFilter: ["data-intro"] });
  } else {
    enter();
  }

  return {
    destroy() {
      cancelAnimationFrame(raf);
      raf = 0;
      window.clearInterval(scheduler);
      window.clearTimeout(moodTimer);
      window.clearTimeout(fxTimer);
      window.clearTimeout(talk.timer);
      introWatch?.disconnect();
      disconnect();
      svg.removeEventListener("pointerdown", onDown);
      svg.removeEventListener("pointermove", onMove);
      svg.removeEventListener("pointerup", onUp);
      svg.removeEventListener("pointercancel", onUp);
      svg.removeEventListener("pointerenter", onEnter);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onActive);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      mqReduced.removeEventListener("change", onReduced);
      svg.style.transform = "";
      delete bubble.dataset.show;
    },
  };
}
