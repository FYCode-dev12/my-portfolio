# INVENTORY: Proyek untuk Portofolio Febrian Yoel Anggara Saputra

Disusun: 23 Okt 2026 (mode Plan, read-only), diperbarui dengan repo PPLK ITERA 2026.
Label: **[diturunkan]** = dihitung dari repo. **[README]** = klaim dokumen, kode belum diverifikasi. **[URL]** = terlihat di situs publik. `TODO(owner)` = tidak bisa dipastikan dari bukti.

Metode: README, `package.json`, struktur file, git log, ADR, dan 4 URL publik. Sumber: repo lokal di `~/Documents`.
Batas: kode sumber per fungsi belum dibaca. History belum dipindai dengan alat pencari secret.

> Temuan keamanan dan saran pembersihan repo **tidak** ada di dokumen ini. Semuanya ada di `docs/private/SECURITY-REPORT.md` (di-ignore git, jangan dipublikasikan).

## 1. Tabel ringkas

| Proyek (repo) | URL live | Status repo | Peran pemilik | Stack (bukti) | Rekomendasi |
|---|---|---|---|---|---|
| **PI-CORE / PMK-CORE** (`pi-core`) | Staging di `*.workers.dev` (ADR-0003). Live: `TODO(owner)` | org Persekutuan-Mahasiswa-Kristen-ITERA, visibilitas `TODO(owner)` | 154 dari 154 commit atas nama Yoel [diturunkan]. Sebagian dokumen dan commit digerakkan agent (STATE.md: "by Hermes"). Pembagian keputusan `TODO(owner)` | TypeScript monorepo (pnpm + turbo): Next.js web, Hono API di Cloudflare Workers, Expo mobile, Drizzle, better-auth, Supabase Postgres via Hyperdrive | **Studi kasus penuh (unggulan)** |
| **PMK Form** (`pmk-form`) | form.pmkitera.web.id [URL] | org, visibilitas `TODO(owner)` | 128 dari 142 commit atas nama Yoel/FYCode-dev12. 14 commit "Hermes Agent" [diturunkan] | Next.js 16, TypeScript, Supabase (Postgres/Auth/Storage), Tailwind, shadcn/ui, Zod, dnd-kit | **Studi kasus penuh (unggulan)** |
| **PI-LYNK** (`pi-lynk`) | s.pmkitera.web.id [URL] | org, visibilitas `TODO(owner)` | 6 dari 6 commit atas nama Yoel [diturunkan] | Next.js, TypeScript, Neon Postgres, Drizzle, Auth.js (Google OAuth), Cloudflare Turnstile [README] | **Studi kasus penuh** |
| **PMK ARK** (`pmkitera-ark`) | ark.pmkitera.web.id [URL] | org, visibilitas `TODO(owner)` | 10 dari 10 commit atas nama Yoel [diturunkan] | Next.js, TypeScript, Prisma, Supabase Postgres, Cloudflare R2 (AWS SDK S3), bcryptjs + jose | **Studi kasus ringkas** (sorotan + kerangka pendek) |
| **PPLK ITERA 2026** (`PPLK-ITERA/PPLK-ITERA-2026`) | `TODO(owner)` | org PPLK-ITERA, visibilitas `TODO(owner)` | Staf panitia (CV). **5 dari 1.037 commit (sekitar 0,5%)**, 16-27 Jul 2026, semuanya frontend dan desain [diturunkan] | Laravel 11, Inertia.js, React, TypeScript, MySQL, Laravel Reverb, Docker, Coolify, GHCR, GitHub Actions [README, file repo] | **Sorotan singkat.** Hanya kontribusi yang terbukti (bagian 3.5) |
| **Website PMK** (`website-pmk`) | pmkitera.web.id? **tidak terbukti** | org, visibilitas `TODO(owner)` | **3 dari 132 commit** (Yoel/FYCode-dev12), semuanya perbaikan kecil 7 Apr 2026. Penulis utama: Josua Sinaga (97) dan jo0707 (32) [diturunkan] | Next.js 15, Bun, Firebase (Auth/Firestore/Storage), Tailwind, Radix UI | **Lewati** sebagai studi kasus. Jangan diklaim sebagai karya utama |
| **Dashboard Massa PMK** | `TODO(owner)` | `TODO(owner)` | Staff Biro IT 2025 (CV). Repo tidak ditemukan secara lokal | `TODO(owner)` | Tunggu jawaban pemilik. Sementara `draft: true` |
| **Pemira 2025** (frontend lead) | `TODO(owner)` | `TODO(owner)` | Kepala Subdivisi Frontend (CV). Repo tidak ditemukan | `TODO(owner)` | Sorotan singkat di timeline (CV), bukan studi kasus |
| **Informatics Goes To TPB** (backend) | `TODO(owner)` | `TODO(owner)` | Staff Backend (CV). Repo tidak ditemukan | `TODO(owner)` | Sorotan singkat di timeline |
| **Mobile app PMK ITERA** | Belum rilis | Monorepo `pi-core`, `apps/mobile` | Lihat PI-CORE | Expo + React Native (`apps/mobile/package.json`) | Digabung ke studi kasus PI-CORE |

