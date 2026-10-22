# PROGRESS

Branch kerja: `feat/portfolio-mvp`. Tidak ada `git push` dari agent.

## Fase selesai

| Fase | Status | Commit | Catatan |
|---|---|---|---|
| 0 Persiapan | Selesai, satu sisa keputusan (lihat di bawah) | `f97e364` chore: add gitignore and AGENTS.md; `513ff28` docs: add plan and inventory | `AGENTS.md` disalin ke root. `.gitignore` menutup `.env*`, `_sources/`, `docs/private/`. `docs/private/` tidak ter-track (`git ls-files docs/private` kosong) |

## Keputusan terbuka

1. **`opencode.json` belum di-commit.** Berisi `project_ref` Supabase, sedangkan `AGENTS.md` bagian 2b melarang Supabase di MVP. Pilihan: hapus entri Supabase lalu commit, atau biarkan untracked dan masuk `.gitignore`. Menunggu keputusan pemilik.
2. Jawaban pertanyaan 1-5 dan 9 di `docs/INVENTORY.md` (jalur kritis konten).

## Catatan sesi

- Figma MCP: 42 tool tersedia, termasuk tool tulis (`use_figma`, `create_new_file`, `generate_figma_design`, `send_code_to_figma`). Sesuai `AGENTS.md` bagian 2b, Figma tidak dipakai. Desain dikerjakan di kode memakai token bagian 6.
- Supabase MCP: tidak dipakai (larangan MVP).
- `docs/private/SECURITY-REPORT.md` bersifat rahasia dan di-ignore git.
