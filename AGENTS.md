# AGENTS.md — Portofolio Febrian Yoel Anggara Saputra

> Konteks permanen untuk semua sesi opencode (Plan & Build). Jika instruksi di sesi bertentangan dengan file ini, tanyakan dulu, jangan menyimpang diam-diam.

## 1. Konteks & Tujuan

- Pemilik: Febrian Yoel Anggara Saputra, mahasiswa S1 Teknik Informatika ITERA (Fakultas Teknologi Industri).
- Tujuan: portofolio pribadi untuk (a) melamar **Magang FTI ITERA 2026/2027 - Fullstack Web Developer** (deadline pendaftaran **31 Okt 2026**, target live **28 Okt 2026**), dan (b) etalase jangka panjang.
- Pembaca utama: Koordinator TI Tim Pengembangan FTI dan recruiter. Mereka hanya skimming, jadi kejelasan lebih penting daripada kerumitan.
- Positioning: **"Fullstack web developer (React/TypeScript) yang membangun dan merilis sistem web untuk organisasi, sekaligus memimpin tim IT, dengan sisi desain & media."**
- Aturan emas konten: **jangan mengarang** teknologi, angka, atau capaian. Jika datanya tidak ada di repo/CV/AGENTS.md, tulis `TODO(owner): ...` dan tandai `draft: true`.

## 2. Tech Stack (terkunci)

- Next.js (App Router, versi stabil terbaru) + TypeScript `strict`
- Tailwind CSS v4 (design tokens via `@theme`)
- Konten: MDX (`next-mdx-remote/rsc` + `gray-matter`) divalidasi `zod` saat build
- Font: Hanken Grotesk (`next/font/google`, di-host sendiri saat build); ikon: `lucide-react`
- Package manager: `npm`. Deploy MVP: Vercel. Docker/VPS dikerjakan **setelah** pendaftaran dikirim.
- Dilarang menambah dependency berat (UI kit besar, library animasi besar) tanpa persetujuan. Motion cukup CSS.
- Sebelum memakai API Next.js yang dinamis (`params`, `searchParams`, `cookies`, dsb.), **cek dokumentasi versi yang terpasang**, jangan mengandalkan ingatan (API ini bisa berupa Promise di versi baru).

## 2b. MCP yang Tersedia

- **Context7: wajib dipakai** untuk dokumentasi Next.js, Tailwind v4, zod, dan `next-mdx-remote` sebelum menulis kode yang memakai API library tersebut. Jangan menebak sintaks dari ingatan.
- **Supabase: JANGAN dipakai di MVP.** Jangan membuat proyek, tabel, atau mengubah data apa pun, dan jangan menambah dependency Supabase. Dicadangkan untuk fase admin/CMS setelah pendaftaran dikirim.
- **Figma: opsional dan hanya jika alatnya memang tersedia.** Di awal sesi, daftar tool Figma MCP yang tersedia dan laporkan apakah bisa **membuat/mengubah** desain atau hanya **membaca**. Jika hanya membaca, abaikan. Desain dikerjakan langsung dalam kode berdasarkan token di bagian 6 dan dipantau lewat `npm run dev`. Jangan memakai Figma untuk menimpa token yang sudah ditetapkan.

## 3. Sitemap (5 route)

| Route | Isi |
|---|---|
| `/` | Hero, 3 proyek unggulan, ringkasan skill, 3-4 sorotan capaian, CTA (CV + kontak) |
| `/projects` | Semua proyek + filter teknologi |
| `/projects/[slug]` | Studi kasus (struktur di bawah) |
| `/about` | Cerita singkat, Skills (Frontend / Backend / DevOps & Tools / Desain & Media), Timeline (kepemimpinan, mengajar, prestasi, pendidikan) |
| `/contact` | Email, GitHub, LinkedIn, unduh CV. **Tanpa form di MVP** (hindari backend + spam) |

Tambahan wajib: `not-found.tsx`, `error.tsx`, `loading.tsx` seperlunya, `sitemap.ts`, `robots.ts`, Open Graph image, JSON-LD `Person`.

## 4. Model Konten

Studi kasus (`content/projects/*.mdx`) dengan kerangka isi: **Latar Belakang & Masalah Teknis -> Solusi & Arsitektur -> Teknologi & Alasannya -> Hasil & Key Takeaways**.

Frontmatter (validasi `zod`; build harus gagal jika tidak valid):

```ts
z.object({
  title: z.string().min(3),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  summary: z.string().max(200),
  role: z.string(),
  period: z.object({ start: z.string(), end: z.string().optional() }), // "YYYY-MM"
  status: z.enum(["live", "in-progress", "archived"]),
  stack: z.array(z.string()).min(1),
  links: z.object({
    live: z.string().url().optional(),
    repo: z.string().url().optional(),
  }),
  repoVisibility: z.enum(["public", "private-org", "none"]),
  featured: z.boolean().default(false),
  order: z.number().default(100),
  cover: z.string().optional(),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  draft: z.boolean().default(false),
});
```

