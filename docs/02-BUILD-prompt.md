# Prompt untuk Mode BUILD

Jalankan **setelah** mode Plan selesai (sesi yang sama, agar konteks hasil Plan terbawa). Beralih ke **mode Build**, lalu tempel prompt di bawah garis ini.

---

## PROMPT (tempel mulai dari sini)

Kamu bertindak sebagai Senior Full-Stack Engineer dan UI/UX Engineer. Baca `AGENTS.md` sampai habis dan patuhi seluruhnya. Kita sekarang di **mode Build**: eksekusi rencana dari mode Plan secara bertahap.

### Aturan eksekusi
- **Mode autopilot bertahap.** Kerjakan fase berurutan **tanpa menunggu saya**. Setelah tiap fase: jalankan `npm run typecheck && npm run lint && npm run build`, perbaiki semua error, commit lokal dengan Conventional Commits (`feat:`, `chore:`, `fix:`, `docs:`), perbarui `docs/PROGRESS.md` (fase selesai, hash commit, keputusan terbuka), lalu langsung lanjut ke fase berikutnya. **Jangan `git push`.**
- **Berhenti dan tunggu saya hanya jika:** (a) mencapai **checkpoint**: CP1 setelah Fase 2 (saya cek tampilan visual dan tema), CP2 setelah Fase 4 (saya cek semua halaman dan isi konten), CP3 setelah Fase 7 (siap deploy); (b) pemeriksaan masih gagal setelah 3 kali upaya perbaikan; (c) butuh keputusan atau data yang hanya dimiliki pemilik; (d) akan melakukan tindakan destruktif atau di luar lingkup `AGENTS.md`.
- Tulis kode lengkap dan production-ready. Dilarang komentar seperti "tambahkan sisa kode di sini" dan dilarang menghapus fitur untuk meloloskan build.
- Jangan mengarang konten. Data yang belum ada diberi `TODO(owner): ...` dan `draft: true` (dikecualikan dari produksi).
- Laporan singkat (maksimal 5 baris) di akhir tiap fase: selesai apa dan hasil pemeriksaan. Laporan ini hanya informasi, **bukan tanda untuk berhenti**. Pada checkpoint, beri laporan maksimal 10 baris yang menyebut apa yang perlu saya periksa, lalu **berhenti dan tunggu** saya mengetik "lanjut".
- Jika ada keputusan teknis yang berdampak besar dan tidak tercantum di `AGENTS.md`, tanyakan sebelum mengerjakan.

### Fase 0 - Persiapan
1. Simpan hasil Plan di sesi ini ke `docs/INVENTORY.md` dan `docs/PLAN.md` (jika belum ada, minta saya menempelkannya).
2. Periksa `git status`, buat branch `feat/portfolio-mvp`, pastikan `_sources/` dan `.env*` ada di `.gitignore`.
3. **Kriteria selesai:** dokumen tersimpan, branch aktif, working tree bersih setelah commit `docs: add plan and inventory`.

### Fase 1 - Scaffold & tooling
1. Inisialisasi Next.js (App Router, TypeScript, Tailwind, ESLint, `src/` directory, alias `@/*`) di folder saat ini. Jika `create-next-app` menolak karena folder tidak kosong, scaffold di folder sementara lalu pindahkan tanpa menimpa `.git`, `opencode.json`, `AGENTS.md`, dan `docs/`.
2. Aktifkan `strict` TypeScript. Tambahkan Prettier, serta script `typecheck` dan `validate:content`.
3. Pasang dependency: `gray-matter`, `next-mdx-remote`, `zod`, `geist`, `lucide-react`. Tidak ada yang lain tanpa izin.
4. Tulis `README.md` singkat (cara menjalankan, struktur, cara menambah proyek).
5. **Kriteria selesai:** `npm run dev` dan `npm run build` sukses pada halaman default yang sudah dibersihkan.

