import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

const config: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default function nextConfig(phase: string): NextConfig {
  if (phase === PHASE_PRODUCTION_BUILD) {
    const raw = process.env.SITE_URL?.trim();
    if (!raw) {
      throw new Error(
        "SITE_URL kosong. Isi dengan URL publik situs (contoh: https://fyas.web.id) sebelum build, karena dipakai untuk canonical, sitemap, dan Open Graph.",
      );
    }
    try {
      new URL(raw);
    } catch {
      throw new Error(`SITE_URL bukan URL yang valid: "${raw}". Sertakan skema, misalnya https://fyas.web.id.`);
    }
  }
  return config;
}
