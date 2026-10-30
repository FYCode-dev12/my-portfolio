"use client";

import { useEffect, useRef } from "react";

/**
 * Menandai `html[data-scrolled]` begitu halaman digulir lebih dari 24 px, untuk navbar kaca yang
 * mengambang. Satu IntersectionObserver pada penanda di puncak dokumen, tanpa listener scroll.
 * Tanpa JS navbar tetap di keadaan awal (bilah penuh di atas).
 */
export function ScrollState() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const marker = ref.current;
    if (!marker) return;
    const root = document.documentElement;
    const io = new IntersectionObserver(([entry]) => {
      root.toggleAttribute("data-scrolled", !entry.isIntersecting);
    });
    io.observe(marker);
    return () => {
      io.disconnect();
      root.removeAttribute("data-scrolled");
    };
  }, []);

  // `absolute` terhadap dokumen, jadi ikut tergulir. Jangan dipasang di dalam header: header
  // sticky menjadi containing block sehingga penanda ikut menempel.
  return <span ref={ref} aria-hidden="true" className="scroll-marker" />;
}