### Fase 2 - Design system
1. Terapkan token dari `AGENTS.md` bagian 6 di `src/app/globals.css`. Dark default, light via `data-theme`, script inline anti-flash untuk tema.
2. Font Geist via `next/font` dengan fallback yang jelas.
3. Komponen `src/components/ui`: `Button`, `Badge`, `Card`, `Section`, `Container`, `Heading`, `ExternalLink`. Semua bertipe ketat, mendukung `className`, dan punya state fokus yang terlihat.
4. `src/components/layout`: `Header` (navigasi responsif yang bisa dipakai keyboard, aman di mobile), `Footer`, `ThemeToggle` (dengan `aria-label` dan `aria-pressed`), `SkipLink`.
5. Gunakan `tasteskill` untuk keputusan visual, tetapi tanpa warna di luar token.
6. **Kriteria selesai:** halaman sementara menampilkan semua komponen di kedua tema, kontras lolos AA, tidak ada layout shift saat berganti tema.

### Fase 3 - Content layer
1. `src/lib/content.ts`: baca `content/projects/*.mdx` dengan `gray-matter`, validasi frontmatter dengan `zod` (skema di `AGENTS.md` bagian 4), urutkan berdasarkan `featured` lalu `order`, kecualikan `draft` di produksi, dan lempar error yang jelas (nama file + field) jika tidak valid.
2. `src/content/site.ts`, `skills.ts`, `achievements.ts` dengan tipe ketat, diisi dari **bagian 5 `AGENTS.md`** dan `docs/INVENTORY.md`.
3. `scripts/validate-content.ts` untuk `npm run validate:content`, dipanggil juga sebelum `build`.
4. Komponen MDX: `mdx-components.tsx` dengan heading, tautan, kode, gambar (`next/image`), dan callout.
5. Buat file MDX tiap proyek terpilih berdasarkan `docs/INVENTORY.md` (kerangka 4 bagian). Bagian tanpa data bukti = `TODO(owner)` dan `draft: true`.
6. **Kriteria selesai:** konten invalid menggagalkan build dengan pesan yang jelas; konten valid terbaca dengan tipe yang benar.

### Fase 4 - Halaman
1. `/`: Hero (nama, tagline sesuai positioning, CTA lihat proyek + unduh CV), proyek unggulan (maks 3), ringkasan skill, 3-4 sorotan capaian, CTA kontak. Hero memiliki slot `HeroVisual` dengan **tinggi tetap** (tanpa CLS) berisi name tag statis (SVG) sebagai placeholder; slot ini dipakai Fase 8 nanti. Tambahkan parallax ringan hanya di hero sesuai `AGENTS.md` bagian 6b (CSS transform, tanpa library, nonaktif saat reduced-motion dan di layar sentuh).
2. `/projects`: daftar + filter teknologi (filter berbasis URL query agar bisa dibagikan, bekerja tanpa JS untuk render awal).
3. `/projects/[slug]`: render MDX, ringkasan samping (peran, periode, stack, tautan live/repo, metrik), navigasi proyek sebelum/berikutnya, `generateStaticParams`, `generateMetadata`.
4. `/about`: cerita singkat, Skills (4 kelompok), Timeline pencapaian dari `achievements.ts` (kelompokkan: kepemimpinan, mengajar, prestasi, pendidikan, media & dokumentasi).
5. `/contact`: email, GitHub, LinkedIn, tombol unduh `public/cv.pdf` (buat placeholder `TODO(owner)` jika file belum ada). Tanpa form.
6. `not-found.tsx`, `error.tsx`, dan `loading.tsx` seperlunya.
7. **Kriteria selesai:** semua route render tanpa error di mobile 360px dan desktop, navigasi keyboard lengkap, tidak ada konten palsu.

