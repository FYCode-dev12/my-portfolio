import { z } from "zod";

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "format harus YYYY-MM");

export const projectFrontmatterSchema = z.object({
  title: z.string().min(3),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  summary: z.string().max(200),
  kind: z.string().max(40).optional(),
  role: z.string(),
  period: z.object({ start: yearMonth, end: yearMonth.optional() }),
  // "demo": situs bisa dibuka, tetapi berjalan dengan data dummy tanpa backend aslinya.
  status: z.enum(["live", "demo", "in-progress", "archived"]),
  stack: z.array(z.string()).min(1),
  links: z.object({
    live: z.string().url().optional(),
    // Label tautan live bila bukan situs produksi, misalnya demo dengan data dummy.
    liveLabel: z.string().max(30).optional(),
    repo: z.string().url().optional(),
  }),
  repoVisibility: z.enum(["public", "private-org", "none"]),
  featured: z.boolean().default(false),
  order: z.number().default(100),
  cover: z.string().optional(),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  draft: z.boolean().default(false),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