Data bertipe (TypeScript) di `src/content/`: `site.ts` (nama, tagline, tautan), `skills.ts`, `achievements.ts` dengan bentuk `{ id, title, issuer?, date: "YYYY-MM", endDate?: "YYYY-MM"|"present", category: "leadership"|"award"|"training"|"teaching"|"education"|"media", description? }`.

## 5. Data CV (sumber kebenaran sementara)

Hanya info profesional. Nomor HP dan alamat rumah **tidak boleh** tampil di situs.

**Pendidikan:** S1 Teknik Informatika, ITERA (Mei 2024 - sekarang). SMK Pangudi Luhur Seputih Mataram, jurusan Rekayasa Perangkat Lunak (Agu 2021 - Mei 2024).

**Kepemimpinan & organisasi (PMK ITERA):**
- Feb 2026 - sekarang: Kepala Departemen CMIT, BPH PMK ITERA 2026 (memimpin program kerja departemen: pengelolaan media, informasi, dan teknologi).
- Mar-Mei 2026: Ketua Pelaksana PMK ITERA Easter Celebration 2026.
- Nov-Des 2025: Kepala Subdivisi Frontend, Pemira PMK ITERA 2025 (frontend website pemira, UI/UX, koordinasi tim).
- Sep-Nov 2025: Kepala Divisi Media Kreatif, PMK ITERA Talent Competition 2025.
- Agu-Sep 2025: Staff Backend, Informatics Goes To TPB 2025 (backend sistem kegiatan, data, integrasi).
- Feb-Des 2025: Staff Biro IT BPH PMK ITERA 2025 (mengelola dan mengembangkan **Dashboard Massa PMK**).
- Agu-Des 2024: Magang Publikasi & Dokumentasi PMK ITERA (CMIT).
- Media & dokumentasi (satukan jadi satu kelompok di timeline): Easter Celebration 2025, Ibadah PPLK & Family Gathering 2025, Natal Prodi TI 2025, PMK ITERA Christmas Celebration 2025.

**Mengajar:** Asisten Dosen Pengenalan Komputasi (Feb 2026 - sekarang).

**Prestasi & pelatihan:** Juara 1 Lomba Kompetensi Siswa tingkat Kabupaten (Feb 2023); Juara 2 Lomba Kompetensi Siswa tingkat Provinsi Lampung (Jul 2023); Pelatihan Pra-TD ITERA (Jun 2024). Bidang lomba: `TODO(owner)`.

**Skill dari CV:** Web development, photography, videography, video editing, graphic design, public speaking, teamwork, problem solving. Stack teknis **hanya dari bukti repo**.

**Kandidat proyek (fungsi dan stack ditentukan dari repo, bukan ditebak):** `pmkitera.web.id`, `form.pmkitera.web.id`, `ark.pmkitera.web.id`, `s.pmkitera.web.id`, Dashboard Massa PMK, website Pemira 2025 (frontend lead), sistem Informatics Goes To TPB (backend), mobile app PMK ITERA (in progress).

## 6. Design System: "type-only statement", hijau lumut di atas krem

Keputusan pemilik (Okt 2026): UI dibangun ulang mengikuti skill `design-taste-frontend` secara penuh. Ini **menggantikan** token navy dark-first yang lama. Arah visual: `type-only-statement` (seed 267782185, tersimpan di `.taste-skill/`, tidak di-commit).

- Light = default (palet yang dibagikan skill berlatar terang); dark tersedia lewat toggle (`data-theme`), dengan script inline kecil agar tidak flash. Menyimpang dari "dark-first" sebelumnya, dan kedua tema harus selalu berfungsi.
- Satu keluarga huruf: Hanken Grotesk (OFL) lewat `next/font/google`, di-host sendiri saat build. Tanpa monospace kecuali untuk kode literal.
- Judul maksimal 2 baris di semua lebar. Tanpa eyebrow, penomoran 01/02/03, garis rambut dekoratif, gradien, bayangan diam, kaca, atau kartu berikon.
- Dilarang menambah warna di luar token di bawah. Radius sedang.
- Gambar: foto nyata berlisensi terbuka di `public/photos/`, kredit di footer (`src/content/photos.ts`). Jangan menyajikan foto temuan sebagai foto pemilik, dan jangan mengarang screenshot.
- Gerak: CSS saja (masked headline, `animation-timeline: view()` dengan fallback, hover), hormati `prefers-reduced-motion`. Tanpa efek yang mengikuti kursor.

