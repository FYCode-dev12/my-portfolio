export type AchievementCategory =
  "leadership" | "award" | "training" | "teaching" | "education" | "media";

export type Achievement = {
  id: string;
  title: string;
  issuer?: string;
  date: string;
  endDate?: string | "present";
  category: AchievementCategory;
  description?: string;
  href?: string;
};

export const categoryLabels: Record<AchievementCategory, string> = {
  leadership: "Organisasi & kepanitiaan",
  teaching: "Mengajar",
  award: "Prestasi",
  training: "Pelatihan",
  education: "Pendidikan",
  media: "Media & dokumentasi",
};

export const categoryOrder: AchievementCategory[] = [
  "leadership",
  "teaching",
  "award",
  "training",
  "education",
  "media",
];

export const achievements: Achievement[] = [
  {
    id: "cmit-head",
    title: "Kepala Departemen CMIT",
    issuer: "BPH PMK ITERA 2026",
    date: "2026-02",
    endDate: "present",
    category: "leadership",
    description:
      "Memimpin program kerja departemen yang mengelola media, informasi, dan teknologi.",
  },
  {
    id: "easter-2026-chair",
    title: "Ketua Pelaksana PMK ITERA Easter Celebration 2026",
    date: "2026-03",
    endDate: "2026-05",
    category: "leadership",
  },
  {
    id: "pemira-frontend",
    title: "Kepala Subdivisi Frontend, Pemira PMK ITERA 2025",
    date: "2025-11",
    endDate: "2025-12",
    category: "leadership",
    description: "Frontend website pemira, UI/UX, dan koordinasi tim.",
  },
  {
    id: "talent-media",
    title: "Kepala Divisi Media Kreatif, PMK ITERA Talent Competition 2025",
    date: "2025-09",
    endDate: "2025-11",
    category: "leadership",
  },
  {
    id: "tpb-backend",
    title: "Staff Backend, Informatics Goes To TPB 2025",
    date: "2025-08",
    endDate: "2025-09",
    category: "leadership",
    description: "Backend sistem kegiatan, data, dan integrasi.",
  },
  {
    id: "biro-it",
    title: "Staff Biro IT, BPH PMK ITERA 2025",
    date: "2025-02",
    endDate: "2025-12",
    category: "leadership",
    description: "Mengelola dan mengembangkan Dashboard Massa PMK.",
  },
  {
    id: "pplk-2026",
    title: "Staf IT Sub Frontend, PPLK ITERA 2026",
    issuer: "Divisi Implementasi Teknologi",
    date: "2026-07",
    category: "leadership",
    description:
      "Mengerjakan frontend situs PPLK ITERA 2026: redesain halaman rincian UPA, halaman divisi pelaksana, dan halaman landing maskot. Situs dipakai seluruh mahasiswa baru 2026 dan panitia.",
    href: "https://pplkitera.com",
  },
  {
    id: "pubdok-intern",
    title: "Magang Publikasi & Dokumentasi, PMK ITERA (CMIT)",
    date: "2024-08",
    endDate: "2024-12",
    category: "leadership",
  },
  {
    id: "asdos",
    title: "Asisten Dosen Pengenalan Komputasi",
    issuer: "ITERA",
    date: "2026-02",
    endDate: "present",
    category: "teaching",
  },
  {
    id: "lks-provinsi",
    title: "Juara 2 Lomba Kompetensi Siswa tingkat Provinsi Lampung",
    date: "2023-07",
    category: "award",
  },
  {
    id: "lks-kabupaten",
    title: "Juara 1 Lomba Kompetensi Siswa tingkat Kabupaten",
    date: "2023-02",
    category: "award",
  },
  {
    id: "pra-td",
    title: "Pelatihan Pra-TD ITERA",
    date: "2024-06",
    category: "training",
  },
  {
    id: "itera",
    title: "S1 Teknik Informatika",
    issuer: "Institut Teknologi Sumatera (ITERA)",
    date: "2024-05",
    endDate: "present",
    category: "education",
  },
  {
    id: "smk",
    title: "Rekayasa Perangkat Lunak",
    issuer: "SMK Pangudi Luhur Seputih Mataram",
    date: "2021-08",
    endDate: "2024-05",
    category: "education",
  },
  {
    id: "media-events",
    title: "Dokumentasi acara",
    issuer:
      "Easter Celebration 2025, Ibadah PPLK & Family Gathering 2025, Natal Prodi TI 2025, PMK ITERA Christmas Celebration 2025",
    date: "2025-04",
    endDate: "2025-12",
    category: "media",
  },
];

export const highlightIds = ["cmit-head", "easter-2026-chair", "lks-provinsi", "asdos"] as const;
