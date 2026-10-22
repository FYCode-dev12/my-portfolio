# PLAN: Portofolio Febrian Yoel Anggara Saputra

Disusun 23 Okt 2026. Target live: **Selasa 27 Okt** (cadangan: Rabu 28 Okt). Batas pendaftaran: **31 Okt 2026**.
Sumber aturan: `AGENTS.md`. Dokumen ini tidak mengubahnya.

## 1. Struktur folder final

```
my-portfolio/
├── AGENTS.md                      # konteks permanen (disalin dari ~/Documents/files (2))
├── README.md                      # cara jalan, struktur, cara menambah proyek
├── opencode.json
├── package.json                   # script: dev, build, start, lint, typecheck, validate:content
├── tsconfig.json                  # strict: true, alias @/*
├── next.config.ts
├── eslint.config.mjs
├── .prettierrc
├── .gitignore                     # .env*, node_modules, .next, _sources/, docs/private/
├── .env.example                   # kosong bila tidak ada env
├── content/
│   └── projects/
│       ├── pi-core.mdx
│       ├── pmk-form.mdx
│       ├── pi-lynk.mdx
│       └── pmk-ark.mdx
├── docs/                          # INVENTORY, PLAN, PROGRESS, QA, TODO-OWNER, DEPLOY
│   └── private/                   # di-ignore git: SECURITY-REPORT.md, bahan sensitif
├── scripts/
│   └── validate-content.ts        # validasi zod semua MDX + aturan tambahan; dipanggil sebelum build
├── public/
│   ├── cv.pdf                     # placeholder TODO(owner) sampai CV diberikan
│   └── (og assets bila perlu)
├── mdx-components.tsx             # mapping heading, tautan, kode, gambar, callout
└── src/
    ├── app/
    │   ├── layout.tsx             # font Geist, script tema anti-flash, SkipLink, Header, Footer, metadata dasar
    │   ├── globals.css            # token @theme + dark/light (persis AGENTS.md bagian 6)
    │   ├── page.tsx               # Home
    │   ├── projects/
    │   │   ├── page.tsx           # daftar + filter via searchParams
    │   │   └── [slug]/page.tsx    # studi kasus: generateStaticParams, generateMetadata
    │   ├── about/page.tsx         # cerita, skills, timeline, JSON-LD Person
    │   ├── contact/page.tsx       # tanpa form
    │   ├── not-found.tsx
    │   ├── error.tsx
    │   ├── loading.tsx            # seperlunya
    │   ├── opengraph-image.tsx
    │   ├── sitemap.ts
    │   └── robots.ts
    ├── components/
    │   ├── ui/                    # Button, Badge, Card, Section, Container, Heading, ExternalLink
    │   ├── layout/                # Header, Footer, ThemeToggle, SkipLink
    │   └── sections/
    │       ├── home/              # Hero, HeroVisual, FeaturedProjects, SkillsSummary, Highlights, ContactCta
    │       ├── projects/          # ProjectCard, ProjectFilter, ProjectSidebar, ProjectNav
    │       └── about/             # SkillGroups, Timeline
    ├── lib/
    │   ├── content.ts             # baca + validasi MDX, urut featured lalu order, kecualikan draft di produksi
    │   ├── schema.ts              # skema zod frontmatter (AGENTS.md bagian 4)
    │   ├── seo.ts                 # helper metadata, JSON-LD Person
    │   └── cn.ts                  # helper class
    └── content/
        ├── site.ts                # nama, tagline, tautan
        ├── skills.ts              # hanya dari bukti repo + CV
        └── achievements.ts        # kepemimpinan, mengajar, prestasi, pendidikan, media (termasuk Staf Panitia PPLK 2026)
```

Dependency tetap: `next`, `react`, `react-dom`, `tailwindcss`, `gray-matter`, `next-mdx-remote`, `zod`, `geist`, `lucide-react`, ditambah Prettier dan `tsx` (dev) untuk skrip validasi. `tsx` perlu persetujuan pemilik, atau gunakan `node --experimental-strip-types`.

## 2. Fase Build dan kriteria selesai

Selaras dengan `02-BUILD-prompt.md`, yang memakai **Fase 0-7** (dan 8A/8B opsional). Prompt Plan menyebut "01-07", tetapi file Build tidak punya Fase 01, jadi saya memakai penomoran 0-7. Perubahan dari file Build ada di kolom terakhir.

