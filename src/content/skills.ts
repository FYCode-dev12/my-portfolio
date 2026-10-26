export type SkillGroup = {
  id: string;
  title: string;
  /** Kunci di fragmen `stack.json` beranda. */
  key: string;
  /** Satu kalimat: untuk apa kelompok ini dipakai di proyek. */
  summary: string;
  items: string[];
  note?: string;
};

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    key: "frontend",
    summary:
      "Antarmuka dengan React dan Next.js App Router, form dengan react-hook-form, aplikasi mobile dengan Expo.",
    items: [
      "React",
      "Next.js (App Router)",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "react-hook-form",
      "React Native (Expo)",
    ],
  },
  {
    id: "backend",
    title: "Backend",
    key: "backend",
    summary:
      "API lewat Server Actions, Route Handlers, dan Hono; data di PostgreSQL dengan Drizzle atau Prisma.",
    items: [
      "Server Actions & Route Handlers",
      "Hono",
      "PostgreSQL",
      "Supabase",
      "Drizzle ORM",
      "Prisma",
      "Auth.js",
      "Better Auth",
      "Zod",
    ],
  },
  {
    id: "devops",
    title: "DevOps & Tools",
    key: "devops",
    summary:
      "Rilis ke Vercel dan Cloudflare Workers, CI di GitHub Actions, monorepo dengan Turborepo.",
    items: [
      "Git & GitHub",
      "GitHub Actions (CI)",
      "Vercel",
      "Cloudflare Workers & R2",
      "pnpm & Turborepo",
    ],
    note: "Siap belajar: Docker dan deployment VPS.",
  },
  {
    id: "design-media",
    title: "Desain & Media",
    key: "desain_media",
    summary: "Figma untuk antarmuka; foto, video, dan penyuntingan untuk dokumentasi acara.",
    items: ["Figma", "Desain grafis", "Fotografi", "Videografi", "Penyuntingan video"],
  },
];