**Repo lokal lain yang tidak masuk daftar kandidat dan belum dianalisis:** `GOXPOSISI` (20 commit), `KALYO` (34), `Kalyo v2` (19), `febrianyoel_portofolio` (2 commit). Repo `agp-web` milik orang lain (`mctosima`, 10 commit Yoel) juga belum dianalisis. Lihat pertanyaan 8.

**Pemetaan URL publik ke repo** (4 URL dibuka 23 Okt 2026):

| URL | Isi yang terbaca | Repo | Keyakinan |
|---|---|---|---|
| `form.pmkitera.web.id` | "Portal Formulir PMK ITERA", form open recruitment dan kategori Recruitment/Event/Survei/Presensi/Umum | `pmk-form` | Tinggi |
| `ark.pmkitera.web.id` | "PMK ARK, Archive & Resource Knowledge", arsip PPT Ibadah dan Warta | `pmk-ark` | Tinggi |
| `s.pmkitera.web.id` | "PI-LYNK, Pemendek Tautan & Pembuat QR Code" | `pi-lynk` | Tinggi |
| `pmkitera.web.id` | Hanya judul "Persekutuan Mahasiswa Kristen ITERA" yang terbaca (kemungkinan dirender di klien) | Kandidat `website-pmk`, **tidak terbukti** | Rendah |

## 2. Metrik yang bisa ditampilkan (semua [diturunkan], dihitung dari file yang di-track git)

| Proyek | Commit total (oleh pemilik) | Rentang commit | Halaman (`page.tsx`) | Route handler (`route.ts`) | Migrasi SQL | File test | Lain |
|---|---|---|---|---|---|---|---|
| PMK-CORE | 154 (154) | 15-21 Okt 2026 | 9 (apps/web) | 0 (API pakai Hono) | 12 | 32 | 3 apps + 3 packages, 19 ADR (0001-0019), 1 workflow CI |
| pmk-form | 142 (128) | 4 Mar-23 Okt 2026 | 12 | 2 | 18 | 7 | 1 workflow CI, ada `.lighthouseci` dan `SECURITY_AUDIT.md` |
| pi-lynk | 6 (6) | 7-12 Okt 2026 | 6 | 8 | belum dihitung (folder `drizzle/`) | 2 | 3 tabel Drizzle |
| pmk-ark | 10 (10) | 3-11 Sep 2026 | 8 | 12 | 0 di-track | 0 | 5 model Prisma |
| PPLK-ITERA-2026 | 1.037 (5) | 15 Jun-11 Sep 2026 | 3 (halaman React di `resources/js/Pages` tidak dihitung) | 0 (Laravel) | 0 pola `migrat*` di-track | 0 | 2 workflow CI, Dockerfile, docker-compose, nginx |
| website-pmk | 132 (3) | 26 Feb 2025-7 Apr 2026 | 21 | 11 | 0 | 0 | 2 workflow Vercel |

