# PROGRESS

Branch kerja: `feat/portfolio-mvp`. Tidak ada `git push` dari agent.

## Fase selesai

| Fase                    | Status                                        | Commit                                                                               | Catatan                                                                                                                                                                                                                      |
| ----------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 Persiapan             | Selesai, satu sisa keputusan (lihat di bawah) | `f97e364` chore: add gitignore and AGENTS.md; `513ff28` docs: add plan and inventory | `AGENTS.md` disalin ke root. `.gitignore` menutup `.env*`, `_sources/`, `docs/private/`. `docs/private/` tidak ter-track (`git ls-files docs/private` kosong)                                                                |
| 1 Scaffold dan tooling  | Selesai                                       | `feat: scaffold next.js app and tooling`                                             | `typecheck`, `lint`, `build`, `validate:content` lolos. `GET /` pada `next start` = 200                                                                                                                                      |
| 2 Design system         | Selesai, CP1 disetujui                        | `feat: add design system and layout shell`                                           | Token persis AGENTS.md bagian 6. Komponen: Container, Heading, Badge, Card, Section, ExternalLink, Button, SkipLink, ThemeToggle, Header, Footer. Halaman sementara `/design` (noindex, dihapus di Fase 4)                   |
| CP1 keputusan           | Diterapkan                                    | `chore: apply cp1 decisions`                                                         | `opencode.json` di-ignore, token `--border-strong`, `engines.node >=24`, `next.config.ts` disederhanakan                                                                                                                     |
| 3 Content layer         | Selesai                                       | `feat: add content layer and case studies`                                           | Skema zod, loader MDX, data `site`/`skills`/`achievements`, `validate:content` (gagal bila non-draft memuat `TODO(owner)`, `TBD`, `lorem ipsum`, `<isi>`), 4 studi kasus                                                     |
| 4 Halaman               | Selesai, CP2 disetujui                        | `feat: add pages, seo and support routes`                                            | `/`, `/projects` (filter `?tech=`, jalan tanpa JS), `/projects/[slug]`, `/about`, `/contact`, `not-found`, `error`, `loading`, `sitemap`, `robots`, OG image, JSON-LD Person. `/design` dihapus                              |
| 5 SEO, a11y, performa   | Selesai                                       | `fix: correct heading order on projects page and add qa report`                      | Lighthouse (mobile) 4 kategori, axe-core 0 pelanggaran di 16 pemindaian. Accessibility, Best Practices, SEO = 100. Performance 93-98 (derau antar-jalan). Rincian di `docs/QA.md`                                            |
| 6 Konten dan kebersihan | Selesai                                       | `docs: add owner todo list and cleanliness scan`                                     | `docs/TODO-OWNER.md` (12 item per dampak). Pemindaian secret, HP, alamat: bersih. `docs/private/`, `opencode.json`, `.env*` tidak ter-track dan tidak pernah ada di riwayat. Satu keputusan: URL repo memuat nama organisasi |

## Hasil ukur Fase 2

Kontras teks (rasio WCAG, dihitung dari token):

| Pasangan           | Dark  | Light |
| ------------------ | ----- | ----- |
| fg / bg            | 15,87 | 17,50 |
| muted / bg         | 7,51  | 7,13  |
| muted / surface    | 6,97  | 7,58  |
| accent / bg        | 7,67  | 9,74  |
| accent-fg / accent | 7,67  | 10,36 |

Semua teks lolos AA (4,5:1). CLS = 0 saat muat dan saat ganti tema, di desktop dan 360px, kedua tema (Chromium headless). Tidak ada overflow horizontal di 360px. Tab pertama = skip link.

### Token `--border-strong` (keputusan CP1)

`--border` (1,35:1 dark, 1,21:1 light terhadap bg) tetap untuk garis dekoratif. Batas komponen interaktif (Button secondary, ThemeToggle, chip filter, garis timeline) memakai `--border-strong`:

