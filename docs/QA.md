# QA: SEO, aksesibilitas, performa (Fase 5)

Diukur pada build produksi lokal (`next build` + `next start`), Chromium headless, Lighthouse CLI bawaan (mobile, throttling simulasi). Lighthouse dijalankan lewat `npx` sekali pakai, tanpa menambah dependency. Hasil laboratorium lokal, bukan CDN Vercel.

## Skor Lighthouse

Dua kali jalan per halaman setelah perbaikan heading. Format: Performance / Accessibility / Best Practices / SEO.

| Halaman             | Jalan 1              | Jalan 2              | LCP       | CLS |
| ------------------- | -------------------- | -------------------- | --------- | --- |
| `/`                 | 96 / 100 / 100 / 100 | 94 / 100 / 100 / 100 | 2,2-2,4 s | 0   |
| `/projects`         | 98 / 100 / 100 / 100 | 93 / 100 / 100 / 100 | 2,1-2,4 s | 0   |
| `/projects/pi-core` | 95 / 100 / 100 / 100 | 95 / 100 / 100 / 100 | 1,8-2,1 s | 0   |
| `/about`            | 96 / 100 / 100 / 100 | 94 / 100 / 100 / 100 | 2,2-2,4 s | 0   |
| `/contact`          | 94 / 100 / 100 / 100 | 96 / 100 / 100 / 100 | 2,2-2,4 s | 0   |

Accessibility, Best Practices, dan SEO: 100 di semua halaman dan semua jalan.

**Performance belum stabil di atas 95.** Rentangnya 93-98 antar-jalan di mesin yang sama, jadi sebagian selisih adalah derau pengukuran. Penyebab yang terukur:

- JS total sekitar 142 KB gzip dalam 8 file. Bagian terbesar (chunk sekitar 72 KB gzip) berisi `react-dom`, yaitu baseline React + Next, bukan kode situs. Hanya dua file memakai `"use client"`: `ThemeToggle` dan `error.tsx`.
- Total Blocking Time 150-260 ms, hampir seluruhnya evaluasi skrip runtime tersebut.
- Satu stylesheet (5,4 KB) memblokir render sekitar 110-157 ms. `experimental.inlineCss` tidak dicoba karena dokumentasi Next menyebut halaman prerender tetap memakai `<link>`.
- TTFB 10-28 ms, jadi server lokal bukan penyebab. LCP adalah teks (render delay 80-100 ms), bukan gambar.
- Font Hanken Grotesk (satu file, sekitar 34 KB) dimuat lewat `next/font/google`, di-host sendiri saat build.

Ukur ulang di URL Vercel setelah deploy. Jika Performance di produksi < 95, langkah berikutnya yang bisa dipertimbangkan: kurangi font (tanpa Geist Mono di halaman yang tidak memakainya) dan uji `inlineCss`.

## Temuan dan perbaikan

| Temuan                                                                                            | Perbaikan                                                                                                                                |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `/projects`: `heading-order` (Accessibility 98). Kartu proyek memakai `h3` langsung di bawah `h1` | `ProjectCard` menerima `headingLevel`. `/projects` memakai `h2` dengan tampilan `h3`. Beranda tetap `h3` di bawah `h2` "Proyek unggulan" |
| `bf-cache` gagal pada `/projects` (`cache-control: no-store`)                                     | Tidak diperbaiki. Penyebabnya halaman dinamis karena `searchParams`. Tidak memengaruhi skor 4 kategori                                   |

## Aksesibilitas (axe-core)

axe-core 4 dengan tag `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, `best-practice`. 8 halaman x tema dark dan light = 16 pemindaian: **0 pelanggaran**.

- Urutan heading: satu `h1` per halaman, tanpa lompatan level.
- Landmark: satu `main` per halaman, skip link jadi fokus pertama, urutan Tab: skip link, logo, toggle tema, navigasi, CTA.
- Kontras: lihat `docs/PROGRESS.md` (teks >= 4,5:1; batas komponen `--border-strong` >= 3:1).
- `prefers-reduced-motion: reduce`: animasi name tag `none`. Mode normal: `sway`.
- Tanpa `<img>`, jadi tidak ada `alt` yang hilang. Name tag adalah SVG dekoratif (`aria-hidden`).
- Filter proyek bekerja tanpa JavaScript (`?tech=`).

## SEO

- `title` memakai template `%s | Febrian Yoel`. `description`, canonical, Open Graph (termasuk `og:image` dinamis 1200x630, 43 KB), dan `twitter:card` ada.
- `robots.txt` dan `sitemap.xml` (4 halaman + 4 studi kasus) valid. JSON-LD `Person` ada di `/about`.
- `lang="id"`.

**Catatan penting: `SITE_URL` dibaca saat build.** Halaman statis dirender saat `next build`, jadi canonical, sitemap, `robots.txt`, dan JSON-LD memakai nilai `SITE_URL` pada saat build. Pengujian dengan `SITE_URL` hanya saat `next start` tetap menghasilkan `http://localhost:3000`. Di Vercel, `SITE_URL` harus sudah diisi sebelum deploy. Dicatat untuk `docs/DEPLOY.md`.

## Belum diverifikasi

- Skor di URL produksi (CDN Vercel).
- Pratinjau Open Graph di WhatsApp, LinkedIn, dan sejenisnya (butuh URL publik).
- Pembaca layar sungguhan. Hanya axe-core dan uji keyboard otomatis yang dijalankan.

## Pengukuran ulang setelah redesain (build lokal, Okt 2026)

- axe-core 4 (wcag2a/aa, 21a/aa, 22aa, best-practice), 8 halaman x tema light dan dark: **0 pelanggaran**. Dua temuan awal (kontras akibat opacity awal animasi reveal, h1 beranda kosong untuk pembaca layar) sudah diperbaiki.
- Lighthouse (mobile): `/` 96, `/about` 97, `/projects` 99, `/projects/pmk-form` 98, `/contact` 95-97. Accessibility, Best Practices, SEO = 100 di semua. CLS 0. Desktop 100 di semua. LCP `/contact` pada mobile bervariasi 1,8-3,2 s antar-jalan (sampel pertama 90-92, setelah `priority` pada foto dan penghapusan fade foto 95-97).
- Klik-tembus Playwright semua kontrol di light/dark x desktop/mobile: header, menu mobile, toggle tema (tersimpan setelah muat ulang), unduh CV (header, kontak, footer), tombol hero, nama proyek di beranda, tautan beranda, filter proyek, baris proyek, tautan fakta, sebelumnya/berikutnya, kontak, footer, 404. Tanpa galat konsol selain 404 yang disengaja.
