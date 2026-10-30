import type { RakitReaction } from "./companion";

type Handler = (reaction: RakitReaction) => void;

let handler: Handler | null = null;
/** Reaksi yang dikirim sebelum mesin Rakit dimuat (mis. sapaan halaman); paling banyak tiga. */
let pending: Array<{ reaction: RakitReaction; at: number }> = [];
const PENDING_MS = 15000;

/**
 * Minta Rakit bereaksi (ekspresi sementara, satu aksi, dan/atau gelembung percakapan). Aman
 * dipanggil kapan saja. Reaksi tanpa `zone` yang datang sebelum mesin dimuat disimpan dan
 * diputar begitu Rakit tiba; reaksi ber-`zone` hanya berlaku bila zonanya sedang terlihat.
 */
export function rakitReact(reaction: RakitReaction) {
  if (handler) return handler(reaction);
  if (reaction.zone) return;
  pending = [...pending, { reaction, at: performance.now() }].slice(-3);
}

/** Dipakai mesin Rakit (companion.ts). Mengembalikan fungsi pelepas. */
export function connectRakit(next: Handler): () => void {
  handler = next;
  const now = performance.now();
  for (const p of pending) if (now - p.at < PENDING_MS) next(p.reaction);
  pending = [];
  return () => {
    if (handler === next) handler = null;
  };
}
