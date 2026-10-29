import type { RakitReaction } from "./companion";

/**
 * Minta Rakit bereaksi (ekspresi sementara dan/atau satu aksi). Aman dipanggil kapan saja:
 * kalau mesin belum dimuat atau kursi Rakit di luar `zone`, tidak terjadi apa-apa.
 */
export function rakitReact(detail: RakitReaction) {
  window.dispatchEvent(new CustomEvent<RakitReaction>("rakit:react", { detail }));
}
