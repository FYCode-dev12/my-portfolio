"use client";

import { useEffect } from "react";

/**
 * Menandai `[data-step]` yang sedang dibaca di dalam `#rootId`, lalu memberi atribut
 * `data-current` pada `[data-target]` dengan nilai yang sama. Tanpa JS tidak ada yang ditandai.
 */
export function ScrollSpy({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    const steps = [...root.querySelectorAll<HTMLElement>("[data-step]")];
    const targets = [...root.querySelectorAll<HTMLElement>("[data-target]")];

    const mark = (key: string) => {
      for (const el of [...steps, ...targets]) {
        const own = el.dataset.step ?? el.dataset.target;
        el.toggleAttribute("data-current", own === key);
      }
    };

    const observer = new IntersectionObserver(
      (records) => {
        const visible = records.filter((r) => r.isIntersecting);
        const last = visible.at(-1)?.target as HTMLElement | undefined;
        if (last?.dataset.step) mark(last.dataset.step);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    steps.forEach((el) => observer.observe(el));
    if (steps[0]?.dataset.step) mark(steps[0].dataset.step);
    return () => observer.disconnect();
  }, [rootId]);

  return null;
}
