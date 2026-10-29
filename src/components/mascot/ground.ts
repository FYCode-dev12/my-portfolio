/**
 * Pijakan Rakit: tepi atas elemen yang terlihat di layar. Dipindai hanya saat Rakit mulai jatuh
 * (dan saat halaman digulir selama ia jatuh), bukan tiap frame.
 *
 * - Kotak: kartu, tombol, gambar, dan elemen membulat lainnya; tepi atas kotaknya.
 * - Teks: judul, paragraf, item daftar, tautan; tepi atas tiap baris teksnya (Range), jadi Rakit
 *   berdiri di atas huruf, bukan di atas ruang kosong di samping judul pendek.
 *
 * Setiap pijakan dicek dengan hit test di tepi atasnya, jadi teks yang terpotong `overflow`,
 * tersembunyi, atau tertutup header tidak dipakai.
 */

export type Surface = { el: Element; top: number; left: number; right: number };

const BOX =
  "[data-ui],[data-rakit-drop],[data-rakit-floor],img,button,.press,.rounded-sm,.rounded-md,.rounded-lg,.rounded-full";
const TEXT = "h1,h2,h3,h4,p,li,dt,dd,figcaption,label,a,kbd,code";
/** Lapisan yang bukan bagian halaman. */
const SKIP = ".rakit-stage,.brand-intro,.particles";

function landable(el: Element, top: number, left: number, right: number, vw: number) {
  const x = Math.min(vw - 1, Math.max(1, (Math.max(left, 0) + Math.min(right, vw)) / 2));
  const hit = document.elementFromPoint(x, top + 2);
  return hit !== null && el.contains(hit);
}

/** `ignore`: elemen yang dilewatkan saat hit test (SVG Rakit sendiri). */
export function scanSurfaces(ignore: SVGElement): Surface[] {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const out: Surface[] = [];
  const inView = (r: DOMRect) => r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
  const previous = ignore.style.pointerEvents;
  ignore.style.pointerEvents = "none";
  try {
    for (const el of document.querySelectorAll(BOX)) {
      const r = el.getBoundingClientRect();
      if (r.width < 24 || r.height < 8 || r.top < 0 || !inView(r) || el.closest(SKIP)) continue;
      if (landable(el, r.top, r.left, r.right, vw)) {
        out.push({ el, top: r.top, left: r.left, right: r.right });
      }
    }
    const range = document.createRange();
    for (const el of document.querySelectorAll(TEXT)) {
      if (!inView(el.getBoundingClientRect()) || el.closest(SKIP)) continue;
      range.selectNodeContents(el);
      for (const r of range.getClientRects()) {
        if (r.width < 12 || r.height < 6 || r.top < 0 || r.top >= vh) continue;
        if (landable(el, r.top, r.left, r.right, vw)) {
          out.push({ el, top: r.top, left: r.left, right: r.right });
        }
      }
    }
  } finally {
    ignore.style.pointerEvents = previous;
  }
  return out;
}

/** Pijakan tertinggi yang tepinya tidak di atas `fromY` dan berada di bawah rentang kaki. */
export function surfaceBelow(
  list: Surface[],
  footL: number,
  footR: number,
  fromY: number,
): Surface | null {
  let best: Surface | null = null;
  for (const s of list) {
    if (s.top < fromY - 0.5 || s.right <= footL || s.left >= footR) continue;
    if (!best || s.top < best.top) best = s;
  }
  return best;
}
