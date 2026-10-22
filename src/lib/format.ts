const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export function formatYearMonth(value: string): string {
  const [year, month] = value.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

/** Rentang untuk proyek: tanpa akhir berarti masih berjalan. */
export function formatProjectPeriod(start: string, end?: string): string {
  if (end === start) return formatYearMonth(start);
  return `${formatYearMonth(start)} – ${end ? formatYearMonth(end) : "sekarang"}`;
}

/** Rentang untuk linimasa: tanpa akhir berarti satu bulan saja. */
export function formatAchievementPeriod(date: string, endDate?: string): string {
  if (!endDate) return formatYearMonth(date);
  return `${formatYearMonth(date)} – ${endDate === "present" ? "sekarang" : formatYearMonth(endDate)}`;
}
