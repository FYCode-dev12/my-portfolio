import type { CSSProperties } from "react";

type Particle = {
  kind: "block" | "ring" | "dim";
  style: CSSProperties;
};

/** Pembangkit acak berbenih (mulberry32): posisi sama di server dan tiap build, tanpa hydration. */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COUNT = 26;

const PARTICLES: Particle[] = (() => {
  const rand = seeded(29102026);
  return Array.from({ length: COUNT }, (_, i) => {
    const duration = 22 + rand() * 26;
    const kind = i % 5 === 0 ? "ring" : i % 3 === 0 ? "dim" : "block";
    return {
      kind,
      style: {
        "--x": `${(rand() * 98).toFixed(2)}%`,
        "--y": `${(rand() * 96).toFixed(2)}%`,
        "--s": `${Math.round(3 + rand() * (kind === "ring" ? 6 : 4))}px`,
        "--o": (0.18 + rand() * 0.32).toFixed(2),
        "--d": `${duration.toFixed(1)}s`,
        // jeda negatif: saat halaman dibuka partikel sudah tersebar di sepanjang lintasannya
        "--delay": `${(-rand() * duration).toFixed(1)}s`,
        "--dx": `${Math.round((rand() - 0.5) * 120)}px`,
        "--r": `${Math.round((rand() - 0.5) * 360)}deg`,
      } as CSSProperties,
    };
  });
})();

/** Partikel dekoratif di belakang konten (lihat `.particles` di globals.css). Tanpa JS klien. */
export function Particles() {
  return (
    <div aria-hidden="true" className="particles">
      {PARTICLES.map((p, i) => (
        <span key={i} data-kind={p.kind} className="particle" style={p.style} />
      ))}
    </div>
  );
}