| Fase | Isi | Kriteria selesai (terukur) | Penyesuaian dan alasan |
|---|---|---|---|
| 0 | Persiapan | `AGENTS.md` ada di root. `.gitignore` memuat `.env*`, `node_modules`, `.next`, `_sources/`, `docs/private/`. `docs/INVENTORY.md` dan `docs/PLAN.md` tersimpan. Branch `feat/portfolio-mvp` aktif. `git status` bersih setelah commit `docs: add plan and inventory` | **Ditambah:** salin `AGENTS.md`, dan buat commit awal di `main` terlebih dulu, karena repo belum punya commit dan branch baru tidak bisa dibuat tanpa itu. `docs/private/` harus tidak muncul di `git status`. Putuskan nasib entri Supabase di `opencode.json` |
| 1 | Scaffold dan tooling | `npm run dev` dan `npm run build` sukses. `typecheck`, `lint`, `validate:content` ada dan jalan. README ada | Cek dokumentasi versi Next yang terpasang lewat Context7 (API dinamis seperti `params` bisa berupa Promise). Catat versi Next, Tailwind, dan zod yang terpasang di `docs/PROGRESS.md` |
| 2 | Design system | Halaman sementara menampilkan semua komponen di dark dan light. Kontras teks lolos AA 4.5:1 (diukur). CLS = 0 saat ganti tema. Hanya warna token | Tidak ada. **CP1** setelah fase ini |
| 3 | Content layer | Frontmatter invalid menggagalkan build dengan pesan berisi nama file dan field. Konten valid bertipe benar. `validate:content` jalan sebelum `build` | **Ditambah** aturan di `validate-content.ts`: maksimal 3 proyek `featured: true` dan `draft: false` tidak boleh mengandung teks `TODO(owner)`. Hanya 4 MDX yang dibuat (lihat bagian 6), dan bagian tanpa bukti ditandai `TODO(owner)` dengan `draft: true`. PPLK masuk lewat `achievements.ts`, bukan MDX. Tanpa screenshot sebelum pemilik menjawab pertanyaan 2 (pakai diagram) |
| 4 | Halaman | Semua route render tanpa error di 360px dan desktop. Navigasi keyboard lengkap. Tidak ada konten palsu. Filter `/projects?tech=...` bekerja tanpa JS. Hero tinggi tetap | **CP2** setelah fase ini. `cv.pdf` placeholder wajib bertanda `TODO(owner)` |
| 5 | SEO, a11y, performa | Skor Lighthouse 4 kategori ≥ 95 di build produksi lokal, tercatat di `docs/QA.md` | Jika Chrome/Lighthouse tidak tersedia di mesin ini, catat itu di QA.md dan gunakan PageSpeed Insights setelah deploy preview sebagai pengganti. Jangan klaim skor yang tidak diukur |
| 6 | Konten dan kebersihan | `docs/TODO-OWNER.md` terisi per proyek, urut dampak. Pemindaian `grep` pola secret, nomor telepon, dan alamat: 0 temuan | **Ditambah:** pindai juga nama file `client_secret*`, `password*`, dan pola `eyJ`, `sk_`, `AKIA`. Verifikasi bahwa `_sources/` dan `docs/private/` tidak ikut ter-track (`git ls-files docs/private` kosong). Pastikan `docs/INVENTORY.md` dan `docs/PLAN.md` tidak memuat detail kerentanan, nama file kredensial, atau ID sumber daya internal |
| 7 | Persiapan deploy | `npm run build` sukses dari kondisi bersih (`rm -rf .next` hanya folder build). `docs/DEPLOY.md` lengkap | Pemilik yang `git push` dan deploy. **CP3** setelah fase ini |
| 8A / 8B | Opsional | Hanya atas perintah "kerjakan Fase 8A/8B" setelah CP3 | Tidak dikerjakan sebelum 31 Okt kecuali ada waktu sisa dan pendaftaran sudah terkirim |

## 3. Komponen reusable

