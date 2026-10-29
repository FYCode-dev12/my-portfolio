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
- Font: Geist dan Geist Mono (`next/font/google`, di-host sendiri saat build); ikon: `lucide-react`
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

## 6. Design System: "technical editorial", navy dark-first

> Keputusan pemilik (23 Okt 2026): kembali penuh ke rencana awal "technical editorial" setelah arah "type-only statement" dinilai tidak cocok. Ini sengaja menyimpang dari aturan rumah skill `design-taste-frontend` (monospace, garis tipis, kartu, navy). Alasan: preferensi eksplisit pemilik. Font dimuat lewat `next/font/google` (Geist dan Geist Mono), tanpa paket `geist`.

Gunakan skill `tasteskill` untuk keputusan visual, **tetapi** wajib patuh pada token di bawah. Dilarang menambah warna di luar token.

**Pengecualian brand (29 Okt 2026):** logo FY dan maskot Rakit memakai palet brand sendiri lewat token `--brand-glyph` dan `--rakit-*` di `globals.css` (navy `#1b2a4a`, biru `#3f5fa8`, biru malam `#4263af`, biru muda `#8fb0f0`, putih kebiruan `#eaf0fb`, amber `#f2b44a` hanya untuk mata). Token ini **khusus** logo dan maskot, jangan dipakai untuk UI lain. Sumber dan aturannya: repo `MaskotYoel`, `brand/final/guideline.md`.

- Tipografi jelas dengan hierarki kuat; whitespace lega; basis spacing 4px; radius sedang.
- Dark = default; light tersedia lewat toggle (`data-theme`), dengan script inline kecil agar tidak flash.
- Motion halus (fade/translate), hormati `prefers-reduced-motion`. Tanpa animasi yang membebani LCP/CLS.

### 6b. Interaksi & Animasi (dengan anggaran performa)

Pemilik ingin portofolio yang interaktif (name tag gantung ala lanyard yang bisa ditarik dan diayun, efek parallax), **tetapi performa tetap prioritas** (Lighthouse 95+).

