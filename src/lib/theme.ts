export type Theme = "dark" | "light";

const STORAGE_KEY = "theme";

function apply(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Penyimpanan diblokir (mode privat): tema tetap berlaku untuk sesi ini.
  }
}

/**
 * Ganti tema. Bila View Transitions API tersedia dan gerak tidak dikurangi, tema baru
 * terbuka sebagai lingkaran dari titik `origin` (biasanya tombol pemicu).
 */
export function toggleTheme(origin?: { x: number; y: number }) {
  const root = document.documentElement;
  const next: Theme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || typeof document.startViewTransition !== "function") {
    apply(next);
    return;
  }
  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? 0;
  root.style.setProperty("--vt-x", `${x}px`);
  root.style.setProperty("--vt-y", `${y}px`);
  document.startViewTransition(() => apply(next));
}

/** Titik tengah elemen, untuk asal transisi tema. */
export function centerOf(el: Element) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}
