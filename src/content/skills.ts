export type SkillGroup = {
  id: string;
  title: string;
  items: string[];
  note?: string;
};

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
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
    items: ["Figma", "Desain grafis", "Fotografi", "Videografi", "Penyuntingan video"],
  },
];