| Pasangan                | Dark (`#5a6ea0`) | Light (`#7a869f`) |
| ----------------------- | ---------------- | ----------------- |
| border-strong / bg      | 3,79             | 3,44              |
| border-strong / surface | 3,52             | 3,66              |

Semua >= 3:1 (WCAG 1.4.11).

## Versi terpasang

Next 16.4.2, React 19.3.0, Tailwind ^4, zod ^4.6.7, next-mdx-remote ^6.0.0, geist ^1.8.2, lucide-react ^1.61.0, gray-matter ^4.0.3, Prettier ^3.9.10, ESLint ^9. Node 24.11.0, npm 11.6.1.

## Catatan teknis

- `npm audit`: 4 moderate di jalur produksi (`gray-matter` > `js-yaml` 3.15.2 > `argparse` > `sprintf-js`), 5 high di jalur dev (`eslint-config-next` > `braces`/`micromatch`/`fast-glob`). Diterima untuk MVP karena parser hanya membaca MDX milik sendiri saat build. **Parser MDX/frontmatter harus diganti jika suatu saat ada konten dari pengguna.**
- `next.config.ts`: `cacheComponents` dan `partialPrefetching` dihapus. Dengan `cacheComponents`, membaca `searchParams` di `/projects` mewajibkan Suspense. Sisa konfigurasi hanya aturan turbopack untuk Tailwind. Hasil: `/`, `/about`, `/contact`, `/projects/[slug]` statis; `/projects` dinamis (ƒ) karena `searchParams`.
- `scripts/validate-content.ts` dijalankan langsung dengan `node` (type stripping Node 24), tanpa `tsx`. `package.json` memakai `"type": "module"` dan `"engines": {"node": ">=24"}`.
- `build` menjalankan `validate:content` lebih dulu.
- `SITE_URL` (lihat `.env.example`) mengisi canonical, sitemap, dan Open Graph. Default `http://localhost:3000`. Isi saat deploy.
- lucide-react v1 tidak punya ikon merek (Github, Linkedin). Halaman kontak memakai `Code` dan `Briefcase`.
- Tombol unduh CV muncul hanya bila `public/cv.pdf` ada (dicek saat build).

## Data yang masih kosong (dihilangkan dari situs, tidak ditebak)

- `public/cv.pdf` (tombol unduh tersembunyi sampai file ada).
- File foto pemilik.
- Bidang Lomba Kompetensi Siswa 2023.
- Angka dampak: jumlah respons PMK Form, jumlah klik PI-LYNK, pengguna PI-CORE selain pemilik.
- URL/repo Dashboard Massa, Pemira 2025, Informatics Goes To TPB (hanya di timeline).
- URL produksi PI-CORE (baru staging).
- Nilai `SITE_URL` produksi.
- Screenshot yang disamarkan (belum dibuat).

## Keputusan konten pemilik

- Nama organisasi tidak ditampilkan. Penggunaan AI agent tidak dicantumkan. Nomor HP tidak ditampilkan.
- Docker/Linux/VPS bukan klaim skill; hanya catatan "Siap belajar: Docker dan deployment VPS." di kartu DevOps `/about`.
- PPLK 2026 hanya entri timeline (Divisi Implementasi Teknologi, Sub Frontend), tanpa jumlah commit.
- `pmkitera.web.id` bukan karya pemilik (kontributor saja), `website-pmk` dilewati. PI-CORE hanya penyedia login ala SSO.
- Studi kasus penuh: PMK Form, PI-CORE (in-progress), PI-LYNK. Ringkas: PMK ARK (`private-org`, tanpa tautan repo).

## Catatan sesi

- Figma MCP: 42 tool tersedia, termasuk tool tulis (`use_figma`, `create_new_file`, `generate_figma_design`, `send_code_to_figma`). Sesuai `AGENTS.md` bagian 2b, Figma tidak dipakai. Desain dikerjakan di kode memakai token bagian 6.
- Supabase MCP: tidak dipakai (larangan MVP).
- `docs/private/SECURITY-REPORT.md` bersifat rahasia dan di-ignore git.