### Fase 5 - SEO, aksesibilitas, performa
1. Metadata per halaman (`title` template, `description`, canonical), Open Graph/Twitter (gunakan `opengraph-image` dinamis), `sitemap.ts`, `robots.ts`, JSON-LD `Person` di `/about`.
2. Audit aksesibilitas: urutan heading, landmark, `alt`, fokus, kontras, `prefers-reduced-motion`.
3. Performa: pastikan Server Components dominan, gambar via `next/image` dengan ukuran eksplisit, tidak ada JS client yang tidak perlu, tidak ada CLS.
4. Jalankan Lighthouse (jika tersedia lewat CLI) pada build produksi lokal dan laporkan skor 4 kategori. Perbaiki hingga target 95+.
5. **Kriteria selesai:** skor dan temuan terdokumentasi di `docs/QA.md`.

### Fase 6 - Pengisian konten & kebersihan
1. Daftar semua `TODO(owner)` yang tersisa di `docs/TODO-OWNER.md`, dikelompokkan per proyek dan diurutkan menurut dampak ke penilaian pelamar.
2. Pindai repo portofolio ini untuk secret, nomor HP, dan alamat rumah. Pastikan tidak ada yang bocor.
3. **Kriteria selesai:** daftar TODO jelas, tidak ada data sensitif.

### Fase 7 - Persiapan deploy
1. Pastikan `npm run build` produksi sukses dari kondisi bersih. Tambahkan `.env.example` bila diperlukan (kosong jika tidak ada env).
2. Tulis `docs/DEPLOY.md`: langkah deploy ke Vercel (import repo, framework preset, domain), checklist pasca-deploy, dan catatan opsional Docker/VPS untuk setelah pendaftaran.
3. **Kriteria selesai:** dokumen deploy lengkap; saya yang melakukan `git push` dan deploy.

### Fase 8A - OPSIONAL: paket interaksi bernilai tinggi
**Jangan dikerjakan otomatis.** Hanya jalankan jika saya mengetik "kerjakan Fase 8A" setelah CP3. Kerjakan sub-fase berurutan. Setelah tiap sub-fase: `typecheck`, `lint`, `build`, commit, ukur Lighthouse. **Berhenti dan laporkan jika skor turun di bawah 95**. Baca `AGENTS.md` bagian 6b dan gunakan Context7 untuk dokumentasi API yang dipakai. **Dilarang keras** efek yang mengikuti kursor (cursor spotlight, custom cursor, magnetic button).

**8A.1 Diagram arsitektur interaktif**
- Komponen reusable `ArchitectureDiagram` yang menerima data bertipe (`nodes`, `edges`, penjelasan per node: peran, alasan pemilihan teknologi) dari frontmatter/MDX. SVG responsif, tanpa library (jangan pakai D3).
- Klik atau Enter pada node menampilkan panel penjelasan. Node berupa `button` dengan fokus terlihat, `aria-expanded`, dan `aria-controls`. **Progressive enhancement:** seluruh penjelasan sudah ada di DOM (server-rendered) sehingga tetap terbaca tanpa JS.
- Isi node hanya dari bukti di `docs/INVENTORY.md`, **tidak mengarang**. Terapkan pada studi kasus unggulan terlebih dulu.

**8A.2 Status badge website live**
- Komponen server dengan `fetch` ber-cache (`next: { revalidate: 300 }` atau lebih lama) ke URL live proyek. **Allowlist ketat**: hanya URL dari konten proyek yang berdomain `*.pmkitera.web.id`, tanpa input dari pengguna (cegah SSRF). Timeout 3-5 detik dengan `AbortController`.
- Status: `operasional`, `terganggu`, `tidak terjangkau`, `tidak diketahui`. Jangan tampilkan detail error dan **jangan mengklaim persentase uptime**. Kegagalan fetch tidak boleh merusak halaman (fallback "tidak diketahui"). Status tidak hanya dibedakan lewat warna (ikon + teks).
- Jangan membebani server PMK: interval revalidate minimal 5 menit.