```css
:root {
  --bg: #ddd6c6;
  --surface: #d2cab8;
  --fg: #2a2a26;
  --muted: #3c3b35;
  --accent: #465833;
  --accent-fg: #ffffff;
  --field: #3f5a2a;
  --field-fg: #ffffff;
}

:root[data-theme="dark"] {
  --bg: #171912;
  --surface: #21241a;
  --fg: #e9e4d4;
  --muted: #c4bfac;
  --accent: #a9c27f;
  --accent-fg: #14170f;
  --field: #2f4220;
  --field-fg: #eef2e2;
}
```

### 6b. Interaksi & Animasi (dengan anggaran performa)

Pemilik ingin portofolio yang interaktif (name tag gantung ala lanyard yang bisa ditarik dan diayun, efek parallax), **tetapi performa tetap prioritas** (Lighthouse 95+).

- **Prinsip:** konten dan LCP tidak boleh bergantung pada animasi. Hero harus sudah terbaca penuh sebelum JS interaktif dimuat.
- **Parallax:** hanya CSS `transform`/`opacity` (tanpa library), hanya di hero, nonaktif saat `prefers-reduced-motion` dan di perangkat sentuh.
- **Paket interaksi (Fase 8A, opsional, bukan bagian MVP):** diagram arsitektur interaktif di studi kasus, status badge website live, command palette ala terminal, dan transisi ganti tema (View Transitions API dengan fallback). Semuanya tanpa dependency baru kecuali disetujui pemilik.
- **DILARANG:** efek yang mengikuti kursor (cursor spotlight, custom cursor, magnetic button, trail), karena memicu lag/delay pointer. Pemilik secara eksplisit menolaknya.
- **Name tag lanyard:** diimplementasikan di **Fase 8B (opsional)**, bukan bagian MVP. Gunakan simulasi fisika 2D ringan (verlet rope) dengan SVG/canvas dan Pointer Events, **tanpa dependency baru**. Dilarang memakai three.js, `@react-three/fiber`, atau physics engine WASM kecuali pemilik menyetujui secara eksplisit.
- **Anggaran:** tambahan JS maksimal sekitar 12 KB gzipped untuk seluruh Fase 8A dan sekitar 8 KB gzipped untuk Fase 8B, masing-masing dimuat lazy (`next/dynamic`, `ssr: false` bila client-only) setelah idle, saat terlihat di viewport, atau saat dipicu pengguna. Tidak boleh menurunkan skor Lighthouse di bawah 95 atau menambah CLS.
- **Wajib:** ruang hero dicadangkan dengan tinggi tetap (tanpa CLS), ada fallback statis (gambar/SVG name tag) untuk SSR, `prefers-reduced-motion`, dan perangkat lemah. Animasi dijeda saat di luar viewport dan saat tab tidak aktif. Komponen `aria-hidden` (dekoratif), tidak menjebak fokus keyboard, dan `touch-action: none` hanya pada name tag agar scroll halaman tidak terganggu.


## 7. Standar Kualitas

- Production-ready: clean code, modular, DRY/SOLID, komponen reusable, **tidak ada kode yang dipotong atau berisi placeholder logika**.
- Lighthouse 95+ (Performance, Accessibility, Best Practices, SEO). Optimasi Core Web Vitals: `next/image`, font via `next/font`, minim JS client, Server Components secara default.
- Aksesibilitas WCAG AA: HTML semantik, skip link, fokus terlihat, navigasi keyboard, kontras, `alt` bermakna.
- Setiap komponen interaktif punya loading/error state. Jangan menelan error secara diam-diam.
- Script wajib di `package.json`: `dev`, `build`, `start`, `lint`, `typecheck`, `validate:content`.

## 8. Keamanan & Privasi

- **Jangan membaca atau mengutip** `.env*`, kredensial, token, atau data pengguna dari repo sumber. Hanya baca `.env.example`.
- Kode repo org yang private **tidak boleh disalin** ke portofolio. Studi kasus hanya memuat deskripsi arsitektur, screenshot yang sudah disamarkan, dan URL live.
- Jangan menampilkan nomor HP atau alamat rumah. Kontak publik: email dan tautan profil.
- Tidak ada secret di repo. Pastikan `.gitignore` mencakup `.env*`, `node_modules`, `.next`, dan `_sources/`.

## 9. Aturan Kerja Agent

- Bahasa komunikasi: Indonesia, istilah teknis standar industri tetap bahasa Inggris.
- Mode Plan: **read-only**, tidak mengubah file. Mode Build: kerjakan per fase, setelah tiap fase jalankan `npm run typecheck && npm run lint && npm run build`, lalu commit lokal (Conventional Commits). **Jangan `git push`** dan jangan membuat repo remote.
- Jangan menjalankan perintah destruktif (`rm -rf` di luar folder build, `git reset --hard`, `git clean`) tanpa izin.
- Laporan akhir tiap fase maksimal 8 baris: apa yang selesai, hasil pemeriksaan, hal yang butuh keputusan pemilik.
- Jika ragu antara dua pendekatan, pilih yang lebih sederhana dan catat trade-off-nya, bukan berhenti bertanya untuk hal kecil.
