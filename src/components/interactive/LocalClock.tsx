"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** Jam Lampung (WIB). Teks statis saat SSR, diperbarui tiap 30 detik saat tab terlihat. */
export function LocalClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    let timer: number | undefined;
    const tick = () => setTime(formatter.format(new Date()));
    const start = () => {
      tick();
      timer = window.setInterval(tick, 30_000);
    };
    const stop = () => window.clearInterval(timer);
    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <span className="tabular-nums">
      {time ?? "--.--"} <span className="text-muted">WIB</span>
    </span>
  );
}