**8A.3 Command palette ala terminal**
- `CommandPalette` (client component), dimuat lazy saat pertama kali dipicu: `Ctrl/Cmd+K`, tombol terlihat di Header (untuk layar sentuh dan non-keyboard), atau `/` (hanya saat fokus tidak sedang di input).
- Perintah: `help`, `projects`, `about`, `contact`, `whoami`, `theme dark|light`, `cv`, ditambah pencarian proyek (fuzzy sederhana tanpa library).
- Aksesibel: `role="dialog"` atau `<dialog>`, focus trap, `Esc` menutup, fokus kembali ke pemicu, hasil diumumkan lewat `aria-live`. Tanpa dependency baru (jangan pakai `cmdk`) kecuali saya setujui.

**8A.4 Transisi ganti tema**
- Gunakan View Transitions API (`document.startViewTransition`) dengan *feature detection*; jika tidak didukung atau `prefers-reduced-motion` aktif, ganti tema langsung. Tidak boleh ada flash atau CLS.

**Kriteria selesai 8A:** keempat fitur berjalan di desktop dan mobile, tambahan JS total sesuai anggaran (sekitar 12 KB gzipped), Lighthouse tetap 95+ (skor sebelum/sesudah di `docs/QA.md`), semua fitur bisa dipakai keyboard dan menghormati `prefers-reduced-motion`.

### Fase 8B - OPSIONAL: name tag lanyard interaktif
**Jangan dikerjakan otomatis.** Hanya jalankan jika saya mengetik "kerjakan Fase 8B", idealnya setelah Fase 8A stabil dan formulir pendaftaran terkirim.
1. Baca `AGENTS.md` bagian 6b dan terapkan seluruh batasannya. Gunakan Context7 untuk dokumentasi Pointer Events/`next/dynamic` bila perlu.
2. Buat `src/components/sections/hero/LanyardTag.tsx` (client component) dan wrapper dinamis (`next/dynamic`, `ssr: false`) yang dimuat saat idle atau ketika hero terlihat. Slot `HeroVisual` tetap menampilkan name tag statis sampai komponen siap, lalu digantikan tanpa perubahan ukuran.
3. Simulasi verlet rope 2D: titik tali dengan constraint jarak, gravitasi, damping, dan tag yang bisa **ditarik** (pointer drag), **diayun**, lalu kembali ke keseimbangan. Render lewat SVG atau canvas dengan penanganan devicePixelRatio. Loop `requestAnimationFrame` dijeda saat di luar viewport dan saat tab tersembunyi.
4. Isi name tag: nama, peran, dan tautan ringan sesuai tema (token navy). Dekoratif (`aria-hidden`); informasi yang sama tetap ada sebagai teks biasa di hero.
5. Fallback: gambar statis untuk SSR, `prefers-reduced-motion`, dan perangkat lemah (misalnya `navigator.hardwareConcurrency` rendah).
6. **Kriteria selesai:** drag dan ayunan mulus di desktop dan layar sentuh tanpa mengganggu scroll, tambahan JS sesuai anggaran, Lighthouse tetap 95+ (laporkan skor sebelum dan sesudah di `docs/QA.md`), dan tidak ada CLS.

Mulai dari **Fase 0** dan lanjutkan otomatis sesuai aturan di atas sampai **CP1** (setelah Fase 2).

---

## PROMPT LANJUT (untuk sesi baru, misalnya setelah token habis atau opencode ditutup)

Tempel ini di mode Build pada sesi baru:

> Baca `AGENTS.md`, `docs/PLAN.md`, dan `docs/PROGRESS.md`, lalu periksa `git log --oneline` dan `git status`. Konfirmasi fase terakhir yang selesai dan commit terakhirnya. Jika ada perubahan yang belum di-commit, periksa lalu selesaikan atau laporkan. Lanjutkan dari fase berikutnya dengan aturan eksekusi yang sama seperti di `02-BUILD-prompt.md` (autopilot bertahap, berhenti hanya di checkpoint atau saat ada blocker). Checkpoint berikutnya: <isi: CP1 / CP2 / CP3>.
