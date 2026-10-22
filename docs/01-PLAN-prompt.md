# Prompt untuk Mode PLAN (read-only)

## Persiapan manual (sekali, di terminal)

Clone repo PMK ke folder `_sources/` di dalam proyek portofolio, supaya agent bisa membacanya (folder ini tidak ikut di-commit):

```bash
cd <folder-portofolio>
mkdir -p _sources
echo "_sources/" >> .gitignore
git clone https://github.com/<nama-org>/<repo-website-utama>.git _sources/<repo-website-utama>
# ulangi untuk: form, ark, s, dashboard-massa, pemira, tpb, dan mobile app
```

Salin `AGENTS.md` ke root proyek. Lalu buka opencode, pilih **mode Plan**, dan tempel prompt di bawah garis ini.

---

## PROMPT (tempel mulai dari sini)

Kamu bertindak sebagai Senior Full-Stack Engineer dan Software Architect. Baca `AGENTS.md` di root proyek **sampai habis** sebelum melakukan apa pun, dan patuhi seluruh isinya (terutama bagian Keamanan & Privasi dan aturan "jangan mengarang").

Kamu berada di **mode Plan: read-only**. Jangan mengubah, membuat, atau menghapus file. Seluruh keluaran berupa teks di respons ini.

### Tujuan
Menghasilkan (1) **inventaris proyek berbasis bukti** dari repo di `_sources/`, dan (2) **rencana implementasi** untuk portofolio ini, yang akan dieksekusi di mode Build.

### Langkah 1 - Pemeriksaan awal
- Baca `AGENTS.md`, `opencode.json`, `.gitignore`, dan `git status`. Laporkan jika ada masalah (misalnya `_sources/` belum di-ignore).
- Daftar isi `_sources/`.

### Langkah 2 - Analisis tiap repo di `_sources/`
Untuk setiap repo, kumpulkan bukti dari: `README`, `package.json` / file dependency lain, struktur folder, konfigurasi Docker/CI, `.env.example` (**jangan baca `.env` asli**), dan riwayat git (`git shortlog -sn`, jumlah commit, rentang tanggal, commit oleh pemilik).

Catat per repo:
1. Fungsi produk dan pengguna sasarannya.
2. Stack aktual (bahasa, framework, database, auth, deployment) beserta bukti file/baris yang menunjukkannya.
3. Bagian yang dikerjakan pemilik (berdasarkan git log). Tandai sebagai `TODO(owner)` jika tidak bisa dipastikan.
4. Keputusan arsitektur yang menarik dan layak jadi bahan studi kasus.
5. Metrik yang dapat diturunkan dari data (jumlah commit, jumlah route/halaman, jumlah model) dan beri label **"diturunkan"**. Metrik dampak (jumlah pengguna, dsb.) yang tidak ada buktinya ditulis `TODO(owner)`.
6. Risiko privasi jika ditampilkan (data pengguna, endpoint internal, kredensial yang bocor di history).

Jika memungkinkan, buka 4 URL publik (`pmkitera.web.id`, `form.`, `ark.`, `s.`) untuk memastikan fungsi tiap subdomain dan mencocokkannya dengan repo yang benar. Jangan menebak jika tidak ada bukti.

### Langkah 3 - Keluaran A: `INVENTORY.md`
Tulis isi lengkap file `docs/INVENTORY.md` dalam satu blok kode markdown, berisi:
- Tabel ringkas: nama proyek | URL live | status repo (public/private-org) | peran pemilik | stack | rekomendasi (studi kasus penuh / sorotan singkat / lewati).
- Untuk **3-4 proyek terbaik**: kerangka studi kasus 4 bagian (Latar Belakang & Masalah Teknis; Solusi & Arsitektur; Teknologi & Alasannya; Hasil & Key Takeaways) yang sudah terisi dari bukti, dengan `TODO(owner)` untuk bagian yang butuh jawaban pemilik.
- Daftar **pertanyaan untuk pemilik** (maksimal 10, urut prioritas), khusus hal yang tidak bisa diketahui dari repo.
- Daftar saran pembersihan sebelum repo dipublikasikan (secret di history, data sensitif, README yang kurang).

### Langkah 4 - Keluaran B: `PLAN.md`
Tulis isi lengkap file `docs/PLAN.md` dalam satu blok kode markdown, berisi:
1. Struktur folder final (`src/app`, `src/components/{ui,layout,sections}`, `src/lib`, `src/content`, `public`), lengkap dengan tanggung jawab tiap file penting.
2. Urutan fase Build (0-7) dengan **kriteria selesai** yang terukur, selaras dengan `01`-`07` pada file `02-BUILD-prompt.md`. Sesuaikan jika temuanmu mengharuskan perubahan, dan jelaskan alasannya.
3. Daftar komponen reusable beserta props utamanya.
4. Rencana SEO, aksesibilitas, dan performa (target Lighthouse 95+).
5. Risiko dan mitigasi (waktu, data yang belum ada, privasi repo org).
6. Estimasi urutan pengerjaan agar situs **live sebelum 28 Okt 2026** dengan cadangan waktu.

### Langkah 5 - Penutup
- Satu paragraf rekomendasi: studi kasus mana yang dijadikan unggulan di Home dan alasannya (relevansi dengan tech stack magang: TypeScript, React, Docker, Git, Linux, VPS).
- Jangan menulis kode implementasi di mode ini.
- Akhiri dengan kalimat: "Beralih ke mode Build, lalu simpan INVENTORY.md dan PLAN.md ke folder docs/."
