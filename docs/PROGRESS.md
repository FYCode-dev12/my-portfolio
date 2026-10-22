# PROGRESS

Branch kerja: `feat/portfolio-mvp`. Tidak ada `git push` dari agent.

## Fase selesai

| Fase | Status | Commit | Catatan |
|---|---|---|---|
| 0 Persiapan | Selesai, satu sisa keputusan (lihat di bawah) | `f97e364` chore: add gitignore and AGENTS.md; `513ff28` docs: add plan and inventory | `AGENTS.md` disalin ke root. `.gitignore` menutup `.env*`, `_sources/`, `docs/private/`. `docs/private/` tidak ter-track (`git ls-files docs/private` kosong) |
| 1 Scaffold dan tooling | Selesai | `feat: scaffold next.js app and tooling` | `typecheck`, `lint`, `build`, `validate:content` lolos. `GET /` pada `next start` = 200 |
| 2 Design system | Selesai, menunggu CP1 | `feat: add design system and layout shell` | Token persis AGENTS.md bagian 6. Komponen: Container, Heading, Badge, Card, Section, ExternalLink, Button, SkipLink, ThemeToggle, Header, Footer. Halaman sementara `/design` (noindex, dihapus di Fase 4) |

## Hasil ukur Fase 2

Kontras teks (rasio WCAG, dihitung dari token):

| Pasangan | Dark | Light |
|---|---|---|
| fg / bg | 15,87 | 17,50 |
| muted / bg | 7,51 | 7,13 |
| muted / surface | 6,97 | 7,58 |
| accent / bg | 7,67 | 9,74 |
| accent-fg / accent | 7,67 | 10,36 |

Semua teks lolos AA (4,5:1). CLS = 0 saat muat dan saat ganti tema, di desktop dan 360px, kedua tema (Chromium headless). Tidak ada overflow horizontal di 360px. Tab pertama = skip link.

**Perlu keputusan pemilik:** token `--border` hanya 1,35:1 (dark) dan 1,21:1 (light) terhadap `--bg`. Ini cukup untuk garis dekoratif kartu, tetapi di bawah 3:1 yang diminta WCAG 1.4.11 untuk batas komponen UI. Tombol `secondary` dan ikon tema bergantung pada border itu, meski teks/ikonnya sendiri kontras. Token tidak diubah, sesuai larangan menambah/mengubah warna.

## Versi terpasang

Next 16.4.2, React 19.3.0, Tailwind ^4, zod ^4.6.7, next-mdx-remote ^6.0.0, geist ^1.8.2, lucide-react ^1.61.0, gray-matter ^4.0.3, Prettier ^3.9.10, ESLint ^9. Node 24.11.0, npm 11.6.1.

## Catatan teknis

- `npm audit`: 4 moderate di jalur produksi (`gray-matter` > `js-yaml` 3.15.2 > `argparse` > `sprintf-js`), tanpa perbaikan non-breaking. Diterima: parser hanya membaca MDX milik sendiri saat build. 5 high di jalur dev (`eslint-config-next` > `braces`/`micromatch`/`fast-glob`), tidak masuk bundel produksi.
- `next.config.ts` bawaan scaffold mengaktifkan `cacheComponents` dan `partialPrefetching`. Ini mengubah cara `searchParams` dan data dinamis diperlakukan. Cek dokumentasi via Context7 sebelum Fase 4 (filter `/projects`). Dibiarkan dulu.
- `scripts/validate-content.ts` dijalankan langsung dengan `node` (type stripping Node 24), tanpa `tsx`. `package.json` memakai `"type": "module"`.
- `build` menjalankan `validate:content` lebih dulu.

## Keputusan terbuka

1. **`opencode.json` belum di-commit.** Berisi `project_ref` Supabase, sedangkan `AGENTS.md` bagian 2b melarang Supabase di MVP. Pilihan: hapus entri Supabase lalu commit, atau biarkan untracked dan masuk `.gitignore`. Menunggu keputusan pemilik.
2. Jawaban pertanyaan 1-5 dan 9 di `docs/INVENTORY.md` (jalur kritis konten).

## Catatan sesi

- Figma MCP: 42 tool tersedia, termasuk tool tulis (`use_figma`, `create_new_file`, `generate_figma_design`, `send_code_to_figma`). Sesuai `AGENTS.md` bagian 2b, Figma tidak dipakai. Desain dikerjakan di kode memakai token bagian 6.
- Supabase MCP: tidak dipakai (larangan MVP).
- `docs/private/SECURITY-REPORT.md` bersifat rahasia dan di-ignore git.
