# Panduan gambar

Semua gambar situs ada di `public/`. Dokumen ini menjelaskan gambar yang sudah dipakai, cara menambah foto dan screenshot, dan aturan privasinya.

## Aturan umum

- Format JPG untuk foto, PNG untuk screenshot antarmuka. WebP juga boleh. `next/image` mengonversi ke AVIF/WebP saat ditayangkan.
- Ukuran sumber: sisi terpanjang 1600 sampai 2400 px, berkas di bawah sekitar 800 KB. Jangan unggah file kamera mentah.
- Nama berkas huruf kecil dengan tanda hubung, tanpa spasi: `pmk-form-beranda.png`, bukan `Screenshot 2026-10-23.png`. Nama berkas di Linux membedakan huruf besar dan kecil.
- Setiap gambar punya `alt` yang menjelaskan isinya. Gambar murni dekoratif memakai `alt=""`.
- Foto temuan (bukan milikmu) tidak pernah ditampilkan sebagai fotomu, ruanganmu, atau karyamu. Kreditnya masuk ke `src/content/photos.ts` dan tampil kecil di footer.
- Jangan mengarang screenshot atau mockup yang berpura-pura sebagai tampilan aplikasi asli.

## Gambar yang sudah dipakai

Semua ada di `public/photos/`. Metadata (ukuran, alt, titik fokus crop) ada di `src/content/photos.ts`.

| Berkas | Isi | Dipakai di | Rasio bingkai |
| --- | --- | --- | --- |
| `itera-senja.jpg` | Foto udara kampus ITERA saat senja | Beranda (PhotoBand), `/about` | 4:3 |
| `pantai-pasir-putih.jpg` | Pantai di Lampung Selatan | Beranda, `/about` | 3:2 |
| `peta-teluk-lampung.jpg` | Peta pelayaran 1774, Teluk Lampung | Beranda, `/about` | 4:5 |
| `peta-keysers-bay.jpg` | Peta pelayaran 1774, Teluk Keyser | Beranda, `/about` | 4:5 |

Keempatnya foto temuan berlisensi terbuka. Kredit lengkap (judul, pembuat, lisensi, tautan) ada di `credits` pada `src/content/photos.ts`.

## Menambah foto temuan baru

1. Cari yang berlisensi izinkan penggunaan ulang (CC BY, CC BY-SA, CC0, domain publik) di Wikimedia Commons atau Openverse.
2. Unduh, ubah ukuran sesuai aturan umum, taruh di `public/photos/`.
3. Tambah entri di `photos` (ukuran asli, `alt`, `position` untuk titik fokus crop, misalnya `"50% 40%"`).
4. Tambah entri di `credits` dengan judul, pembuat, lisensi, URL lisensi, dan URL halaman sumber. Lisensi CC BY dan BY-SA mewajibkan kredit, jadi langkah ini tidak boleh dilewati.

## Foto profil (`/about`)

Simpan satu berkas persis bernama `public/photos/febrian.webp`. Versi sekarang adalah foto asli utuh tanpa latar (transparan); hanya margin kosong yang dibuang (800x1638). Foto asli (berlatar dan tanpa latar) disimpan di `assets/profile/`, yang di-gitignore dan tidak ikut dipublikasikan; `ProfileFrame` menampilkannya dengan rasio aslinya, jadi bila rasio foto berubah, perbarui `width`/`height` di komponen itu.

- Potret rasio 4:5, misalnya 1200 x 1500 px, di bawah sekitar 500 KB.
- Wajah dan bahu di bagian atas tengah. Crop memakai `objectPosition: 50% 25%`, jadi kepala yang terlalu rendah akan terpotong.
- Latar polos atau lembut, cahaya dari depan atau samping, bukan kontra cahaya.
- Tanpa berkas ini halaman memakai siluet. Dengan berkas ini siluet otomatis diganti saat build berikutnya (`src/lib/profile.ts` mengecek keberadaan berkas). Setelah menyimpan, commit dan push agar tayang.
- Alt teks otomatis: "Foto Febrian Yoel Anggara Saputra".

## Screenshot proyek

Status: belum ada. Field `cover` di frontmatter MDX sudah ada di skema (`src/lib/schema.ts`), tetapi halaman studi kasus belum membacanya. Saat ini halaman proyek memakai foto bingkai dari `workFrames`. Saat screenshot siap, bagian render `cover` perlu dipasang di `src/app/projects/[slug]/page.tsx` dan `ProjectRow.tsx`.

Spesifikasi yang disarankan:

- Tangkapan jendela browser lebar 1440 px, rasio 16:9, simpan sebagai PNG (misalnya 1600 x 900).
- Satu screenshot per proyek yang menampilkan layar paling informatif. Dua sampai tiga untuk studi kasus penuh (PMK Form, PI-CORE, PI-LYNK).
- Bingkai di halaman studi kasus saat ini 16:7, jadi isi penting taruh di pita tengah gambar.
- Nama berkas: `<slug>-<layar>.png`, misalnya `pi-lynk-dashboard.png`. Simpan di `public/projects/`.
- Alt menjelaskan apa yang terlihat dan apa fungsinya, misalnya "Dashboard PI-LYNK berisi daftar tautan pendek dan jumlah kliknya".

### Samarkan data sebelum menyimpan

Sesuai AGENTS.md bagian 8, screenshot hanya boleh memuat data yang sudah disamarkan.

- Tutup atau ganti dengan data contoh: nama anggota, email, nomor HP, NIM, isi respons form, token, dan URL internal.
- Gunakan kotak solid (bukan blur ringan yang masih bisa dibaca) atau ganti teksnya langsung di DevTools sebelum menangkap layar.
- Untuk PMK ARK (`private-org`), jangan tampilkan apa pun yang mengungkap isi repo privat.
- Periksa metadata berkas: hapus EXIF dari foto, dan pastikan tab, bookmark, dan notifikasi tidak ikut tertangkap.
- Jangan tampilkan angka dampak di screenshot kalau angkanya belum terverifikasi (lihat `docs/TODO-OWNER.md` nomor 4 sampai 6).

## Gambar Open Graph

Dibuat dari kode di `src/app/opengraph-image.tsx`. Tidak perlu berkas gambar. Kalau ingin diganti dengan gambar statis, simpan 1200 x 630 px dan sesuaikan berkas itu.

## Daftar periksa sebelum commit gambar

- [ ] Berkas di bawah sekitar 800 KB dan namanya huruf kecil.
- [ ] `alt` terisi dan bermakna.
- [ ] Tidak ada data pribadi atau data pengguna yang terlihat.
- [ ] Foto temuan punya entri `credits`.
- [ ] `npm run typecheck && npm run lint && SITE_URL=https://fyas.web.id npm run build` lolos.
