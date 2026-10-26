import { achievements, type Achievement } from "./achievements";

/**
 * Sistem web tempat saya berkontribusi di kepanitiaan. Tanpa studi kasus: detailnya
 * hanya yang tercatat di linimasa (`achievements.ts`), tidak ditambah.
 */
export type Contribution = {
  achievementId: Achievement["id"];
  name: string;
  kind: string;
};

const entries: Contribution[] = [
  { achievementId: "pplk-2026", name: "Situs PPLK ITERA 2026", kind: "Frontend" },
  { achievementId: "pemira-frontend", name: "Website Pemira 2025", kind: "Frontend lead" },
  { achievementId: "tpb-backend", name: "Informatics Goes To TPB", kind: "Backend" },
  { achievementId: "biro-it", name: "Dashboard Massa PMK", kind: "Pengembangan" },
];

export type ResolvedContribution = Contribution & { achievement: Achievement };

export const contributions: ResolvedContribution[] = entries.map((entry) => {
  const achievement = achievements.find((a) => a.id === entry.achievementId);
  if (!achievement)
    throw new Error(`Kontribusi merujuk achievement yang tidak ada: ${entry.achievementId}`);
  return { ...entry, achievement };
});