Catatan metrik:
- PMK-CORE: 154 commit dalam 7 hari menandakan kerja yang sangat dibantu agent. Jangan dipakai sebagai angka produktivitas tanpa konteks.
- "8 epic / 47 stories selesai" berasal dari `docs/STATE.md` repo itu sendiri [README]. Itu klaim dokumen, bukan hasil verifikasi.
- PPLK: jangan tampilkan jumlah commit. Angka 5 dari 1.037 hanya jujur bila disertai deskripsi kontribusi yang spesifik.
- Metrik dampak (pengguna, form dibuat, respons terkumpul, arsip, shortlink, peserta PPLK): **semuanya `TODO(owner)`**. Tidak ada bukti di repo.

## 3. Kerangka studi kasus

### 3.1 PI-CORE (unggulan, status: in-progress)

**Latar Belakang & Masalah Teknis**
- PMK ITERA punya struktur organisasi bertingkat: 8 unit puncak (7 departemen + 1 biro) dan 16 divisi, dengan jabatan yang berganti tiap periode (`docs/ARCHITECTURE.md` §2).
- Identitas anggota, penugasan, dan hak akses perlu satu sumber kebenaran yang dipakai aplikasi PMK lain.
- Masalah teknisnya adalah menyatukan model Position, Role, dan Assignment per periode dengan permission berlingkup (organisasi, unit, diri sendiri).
- Pengguna sasaran: pengurus PMK (admin web) dan anggota (mobile). Jumlah pengguna aktual: `TODO(owner)`.

**Solusi & Arsitektur**
- Monorepo `apps/web`, `apps/api`, `apps/mobile` dan `packages/{config,db,shared}`.
- API tipis di Cloudflare Workers dengan Hono. Auth memakai better-auth dan provider OIDC untuk aplikasi PMK lain (ADR-0007, ADR-0017, ADR-0018).
- Data di Supabase Postgres, diakses lewat Hyperdrive dengan koneksi langsung. Data API Supabase dimatikan dan RLS aktif di semua tabel (ADR-0009).
- ADR-0013 "static-first + thin API Worker": batas CPU Workers Free adalah 10 ms per request, sedangkan hasil ukur staging 14-40 ms (warm) dan 120-303 ms (cold start). Angka ini dari ADR, bukan diukur ulang. Keputusan arsitektur diambil dari pengukuran. Ini bahan cerita yang kuat.
- Realtime memakai Durable Object `RealtimeHub` dengan WebSocket Hibernation dan fallback SSE (ADR-0011, [README]).
- Lainnya: 19 ADR, `docs/SECURITY.md`, `docs/OPERATIONS.md`, CI di `.github/workflows/ci.yml`.

**Teknologi & Alasannya**
- Hono + Workers: ADR-0013 dan ADR-0014 (hanya free tier).
- better-auth: ADR-0007. Drizzle + Hyperdrive: ADR-0009.
- Expo: satu basis TypeScript untuk mobile. ADR-0004 membatasi iOS ke dev-only karena tanpa akun Apple berbayar.
- Alasan lain per teknologi: `TODO(owner)`.

**Hasil & Key Takeaways**
- Hasil terverifikasi dari repo: 12 migrasi, 32 file test, 19 ADR, CI aktif [diturunkan].
- Dampak (pengguna, adopsi): `TODO(owner)`.
- Takeaway kandidat: keputusan berbasis pengukuran dan ADR, serta batasan sumber daya gratis sebagai constraint desain. Perlu konfirmasi pemilik soal keputusan mana yang benar-benar diambil sendiri (pertanyaan 3).

### 3.2 PMK Form (unggulan, status: live)

**Latar Belakang & Masalah Teknis**
- Kepanitiaan dan departemen PMK butuh platform formulir bersama untuk open recruitment, event, survei, presensi, dan umum. Versi awalnya `pmk-oprec` (nama paket di `package.json`) yang kemudian digeneralisasi (README).
- Masalah teknisnya: form dinamis dengan validasi Zod dinamis, upload lampiran, dan kompatibilitas data oprec lama (`submissions`, `selection_results`).

