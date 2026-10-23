"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { SiteStatus, StatusResponse } from "@/lib/status";

type State =
  | { kind: "loading" }
  | { kind: "ready"; site: SiteStatus | undefined; checkedAt: string }
  | { kind: "error" };

// Satu permintaan dibagi semua badge di halaman.
let shared: Promise<StatusResponse> | null = null;

function loadStatus(): Promise<StatusResponse> {
  shared ??= fetch("/api/status").then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<StatusResponse>;
  });
  shared.catch(() => {
    shared = null;
  });
  return shared;
}

function minutesAgo(iso: string) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  return minutes === 0 ? "baru saja" : `${minutes} mnt lalu`;
}

/**
 * Status situs live, dicek oleh server situs ini (`/api/status`, cache 5 menit).
 * Diambil saat badge terlihat, bukan saat halaman dimuat.
 */
export function LiveStatus({ slug, className }: { slug: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const observer = new IntersectionObserver((records) => {
      if (!records.some((r) => r.isIntersecting)) return;
      observer.disconnect();
      loadStatus()
        .then((data) => {
          if (!cancelled)
            setState({ kind: "ready", site: data.sites[slug], checkedAt: data.checkedAt });
        })
        .catch(() => {
          if (!cancelled) setState({ kind: "error" });
        });
    });
    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [slug]);

  const up = state.kind === "ready" && state.site?.ok;
  const label =
    state.kind === "loading"
      ? "mengecek…"
      : state.kind === "error"
        ? "status tidak tersedia"
        : !state.site
          ? "tidak dipantau"
          : state.site.ok
            ? `online · ${state.site.code} · ${minutesAgo(state.checkedAt)}`
            : `tidak menjawab${state.site.code ? ` (${state.site.code})` : ""} · ${minutesAgo(state.checkedAt)}`;

  return (
    <span
      ref={ref}
      className={cn("inline-flex items-center gap-2 font-mono text-[0.8125rem]", className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-2 rounded-full",
          up ? "pulse-dot bg-accent" : "bg-muted",
          state.kind === "loading" && "blink",
        )}
      />
      <span role="status">{label}</span>
    </span>
  );
}
