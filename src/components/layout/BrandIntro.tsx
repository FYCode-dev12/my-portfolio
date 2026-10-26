import { BRAND_TEXT_LENGTH, BrandMark } from "./BrandMark";

/**
 * Intro beranda: wordmark diketik di tengah layar lalu terbang ke posisinya di header.
 * Hanya aktif bila `html[data-intro]` dipasang oleh skrip tema di <head> (beranda, sekali
 * per sesi, tanpa reduced-motion). Hero tetap dirender di bawahnya, jadi LCP tidak tertunda.
 *
 * Skrip di bawah mengukur jarak ke wordmark header, menaruh hasilnya sebagai variabel CSS
 * di <html>, lalu mengubah `data-intro` menjadi "ready" agar animasi pindah baru dimulai
 * setelah nilainya ada. Semua penanda ada di <html> (suppressHydrationWarning), bukan di
 * elemen yang dikelola React, supaya hydration tidak bentrok. Skrip juga mengakhiri
 * intro lebih awal saat pengunjung klik, mengetik, atau menggulir. Tanpa skrip, wordmark
 * hanya memudar dan intro tetap selesai sendiri.
 */
const introScript = `(function(){var d=document.documentElement;if(!d.hasAttribute("data-intro"))return;
var o=document.getElementById("brand-intro"),m=o&&o.querySelector(".brand-intro-mark"),b=document.querySelector("[data-brand]"),ev=["pointerdown","keydown","wheel","touchstart"];
function end(){d.removeAttribute("data-intro");["--intro-dx","--intro-dy","--intro-s"].forEach(function(k){d.style.removeProperty(k)});ev.forEach(function(e){removeEventListener(e,end)})}
if(m&&b){var r=b.getBoundingClientRect(),s=m.getBoundingClientRect();if(s.width>0){d.style.setProperty("--intro-dx",(r.left-s.left)+"px");d.style.setProperty("--intro-dy",(r.top-s.top)+"px");d.style.setProperty("--intro-s",String(r.width/s.width));d.setAttribute("data-intro","ready")}}
ev.forEach(function(e){addEventListener(e,end,{passive:true})});setTimeout(end,1500)})()`;

export function BrandIntro() {
  return (
    <>
      <div
        id="brand-intro"
        aria-hidden="true"
        className="brand-intro"
        style={{ "--chars": BRAND_TEXT_LENGTH } as React.CSSProperties}
      >
        <span className="brand-intro-mark font-mono font-medium text-fg">
          <BrandMark />
        </span>
      </div>
      <script dangerouslySetInnerHTML={{ __html: introScript }} />
    </>
  );
}