**Solusi & Arsitektur**
- Next.js App Router dengan Supabase (Postgres, Auth, Storage) [README].
- Form builder drag-and-drop (`@dnd-kit`) dan renderer publik generik di `/form/[slug]`.
- Respons dapat diekspor ke CSV (PapaParse) dan lampiran ke ZIP (JSZip).
- Fitur admin: soft delete form (`/admin/forms/trash`), manajemen admin, dan audit log (`/admin/users`, `/admin/audit`).
- Operasional: `TRUSTED_PROXY` untuk rate limit IP (`DEPLOYMENT.md`), 18 migrasi SQL, `SECURITY_AUDIT.md`, Lighthouse CI, workflow CI.
- Deploy ke Vercel (`DEPLOYMENT.md` §3). VPS/Docker disebut "non-utama" dan tidak diuji rutin.

**Teknologi & Alasannya**
- Supabase menggantikan backend sendiri. Alasan lengkap `TODO(owner)`.
- shadcn/ui + Tailwind untuk konsistensi UI. Zod + react-hook-form untuk validasi.

**Hasil & Key Takeaways**
- 142 commit selama sekitar 7 bulan, 12 halaman, 18 migrasi, 7 file test [diturunkan].
- Dipakai nyata: form open recruitment Bakal Calon Ketua Umum 2027/2028 tampil di situsnya [URL].
- Jumlah form, respons, dan pengguna: `TODO(owner)`.
- Takeaway kandidat: migrasi data tanpa memutus data lama, dan audit keamanan. Detail `TODO(owner)`.
- **Hati-hati:** jangan mengutip isi `SECURITY_AUDIT.md` yang menyebut ID spreadsheet atau detail kerentanan yang belum ditutup. Hanya ceritakan prosesnya.

### 3.3 PI-LYNK (status: live)

**Latar Belakang & Masalah Teknis**
- PMK butuh pemendek tautan dan generator QR resmi untuk poster, formulir pendaftaran, dan media sosial.
- Layanan publik tanpa login rawan disalahgunakan: SSRF, phishing, spam, dan penyalahgunaan nama "pmk/resmi".

**Solusi & Arsitektur** (semua [README], kode belum diverifikasi)
- Redirect 307 dengan lookup berindeks satu query ke Neon Postgres, dan analitik klik yang tidak memblokir.
- Anti-abuse sisi server: blokir skema berbahaya, IP literal, jaringan privat, IDN/punycode, dan rantai redirect pemendek lain. Ada kata kunci slug terlindungi, Cloudflare Turnstile, dan rate limit berbasis hash IP bersalt di database.
- Dashboard admin dengan Auth.js (Google OAuth) dan allowlist email.
- Filter bot preview (WhatsApp/Telegram, dst.) agar analitik tidak menggelembung.

**Teknologi & Alasannya**
- Neon serverless driver + Drizzle (cocok untuk serverless).
- Rate limit di database karena serverless tidak punya memori bersama. Alasan ini tertulis di README.

**Hasil & Key Takeaways**
- 6 commit dalam 6 hari, 6 halaman, 8 route handler, 3 tabel, 2 file test [diturunkan]. Ada skrip impor tautan lama (`import:links`).
- Pemakaian (jumlah tautan, klik): `TODO(owner)`.
- Takeaway kandidat: threat modeling untuk layanan publik dan keputusan security-by-default. Verifikasi ke kode sebelum ditulis sebagai fakta.

### 3.4 PMK ARK (ringkas, status: live)

- **Latar belakang:** bahan ibadah mingguan (PPT Ibadah Jumat, Warta, PPT Khotbah) tercecer. ARK mengelompokkannya per tanggal ibadah [README, URL].
- **Arsitektur:** Next.js + Prisma (5 model) di Supabase Postgres. File disimpan di Cloudflare R2 lewat abstraksi `StorageService` di `src/lib/storage/` agar bisa pindah R2/S3/Supabase Storage (`DEPLOYMENT.md`). Ada QR sharing dan akses berbasis peran.
- **Perlu verifikasi:** README menulis auth "Supabase Auth / Custom Session Cookie", padahal dependensi menunjukkan `bcryptjs` + `jose` + `@supabase/ssr`. Mekanisme aktualnya `TODO(owner)`.
- **Hasil:** 10 commit dalam 8 hari, 8 halaman, 12 route handler [diturunkan]. Pemakaian: `TODO(owner)`.

