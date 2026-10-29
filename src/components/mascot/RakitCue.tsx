"use client";

import { useEffect } from "react";
import type { RakitReaction } from "./companion";
import { rakitReact } from "./react";

/**
 * Sapaan Rakit untuk satu halaman: dikirim sekali saat halaman tampil. Bila mesin Rakit belum
 * dimuat, sapaannya menunggu dan diputar setelah Rakit selesai menyambut pengunjung.
 */
export function RakitCue({ say, expression, act, ms }: Omit<RakitReaction, "zone">) {
  useEffect(() => {
    rakitReact({ say, expression, act, ms });
  }, [say, expression, act, ms]);
  return null;
}