| Komponen | Props utama |
|---|---|
| `Button` | `variant: "primary" \| "secondary" \| "ghost"`, `size`, `href?`, `className`, `...button/anchor props` |
| `Badge` | `tone?: "neutral" \| "accent"`, `children`, `className` |
| `Card` | `as?`, `children`, `className`, `interactive?` |
| `Section` | `id?`, `title?`, `description?`, `children`, `className` |
| `Container` | `size?: "narrow" \| "default"`, `className` |
| `Heading` | `level: 1-6`, `as?` (tampilan terpisah dari semantik), `className` |
| `ExternalLink` | `href`, `children`, `showIcon?`; otomatis `rel="noopener noreferrer"`, `target="_blank"` |
| `Header` / `Footer` | tanpa props; tautan dari `site.ts` |
| `ThemeToggle` | tanpa props; `aria-label`, `aria-pressed`; menyimpan pilihan ke `localStorage` |
| `SkipLink` | `targetId` |
| `Hero` / `HeroVisual` | `name`, `tagline`, `ctas`; `HeroVisual` tinggi tetap, isi name tag SVG statis |
| `FeaturedProjects` | `projects: Project[]` (maks 3) |
| `ProjectCard` | `project: Project`, `priority?` |
| `ProjectFilter` | `stacks: string[]`, `active?: string` (tautan GET, bukan state) |
| `ProjectSidebar` | `project: Project` (peran, periode, stack, tautan, metrik, status) |
| `ProjectNav` | `prev?: Project`, `next?: Project` |
| `Timeline` | `items: Achievement[]`, `groupBy: category` |
| `SkillGroups` | `groups: SkillGroup[]` (Frontend, Backend, DevOps & Tools, Desain & Media) |
| `MdxCallout` | `type: "note" \| "todo" \| "warning"`, `children` |

Semua komponen: tipe ketat, menerima `className`, fokus terlihat, Server Component kecuali `ThemeToggle`.

## 4. SEO, aksesibilitas, performa

**SEO**
- `metadata` per halaman dengan `title.template`, `description`, `alternates.canonical`.
- Open Graph dan Twitter, `opengraph-image.tsx` dinamis, `sitemap.ts` (tanpa proyek `draft`), `robots.ts`.
- JSON-LD `Person` di `/about`: hanya nama, `jobTitle`, `url`, `sameAs`, `alumniOf`. Tanpa telepon dan alamat.
- Studi kasus memakai `generateMetadata` dengan `summary` sebagai description.

**Aksesibilitas (WCAG AA)**
- Satu `h1` per halaman dan urutan heading berurutan. Landmark `header`, `nav`, `main`, `footer`.
- Skip link, fokus terlihat, navigasi menu mobile bisa dipakai keyboard.
- `alt` bermakna untuk gambar informatif, `alt=""` untuk dekoratif.
- Kontras token diukur di kedua tema. Jika `--muted` atau `--accent` gagal di salah satu tema, **laporkan ke pemilik**, jangan mengubah token diam-diam.
- `prefers-reduced-motion` mematikan transisi dan parallax. Status tidak hanya dibedakan lewat warna.

**Performa (target Lighthouse ≥ 95 di semua kategori)**

| Metrik | Target |
|---|---|
| LCP | < 2,5 s |
| CLS | 0 (batas maksimum 0,1) |
| TBT | < 200 ms |
| JS klien per route | seminimal mungkin; hanya `ThemeToggle` dan filter bila perlu |

- Server Components secara default, `next/image` dengan ukuran eksplisit, `next/font` self-hosted, tidak ada library animasi.
- Hero memakai SVG statis dan tinggi tetap. Parallax hanya CSS `transform`/`opacity`, nonaktif di perangkat sentuh dan reduced-motion.
- Dilarang efek mengikuti kursor (`AGENTS.md` bagian 6b).