### 3.5 PPLK ITERA 2026 (sorotan singkat, bukan studi kasus)

**Konteks.** Sistem manajemen orientasi mahasiswa baru (PPLK/PKKMB) ITERA. Arsitektur modular monolith Laravel 11 + Inertia + React/TypeScript + MySQL, dengan modul seperti Presensi, Tugas, Xp, CS (live chat via Reverb), Komdis, dan Swarnakata [README]. Deploy lewat Docker image yang dibangun di GitHub Actions, disimpan di GHCR, lalu ditarik oleh server Coolify (`.github/workflows/docker-coolify.yml`).

**Kontribusi pemilik yang terbukti (git log, 5 commit, 16-27 Jul 2026)**
- Redesain halaman rincian UPA: pagination, logo UPA, halaman deskripsi/kegiatan/kepala UPA, perbaikan ikon sosmed.
- Redesain halaman Divisi pelaksana: aset dari Figma, font Kayambang.
- Halaman landing maskot: layout responsif dan logika pemilihan maskot.

**Jangan diklaim** (milik tim, penulis utama orang lain): arsitektur modular monolith, Reverb/live chat, sistem XP, pipeline Docker/Coolify. Peran pemilik di deployment `TODO(owner)`.

**Dampak ke portofolio**
- Entri timeline: "Staf Panitia PPLK ITERA 2026" (divisi `TODO(owner)`).
- Satu paragraf pendek di `/about` atau satu kartu "sorotan", tanpa jumlah commit sebagai ukuran kemampuan.
- Bukti Docker/Coolify/GHCR ada di repo ini, tetapi **bukan bukti kemampuan pemilik** sebelum pertanyaan 5 dijawab.

## 4. Pertanyaan untuk pemilik (urut prioritas)

1. **`pmkitera.web.id` dijalankan oleh repo mana, dan apa peran Anda?** Kandidat `website-pmk` hanya memuat 3 commit Anda. Kalau itu situsnya, ia tidak boleh diklaim sebagai karya Anda. Apakah situs utama akan diganti PI-CORE web?
2. **Visibilitas dan izin:** Mana repo yang public dan mana yang private-org (termasuk PPLK)? Apakah organisasi mengizinkan nama org, URL live, dan deskripsi arsitektur ditampilkan? Boleh memakai screenshot (disamarkan), atau cukup diagram arsitektur?
3. **Penggunaan AI agent:** `pmk-form` punya 14 commit "Hermes Agent", dan STATE.md PI-CORE mencatat pekerjaan "by Hermes". Bagian mana yang Anda tulis atau putuskan sendiri, dan bagaimana ingin dinyatakan di portofolio? Saya sarankan pernyataan jujur tentang alur kerja yang dibantu AI.
4. **Status PI-CORE:** Sudah live? URL dan domain produksi? Sudah dipakai siapa saja? Atau tetap ditampilkan sebagai `in-progress` (staging)?
5. **PPLK 2026:** Di divisi apa Anda? Apakah Anda ikut menyentuh Docker, Coolify, atau deployment? Apa URL live-nya, dan berapa peserta/pengguna (hanya angka yang bisa dibuktikan)?
6. **Metrik dampak** (hanya yang bisa Anda buktikan): jumlah form dan respons di PMK Form, jumlah arsip di ARK, jumlah shortlink dan klik di PI-LYNK, jumlah pengguna PI-CORE.
7. **Dashboard Massa, Pemira 2025, Informatics Goes To TPB:** repo-nya di mana? Atau cukup tampil di timeline dari CV?
8. **Bukti Docker, Linux, VPS** untuk stack magang: di repo yang Anda tulis tidak ada Dockerfile. Apakah `GOXPOSISI`, `KALYO`, atau `Kalyo v2` memakainya? Kalau tidak ada, jangan diklaim.
9. **Kontak publik:** email, URL GitHub (akun `FYCode-dev12` atau lainnya), URL LinkedIn, file `cv.pdf`, dan foto (opsional).
10. **Bidang LKS** (Kabupaten 2023 dan Provinsi Lampung 2023).
