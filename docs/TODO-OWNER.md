# TODO-OWNER

Hal yang hanya bisa diisi pemilik. Diurutkan menurut dampak ke penilaian pelamar. Semua item di bawah **sudah dihilangkan dari situs** (tidak ada placeholder yang tampil). Situs tetap valid tanpa semuanya.

## Dampak tinggi (isi sebelum kirim, target 28 Okt)

| #   | Item                                                 | Lokasi                                                                   | Cara mengisi                                                                                                                                                    |
| --- | ---------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ~~`public/cv.pdf`~~ **Selesai**                      | Tombol "Unduh CV" di beranda, CTA, dan `/contact`                        | CV tanpa nomor HP dan alamat sudah ada di `public/cv.pdf`                                                                                                       |
| 2   | ~~`SITE_URL` produksi~~ **Dijaga build**             | Canonical, sitemap, `robots.txt`, JSON-LD, Open Graph                    | Build gagal bila `SITE_URL` kosong atau bukan URL. Isi `https://fyas.web.id` di environment variable Vercel (Production dan Preview). Lihat `.env.example` |
| 3   | ~~URL repositori memuat nama organisasi~~ **Selesai** | `repo:` di `pi-core.mdx`, `pi-lynk.mdx`, `pmk-form.mdx`                  | Dipertahankan: `links.repo` dipakai (tautan "Lihat repositori") dan ketiga repo publik (HTTP 200). Nama tidak tampil sebagai teks |

## Dampak sedang (memperkuat studi kasus)

| #   | Item                                     | Proyek                          | Catatan                                                                                                                      |
| --- | ---------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 4   | Jumlah respons yang bisa dibuktikan      | PMK Form                        | Saat ini hanya "dipakai untuk rekrutmen Ketua Umum dan form kegiatan lain". Angka jangan ditebak, ambil dari dashboard admin |
| 5   | Jumlah klik atau tautan aktif            | PI-LYNK                         | Pemilik belum sempat mengecek. Bisa dibaca dari dashboard admin                                                              |
| 6   | URL produksi dan pengguna selain pemilik | PI-CORE                         | Saat ini staging dan satu pengguna. Perbarui `status` dan `metrics` bila sudah rilis                                         |
| 7   | Screenshot yang disamarkan               | PMK Form, PI-LYNK, PI-CORE, ARK | Diizinkan jika data pengguna disamarkan. Belum ada yang dibuat. Tambahkan via `cover:` di frontmatter dan `next/image`       |
| 8   | ~~Foto pemilik~~ **Selesai** | `/about`                        | Terpasang di `public/photos/febrian.jpg` (foto asli selebar penuh sampai pinggang, 1080x1287). Dipakai di `/about` dan avatar surat di beranda |

## Dampak rendah (bisa setelah pendaftaran)

| #   | Item                                                                  | Lokasi                                                                                                                                                            |
| --- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 9   | Bidang Lomba Kompetensi Siswa 2023 (kabupaten dan provinsi)           | `src/content/achievements.ts` (`lks-kabupaten`, `lks-provinsi`). Saat ini hanya peringkat                                                                         |
| 10  | Studi kasus Dashboard Massa PMK, Pemira 2025, Informatics Goes To TPB | Hanya di timeline. Repo tidak ditemukan lokal. Butuh repo/URL dan izin bila privat                                                                                |
| 11  | Studi kasus PPLK ITERA 2026 (privat)                                  | Hanya di timeline. Pemilik memilih tidak ada studi kasus                                                                                                          |
| 12  | Waktu mulai proyek                                                    | `period.start` di MDX diambil dari commit pertama repo lokal (PMK Form 2026-03, ARK 2026-09, PI-LYNK dan PI-CORE 2026-10). Koreksi bila proyek dimulai lebih awal |

## Sudah diputuskan (tidak perlu diisi)

- Nama organisasi lengkap tidak ditampilkan. Singkatan "PMK ITERA" tetap ada di jabatan dan timeline sesuai CV.
- Penggunaan AI agent tidak dicantumkan.
- Docker, Linux, dan VPS bukan klaim skill. Hanya catatan "Siap belajar: Docker dan deployment VPS."
- `pmkitera.web.id` bukan karya pemilik (kontributor saja). `website-pmk` dilewati.
- Nomor HP dan alamat rumah tidak boleh tampil.

## Setelah pendaftaran dikirim

- Fase 8A dan 8B (interaksi, lanyard): hanya dikerjakan jika Anda mengetik perintahnya.
- Docker/VPS: dikerjakan setelah pendaftaran.
- Ganti parser frontmatter (`gray-matter` > `js-yaml`) bila suatu saat ada konten dari pengguna.
- Supabase/CMS admin: dicadangkan untuk fase setelah pendaftaran.
