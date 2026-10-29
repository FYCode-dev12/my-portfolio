import type { CSSProperties } from "react";
import { CELLS } from "./FyGlyph";

/**
 * Intro beranda: sepuluh blok FY datang satu per satu dari berbagai arah, masing-masing dengan
 * ekor bayangan, lalu menyusun logo dan terbang ke posisinya di header. Hanya aktif bila
 * `html[data-intro]` dipasang oleh skrip tema di <head>: setiap kali beranda dimuat penuh (buka
 * atau refresh), tanpa reduced-motion. Pindah halaman lewat navigasi klien tidak menjalankan
 * ulang skrip itu, jadi intro tidak muncul. Hero tetap dirender di bawahnya, jadi LCP tidak
 * tertunda.
 *
 * Skrip di bawah mengukur jarak ke logo header, menaruh hasilnya sebagai variabel CSS di
 * <html>, lalu mengubah `data-intro` menjadi "ready" agar animasi pindah baru dimulai setelah
 * nilainya ada. Semua penanda ada di <html> (suppressHydrationWarning), bukan di elemen yang
 * dikelola React, supaya hydration tidak bentrok. Skrip juga mengakhiri intro lebih awal saat
 * pengunjung klik, mengetik, atau menggulir. Tanpa skrip, logo hanya memudar dan intro tetap
 * selesai sendiri.
 */
const introScript = `(function(){var d=document.documentElement;if(!d.hasAttribute("data-intro"))return;
var o=document.getElementById("brand-intro"),m=o&&o.querySelector(".brand-intro-mark"),b=document.querySelector("[data-brand]"),ev=["pointerdown","keydown","wheel","touchstart"];
function end(){d.removeAttribute("data-intro");["--intro-dx","--intro-dy","--intro-s"].forEach(function(k){d.style.removeProperty(k)});ev.forEach(function(e){removeEventListener(e,end)})}
if(m&&b){var r=b.getBoundingClientRect(),s=m.getBoundingClientRect();if(s.width>0){d.style.setProperty("--intro-dx",(r.left-s.left)+"px");d.style.setProperty("--intro-dy",(r.top-s.top)+"px");d.style.setProperty("--intro-s",String(r.width/s.width));d.setAttribute("data-intro","ready")}}
ev.forEach(function(e){addEventListener(e,end,{passive:true})});setTimeout(end,2200)})()`;

/** Blok 20 + celah 4 = rasio 5 : 1 yang sama dengan logo header, jadi pendaratannya pas. */
const BLOCK = 20;
const STEP = BLOCK + 4;
const SIZE = STEP * 5 - 4;
/** Jarak awal tiap blok (px) dan ekornya: jeda, opasitas, dan skala tiap bayangan. */
const RADIUS = 300;
const TRAIL = [
  { lag: 18, o: 0.5, s: 0.9 },
  { lag: 36, o: 0.38, s: 0.82 },
  { lag: 54, o: 0.28, s: 0.74 },
  { lag: 72, o: 0.19, s: 0.66 },
  { lag: 90, o: 0.12, s: 0.58 },
  { lag: 108, o: 0.06, s: 0.5 },
] as const;

/**
 * Arah datang tiap blok disebar dengan sudut emas, jadi tidak ada dua blok berurutan dari arah
 * yang sama. Dihitung saat render server (deterministik), lalu dibawa sebagai variabel CSS.
 */
const FLIGHTS = CELLS.map(([c, r], i) => {
  const a = ((i * 137.508 + 205) * Math.PI) / 180;
  return {
    x: c * STEP,
    y: r * STEP,
    style: {
      "--fx": `${Math.round(Math.cos(a) * RADIUS)}px`,
      "--fy": `${Math.round(Math.sin(a) * RADIUS * 0.8)}px`,
      "--t": `${60 + i * 80}ms`,
    } as CSSProperties,
  };
});

function Cell({
  x,
  y,
  scale = 1,
  className,
}: {
  x: number;
  y: number;
  scale?: number;
  className: string;
}) {
  const w = BLOCK * scale;
  const inset = (BLOCK - w) / 2;
  return (
    <rect className={className} x={x + inset} y={y + inset} width={w} height={w} rx={w * 0.2} />
  );
}

export function BrandIntro() {
  return (
    <>
      <div id="brand-intro" aria-hidden="true" className="brand-intro">
        <span className="brand-intro-mark">
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            width={SIZE}
            height={SIZE}
            focusable="false"
            className="fill-brand-glyph"
          >
            {FLIGHTS.map((f, i) => (
              <g key={i} style={f.style}>
                {/* Ekor digambar lebih dulu supaya berada di belakang blok utamanya. */}
                {TRAIL.map((t) => (
                  <g
                    key={t.lag}
                    className="intro-x"
                    style={{ "--lag": `${t.lag}ms`, "--o": t.o } as CSSProperties}
                  >
                    <Cell x={f.x} y={f.y} scale={t.s} className="intro-y intro-ghost" />
                  </g>
                ))}
                <g className="intro-x">
                  <g className="intro-y">
                    <Cell x={f.x} y={f.y} className="intro-pop" />
                  </g>
                </g>
              </g>
            ))}
          </svg>
        </span>
      </div>
      <script dangerouslySetInnerHTML={{ __html: introScript }} />
    </>
  );
}