## 5. Risiko dan mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Waktu sempit (5 hari sampai 28 Okt) | Situs belum live saat deadline | Kerjakan MVP saja (Fase 0-7), Fase 8 ditunda. Cadangan 3 hari (28-30 Okt) |
| Data dampak belum ada | Studi kasus terasa tipis | Tampilkan metrik [diturunkan] dari repo. Sisanya `TODO(owner)` dan `draft: true`. Jangan mengarang angka |
| Pemilik terlambat menjawab pertanyaan | Konten `draft` menumpuk | Batasi jawaban wajib ke pertanyaan 1-5 dan 9. Situs tetap bisa live dengan 2-3 studi kasus berstatus lengkap |
| Privasi repo org | Pelanggaran izin atau kebocoran | Hanya deskripsi arsitektur dan URL live. Tanpa kode, tanpa screenshot sebelum persetujuan. Minta izin org (pertanyaan 2) |
| Secret di history repo sumber | Kebocoran kredensial | Detail dan langkah rotasi ada di `docs/private/SECURITY-REPORT.md`. Portofolio tidak menyalin file dari repo sumber |
| Dokumen perencanaan ikut ter-push | Detail kerentanan organisasi terbuka | `docs/private/` di-ignore. `INVENTORY.md` dan `PLAN.md` tidak memuat detail kerentanan. Diperiksa di Fase 6 |
| Klaim berlebihan soal peran dan AI agent | Merusak kredibilitas saat wawancara | Pertanyaan 3 dan 5. Tampilkan pembagian peran yang benar. PPLK hanya klaim kontribusi frontend yang terbukti. Jangan memakai jumlah commit sebagai bukti kemampuan |
| Stack magang (Docker, Linux, VPS) belum terbukti sebagai pekerjaan pemilik | Kesenjangan terhadap lowongan | Bukti Docker/Coolify ada di repo PPLK, tetapi pemilik hanya terbukti mengerjakan frontend di sana. Jangan diklaim sebelum pertanyaan 5 dan 8 dijawab. Rencana Docker/VPS ditulis sebagai rencana di `DEPLOY.md` |
| Lighthouse tidak bisa dijalankan lokal | Skor tidak terukur | Fallback PageSpeed Insights pada preview deploy, dicatat di QA.md |
| API Next.js yang berubah | Build rusak | Cek dokumentasi versi terpasang lewat Context7 sebelum memakai `params`, `searchParams`, `generateMetadata` |

## 6. Urutan pengerjaan dan estimasi

| Hari | Pekerjaan | Keluaran |
|---|---|---|
| **Jum 23 Okt** (malam) | Fase 0-1. Pemilik menjawab pertanyaan 1-5 dan 9 | Scaffold berjalan |
| **Sab 24 Okt** | Fase 2 | **CP1**: pemilik cek tampilan dan tema |
| **Min 25 Okt** | Fase 3-4 | **CP2**: pemilik cek semua halaman dan mengisi `TODO(owner)` |
| **Sen 26 Okt** | Fase 5-6. Pemilik menyerahkan `cv.pdf`, kontak final, dan jawaban metrik | `QA.md`, `TODO-OWNER.md` |
| **Sel 27 Okt** | Fase 7, **CP3**, pemilik push dan deploy ke Vercel | **Situs live** |
| **Rab 28 Okt** | Cadangan 1: perbaikan pasca-deploy, cek Lighthouse produksi | Target resmi live |
| **Kam 29-Jum 30 Okt** | Cadangan 2-3: isi konten yang tersisa, periksa tautan | Situs final |
| **Sab 31 Okt** | Kirim pendaftaran | Batas akhir |

Jalur kritis: jawaban pemilik atas pertanyaan 1-5 dan CV. Tanpa itu, situs tetap bisa live memakai konten berbasis bukti saja.

## 7. Rekomendasi unggulan di Home

Jadikan **PMK Form** dan **PI-CORE** unggulan, dan **PI-LYNK** yang ketiga.
- **PMK Form:** live, bisa diverifikasi lewat URL, riwayat terpanjang (142 commit, sekitar 7 bulan), dipakai kegiatan nyata, dan stack-nya paling dekat dengan lowongan (Next.js, React, TypeScript, Git, CI, deploy produksi).
- **PI-CORE:** bukti kedalaman arsitektur (monorepo TypeScript, 19 ADR, API di edge, OIDC, 32 file test, keputusan berbasis pengukuran). Tampilkan sebagai `in-progress` tanpa klaim pengguna.
- **PI-LYNK:** singkat tetapi menunjukkan pola pikir keamanan. Klaimnya baru dari README, jadi verifikasi ke kode sebelum menulisnya sebagai fakta.
- **PPLK 2026:** sorotan di timeline dan `/about`, tanpa kartu unggulan.
- **Docker, Linux, VPS:** jangan diklaim tanpa bukti peran pemilik.
