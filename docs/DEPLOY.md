# DEPLOY

Deploy MVP ke Vercel. Agent tidak melakukan `git push` maupun deploy. Semua langkah di bawah dikerjakan pemilik.

## Sebelum deploy

1. Selesaikan item dampak tinggi di `docs/TODO-OWNER.md`, terutama `public/cv.pdf` dan keputusan soal URL repositori.
2. Dari kondisi bersih, pastikan build lolos secara lokal:

   ```bash
   rm -rf .next
   SITE_URL=https://fyas.web.id npm run build
   ```

   Build menjalankan `validate:content` lebih dulu dan gagal bila frontmatter tidak valid atau ada placeholder di konten non-draft.

3. Pastikan tidak ada yang sensitif ter-track: `git ls-files | grep -E "^\.env|opencode.json|docs/private"` hanya boleh menampilkan `.env.example`.

## Langkah Vercel

1. Buat repo di GitHub (privat atau publik, terserah Anda), lalu dari mesin Anda:

   ```bash
   git remote add origin <url-repo>
   git push -u origin feat/portfolio-mvp
   ```

   Gabungkan ke `main` bila ingin produksi dari `main`.

2. Di Vercel: **Add New > Project > Import** repo tersebut.
3. **Framework Preset:** Next.js (terdeteksi otomatis). Build command, output directory, dan install command biarkan bawaan (`npm run build`, `npm install`).
4. **Node.js Version:** `package.json` meminta `>=24`. Di Project Settings > General, pastikan Node.js Version diset ke 24.x.
5. **Environment Variables:** tambahkan `SITE_URL` (Production dan Preview) berisi URL publik tanpa garis miring akhir, contoh `https://febrianyoel.vercel.app`.

   **Penting:** build produksi gagal bila `SITE_URL` kosong atau bukan URL valid (guard di `next.config.ts`). `SITE_URL` dibaca saat build. Canonical, sitemap, `robots.txt`, JSON-LD, dan Open Graph terbentuk dari nilai itu. Jika diisi setelah deploy pertama, lakukan **Redeploy** agar nilainya terpakai.

6. Klik **Deploy**.
7. Domain: pakai domain `*.vercel.app` bawaan, atau tambah domain sendiri di Settings > Domains lalu ikuti petunjuk DNS. Setelah domain final ditetapkan, perbarui `SITE_URL` dan redeploy.

## Checklist pasca-deploy

- [ ] Semua route terbuka: `/`, `/projects`, `/projects/pmk-form`, `/projects/pi-core`, `/projects/pi-lynk`, `/projects/pmk-ark`, `/about`, `/contact`.
- [ ] URL tidak ada (misalnya `/xyz`) menampilkan halaman 404 buatan sendiri.
- [ ] `/sitemap.xml` dan `/robots.txt` memuat domain produksi, bukan `localhost:3000`.
- [ ] Sumber halaman `/about` memuat JSON-LD `Person` dengan `url` produksi.
- [ ] Tombol "Unduh CV" muncul dan `/cv.pdf` terunduh (jika file sudah ditaruh).
- [ ] Toggle tema bekerja dan tidak berkedip saat muat ulang.
- [ ] Tautan eksternal (form., s., ark.pmkitera.web.id, pplkitera.com, GitHub, LinkedIn) terbuka.
- [ ] Jalankan Lighthouse (mobile) pada URL produksi dan bandingkan dengan `docs/QA.md`. Target semua kategori 95+. Skor Performance lokal berkisar 93-98.
- [ ] Uji pratinjau tautan (Open Graph) di WhatsApp dan LinkedIn.
- [ ] Buka situs di ponsel nyata (lebar sempit) dan cek tidak ada overflow.
- [ ] Cari di halaman: tidak ada nomor HP, alamat rumah, atau teks `TODO`.
- [ ] Setelah semua lolos, kirim tautan produksi ke berkas pendaftaran sebelum 31 Okt 2026.

## Catatan

- `/projects` dirender dinamis karena membaca `searchParams` untuk filter. Halaman lain statis.
- Peringatan lockfile saat build lokal ("ignored package-lock.json in /home/fycode") berasal dari file di luar repo. Tidak muncul di Vercel.
- Studi kasus berstatus `draft: true` otomatis disembunyikan di build produksi.

## Setelah pendaftaran dikirim (opsional)

Docker dan VPS belum dikerjakan dan bukan bagian MVP. Jika nanti dibutuhkan:

- Next.js mendukung `output: "standalone"` untuk image Docker kecil. Cek dokumentasi versi terpasang sebelum menerapkan.
- Taruh reverse proxy (misalnya Caddy atau Nginx) dengan TLS di depan container.
- Simpan `SITE_URL` sebagai build argument, karena dibaca saat build.
- Tambahkan CI untuk `typecheck`, `lint`, dan `build`.

Fase 8A dan 8B (interaksi dan name tag lanyard) hanya dikerjakan bila Anda mengetik perintahnya.
