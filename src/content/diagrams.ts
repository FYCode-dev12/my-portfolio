export type FlowColumn = { title: string; lines: string[] };

/** Diagram sekilas per proyek. Setiap baris mengacu pada bagian Solusi & Arsitektur di MDX-nya. */
export const diagrams: Record<string, FlowColumn[]> = {
  "pmk-form": [
    { title: "Pengisi form", lines: ["Halaman publik /form/[slug]", "Form dirender dari data"] },
    {
      title: "Server",
      lines: [
        "Skema Zod dari konfigurasi field",
        "Rate limit (Upstash Redis atau in-memory)",
        "Unggahan maksimal 512 KB",
      ],
    },
    { title: "Supabase", lines: ["Postgres dengan Row Level Security", "Storage untuk lampiran"] },
    { title: "Outbox", lines: ["Antrean per respons", "Cron, maksimal 5 percobaan"] },
    { title: "Google Sheets", lines: ["Tujuan sinkronisasi respons"] },
  ],
  "pi-lynk": [
    {
      title: "Buat tautan",
      lines: [
        "Turnstile diverifikasi di server",
        "URL tujuan divalidasi, hanya http dan https",
        "Daftar slug dicadangkan",
      ],
    },
    {
      title: "Batas",
      lines: ["IP di-hash dengan salt", "Hitungan per jam dan per hari di Postgres"],
    },
    { title: "Simpan", lines: ["Postgres (Neon) lewat Drizzle", "Unique index pada slug"] },
    {
      title: "Buka tautan",
      lines: [
        "Cari slug, redirect sementara 307",
        "Halaman khusus bila kedaluwarsa, nonaktif, atau diblokir",
      ],
    },
    {
      title: "Hitung klik",
      lines: ["Penghitung tidak menahan redirect", "Crawler pratinjau tidak dihitung"],
    },
  ],
  "pi-core": [
    {
      title: "Klien",
      lines: [
        "Panel admin (Next.js)",
        "Aplikasi anggota (Expo)",
        "Aplikasi organisasi lain lewat OIDC",
      ],
    },
    {
      title: "API",
      lines: [
        "Cloudflare Workers dengan Hono",
        "Validasi Zod di semua endpoint",
        "Better Auth, login Google saja",
      ],
    },
    {
      title: "Realtime",
      lines: ["Durable Object RealtimeHub", "Event hanya membawa id dan jenis aksi"],
    },
    {
      title: "Data",
      lines: ["PostgreSQL di Supabase lewat Hyperdrive", "Drizzle, RLS aktif, Data API dimatikan"],
    },
  ],
  "pmk-ark": [
    { title: "Pengguna", lines: ["Admin", "Pengurus", "Jemaat"] },
    {
      title: "Aplikasi",
      lines: ["Login bcrypt, sesi JWT di cookie httpOnly", "Middleware memverifikasi token admin"],
    },
    { title: "Data", lines: ["Prisma dan PostgreSQL", "Dokumen, kategori, periode pelayanan"] },
    { title: "File", lines: ["Cloudflare R2 lewat StorageService", "QR code untuk berbagi arsip"] },
  ],
  "kalyo-v2": [
    {
      title: "Google Calendar",
      lines: ["Beberapa kalender lewat service account", "Cache 15 detik"],
    },
    { title: "Privasi", lines: ["Pengaturan per kalender", 'Judul disembunyikan jadi "Sibuk"'] },
    {
      title: "Ketersediaan",
      lines: ["Aturan jam kerja, zona Asia/Jakarta", "Lewati hari libur dan slot bentrok"],
    },
    {
      title: "Tampilan",
      lines: ["Satu kalender gabungan (FullCalendar)", "Indonesia dan Inggris"],
    },
    {
      title: "Admin",
      lines: ["Login Google, daftar email diizinkan", "Atur kalender, jam kerja, hari libur"],
    },
  ],
  goxposisi: [
    { title: "Admin", lines: ["Unggah atau tulis Markdown", "Pratinjau sebelum terbit"] },
    {
      title: "API admin",
      lines: ["Cek peran di proxy dan di handler", "Cek same-origin, batas ukuran, validasi"],
    },
    { title: "Supabase", lines: ["Postgres dengan RLS", "Publik hanya membaca yang terbit"] },
    {
      title: "Halaman statis",
      lines: ["generateStaticParams per kitab dan pasal", "revalidatePath saat admin menyimpan"],
    },
    {
      title: "Pembaca",
      lines: ["Pencarian Fuse.js di browser", "Pembacaan bersuara (Web Speech)"],
    },
  ],
  "pemira-pmk-2025": [
    { title: "Pemilih", lines: ["Login NIM dan token 6 karakter", "Ditolak bila sudah memilih"] },
    {
      title: "Frontend",
      lines: ["React + Vite, TanStack Query", "Dialog konfirmasi, logout otomatis"],
    },
    {
      title: "API Laravel",
      lines: ["Token Sanctum per peran", "Suara ditolak saat pemungutan ditutup"],
    },
    {
      title: "Database",
      lines: ["pemilih_id unik di tabel suara", "Simpan suara dalam satu transaksi"],
    },
    {
      title: "Dasbor panitia",
      lines: ["Partisipasi per fakultas", "Buka dan tutup pemungutan suara"],
    },
  ],
  "silent-voice": [
    {
      title: "Kamera depan",
      lines: ["Vision Camera, frame processor Kotlin", "MediaPipe Face Landmarker"],
    },
    {
      title: "Deteksi ucapan",
      lines: ["Mouth Aspect Ratio, mesin status", "Ring buffer 15 bingkai"],
    },
    {
      title: "Model on-device",
      lines: ["Patch bibir dan 40 landmark", "ONNX Runtime Mobile, antrean FIFO"],
    },
    { title: "Suara", lines: ["Text-to-speech Android", "Riwayat dan koreksi prediksi"] },
    {
      title: "Kalibrasi (cloud)",
      lines: ["Enam rekaman per kata", "Fine-tuning di FastAPI, bobot dikirim balik"],
    },
  ],
  "igttpb-2025": [
    { title: "Login", lines: ["Google OAuth via Supabase, PKCE", "Hanya email mahasiswa ITERA"] },
    {
      title: "Peran",
      lines: ["NIM dicocokkan ke daftar peserta dan panitia", "Dasbor mengikuti peran"],
    },
    { title: "Peserta", lines: ["Kumpulkan tugas", "Tampilkan QR presensi"] },
    { title: "Panitia", lines: ["Pindai QR dari dasbor", "Cek duplikat sebelum simpan"] },
    { title: "Supabase", lines: ["Upsert presensi pada NIM"] },
  ],
};