- **Prinsip:** konten dan LCP tidak boleh bergantung pada animasi. Hero harus sudah terbaca penuh sebelum JS interaktif dimuat.
- **Parallax:** hanya CSS `transform`/`opacity` (tanpa library), hanya di hero, nonaktif saat `prefers-reduced-motion` dan di perangkat sentuh.
- **Paket interaksi (Fase 8A, opsional, bukan bagian MVP):** diagram arsitektur interaktif di studi kasus, status badge website live, command palette ala terminal, dan transisi ganti tema (View Transitions API dengan fallback). Semuanya tanpa dependency baru kecuali disetujui pemilik.
- **DILARANG:** efek yang mengikuti kursor (cursor spotlight, custom cursor, magnetic button, trail), karena memicu lag/delay pointer. Pemilik secara eksplisit menolaknya. **Satu pengecualian (pemilik, 29 Okt 2026; diperluas 30 Okt 2026):** mata Rakit selalu mengikuti kursor di seluruh layar, juga saat Rakit sedang beraksi. Listener `pointermove` pasif; posisi mata dihitung dari keadaan mesin (tanpa membaca layout per frame) dan rAF berhenti begitu mata diam.
- **Logo header (30 Okt 2026):** glyph FY (`FyGlyph`, 29 px) diikuti nama "Febrian Yoel" (tanpa `~/`), nama hanya tampil mulai `md` (tablet dan desktop). Di `md`-`lg` label tombol "Perintah" disembunyikan (tetap untuk pembaca layar) agar muat. Intro beranda: sepuluh blok FY datang satu per satu dari berbagai arah dengan ekor bayangan (6 salinan yang makin kecil dan tipis), menyusun logo, lalu logo terbang ke header dan nama menyusul. Murni CSS, transform/opacity, bisa dilewati dengan klik/gulir/ketik.
- **Navbar (30 Okt 2026):** bilah kaca (`.nav-shell`, `backdrop-filter`, warna dari token lewat `color-mix`). Begitu digulir lebih dari 24 px (`html[data-scrolled]`, `ScrollState` dengan IntersectionObserver), bilah menyusut menjadi kapsul melayang (lebar maks. 60rem; di ponsel sudut 1,75rem karena dua baris); tinggi header tetap (tanpa CLS). Penanda halaman aktif: pil kaca bercahaya yang meluncur ke tautan aktif (`NavLinks`), bukan garis bawah; sebelum JS, pil digambar langsung di tautan aktif.
- **Partikel latar (30 Okt 2026):** `Particles.tsx`, 26 blok kecil (13 di ponsel) naik pelan di belakang konten. Server Component tanpa JS klien, posisi deterministik, warna `--accent`/`--border-strong`, diam saat `prefers-reduced-motion`.
- **Maskot Rakit (30 Okt 2026, menggantikan sistem kursi 29 Okt):** `src/components/mascot/`. Rakit tidak punya tempat tetap: satu Rakit hidup (`RakitCompanion` + `companion.ts`) berada di lapisan `fixed` dan bisa diseret ke mana saja di layar. **Gravitasi (30 Okt 2026):** Rakit tidak melayang. Ia berdiri di tepi bawah layar (seolah di bingkai laptop) atau di atas elemen halaman. Saat dilepas ia jatuh (membawa laju lemparan) sampai kakinya menapak tepi atas elemen apa pun di bawahnya (`ground.ts`: kotak seperti kartu/tombol/gambar/navbar `[data-rakit-floor]`, dan baris teks lewat Range; dicek dengan hit test agar teks terpotong atau tertutup tidak dipakai). Saat halaman digulir ia ikut terbawa pijakannya, dan jatuh lagi bila pijakan keluar layar, hilang, atau memudar. Jatuh lebih cepat dari 1500 px/s: blok berserakan di lantai (menjauhi tepi layar), lalu merakit ulang dari baris bawah (`berserakan`). Hanya posisi horizontal yang disimpan di localStorage `rakit-pos` (bawaan kanan bawah). Ukuran 100 px (76 px di ponsel). Sambutan: setelah intro, Rakit naik dari tepi bawah, melambai dua tangan (`sambut`), dan menyapa sesuai jam setempat; kunjungan pertama ditambah petunjuk seret (`rakit-seen`). Gelembung percakapan (`.rakit-bubble`, token warna UI) untuk sapaan, celetukan saat diketuk, sapaan per halaman lewat `RakitCue` (antre sampai mesin dimuat), kaget, bangun, dan kembali dari tab lain; celetukan tak diminta dibatasi satu tiap 8 detik. Isi gelembung tidak boleh memuat klaim atau angka yang tidak ada di AGENTS.md. Interaksi: dijatuhkan ke terminal menjalankan perintah `rakit`; ke baris ledger membuka pratinjaunya (`LedgerPick`); ke tab angka memilih tab itu (`data-rakit-drop="click"`); bereaksi lewat `rakitReact` (`react.ts`; reaksi ber-`zone` hanya saat zonanya terlihat), termasuk dari `RakitListen`. Diketuk: aksi lucu acak plus celetukan; diketuk 4x beruntun atau diguncang saat diseret: pusing; disentuh kursor: geli (tidak memutus aksi yang berjalan). Ekspresi senang memakai mata lengkung `^ ^` (versi batang miring terbaca marah). AFK: setelah ±28 detik pengunjung tidak bergerak Rakit tertidur (murni CSS `rakit-sleeping`, rAF berhenti), bangun sendiri setelah 18-34 detik sambil menggeliat, lalu bisa tertidur lagi; disentuh, diketuk, atau didekati kursor saat tidur: kaget. Terminal: `rakit joget|salto|cilukba|lompat|lambai`. Mesin chunk lazy ±9,7 KB gzip, dimuat setelah idle; rAF berhenti saat diam dan saat tab tidak aktif. `prefers-reduced-motion`: tanpa terbang, pegas, lirikan, aksi, dan tidur; tetap bisa digeser dan tetap bicara. Tanpa JS tidak ada Rakit (dekoratif, `aria-hidden`); `loading.tsx` memakai `RakitSvg` statis.
- **Name tag lanyard:** diimplementasikan di **Fase 8B (opsional)**, bukan bagian MVP. Gunakan simulasi fisika 2D ringan (verlet rope) dengan SVG/canvas dan Pointer Events, **tanpa dependency baru**. Dilarang memakai three.js, `@react-three/fiber`, atau physics engine WASM kecuali pemilik menyetujui secara eksplisit.
- **Anggaran:** tambahan JS maksimal sekitar 12 KB gzipped untuk seluruh Fase 8A dan sekitar 8 KB gzipped untuk Fase 8B, masing-masing dimuat lazy (`next/dynamic`, `ssr: false` bila client-only) setelah idle, saat terlihat di viewport, atau saat dipicu pengguna. Tidak boleh menurunkan skor Lighthouse di bawah 95 atau menambah CLS.
- **Wajib:** ruang hero dicadangkan dengan tinggi tetap (tanpa CLS), ada fallback statis (gambar/SVG name tag) untuk SSR, `prefers-reduced-motion`, dan perangkat lemah. Animasi dijeda saat di luar viewport dan saat tab tidak aktif. Komponen `aria-hidden` (dekoratif), tidak menjebak fokus keyboard, dan `touch-action: none` hanya pada name tag agar scroll halaman tidak terganggu.

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
  --radius-sm: 0.375rem;
  --radius-md: 0.75rem;
  --radius-lg: 1.25rem;
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-border: var(--border);
  --color-fg: var(--fg);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-accent-fg: var(--accent-fg);
}

:root {
  --bg: #0a0f1e;
  --surface: #0f1730;
  --border: #1e2a4a;
  --fg: #e6eaf5;
  --muted: #94a3c0;
  --accent: #7aa2ff;
  --accent-fg: #0a0f1e;
}

:root[data-theme="light"] {
  --bg: #f6f8fc;
  --surface: #ffffff;
  --border: #dde3f0;
  --fg: #0b1226;
  --muted: #475569;
  --accent: #1e3a8a;
  --accent-fg: #ffffff;
}
```

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

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
