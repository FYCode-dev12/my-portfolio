import Link from "next/link";
import type { Project } from "@/lib/content";

export function ProjectNav({ prev, next }: { prev?: Project; next?: Project }) {
  if (!prev && !next) return null;
  return (
    <nav aria-label="Proyek lainnya" className="mt-24 grid gap-8 sm:grid-cols-2">
      {prev ? (
        <Link href={`/projects/${prev.slug}`} className="poster-row group block py-2">
          <span className="t-small text-muted">Proyek sebelumnya</span>
          <span className="poster-name mt-1 block text-[clamp(2.5rem,6vw,5rem)] font-medium leading-none tracking-[-0.04em]">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={`/projects/${next.slug}`} className="poster-row group block py-2 sm:text-right">
          <span className="t-small text-muted">Proyek berikutnya</span>
          <span className="poster-name mt-1 block text-[clamp(2.5rem,6vw,5rem)] font-medium leading-none tracking-[-0.04em]">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
