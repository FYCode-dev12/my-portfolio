import { getAllProjects } from "@/lib/content";
import type { SiteStatus, StatusResponse } from "@/lib/status";

// Hasil dicache dan diperbarui paling cepat tiap 5 menit (ISR).
export const revalidate = 300;

const TIMEOUT_MS = 5000;

async function probe(url: string): Promise<SiteStatus> {
  const start = performance.now();
  try {
    let res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (res.status === 405) res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    return { ok: res.ok, code: res.status, ms: Math.round(performance.now() - start) };
  } catch {
    return { ok: false, code: null, ms: null };
  }
}

/** Status situs live proyek. Daftar URL hanya dari frontmatter, bukan dari input pengguna. */
export async function GET() {
  const projects = (await getAllProjects()).filter((p) => p.links.live);
  const entries = await Promise.all(
    projects.map(async (p) => [p.slug, await probe(p.links.live as string)] as const),
  );
  const body: StatusResponse = {
    checkedAt: new Date().toISOString(),
    sites: Object.fromEntries(entries),
  };
  return Response.json(body);
}
