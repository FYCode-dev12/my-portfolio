import Link from "next/link";
import type { Project } from "@/lib/content";

export function ProjectNav({ prev, next }: { prev?: Project; next?: Project }) {
  if (!prev && !next) return null;
  return (
    <nav
      aria-label="Proyek lainnya"
      className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
    >
      {prev ? (
        <Link href={`/projects/${prev.slug}`} className="rounded-md p-3 hover:bg-surface">
          <span className="font-mono text-[0.8125rem] text-muted">Sebelumnya</span>
          <span className="mt-1 block font-medium">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/projects/${next.slug}`}
          className="rounded-md p-3 hover:bg-surface sm:text-right"
        >
          <span className="font-mono text-[0.8125rem] text-muted">Berikutnya</span>
          <span className="mt-1 block font-medium">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
