import Image from "next/image";
import Link from "next/link";
import { workFrames } from "@/content/photos";
import type { Project } from "@/lib/content";
import { formatProjectPeriod, statusLabel } from "@/lib/format";

type ProjectRowProps = { project: Project; index: number; headingLevel?: 2 | 3 };

export function ProjectRow({ project, index, headingLevel = 2 }: ProjectRowProps) {
  const frame = workFrames[index % workFrames.length];
  const Tag = `h${headingLevel}` as "h2" | "h3";
  return (
    <article
      className="poster-row reveal group relative grid gap-3 py-6 md:grid-cols-[1fr_22rem] md:items-end md:gap-10"
      style={{ "--i": index } as React.CSSProperties}
    >
      <Tag className="poster-name text-[clamp(3rem,8.5vw,7.5rem)] font-medium leading-[0.95] tracking-[-0.045em]">
        <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:content-['']">
          {project.title}
        </Link>
      </Tag>
      <div className="md:pb-3">
        <div className="zoom-in relative mb-4 aspect-[3/2] w-44 overflow-hidden rounded-md bg-surface">
          <Image
            src={frame.src}
            alt=""
            fill
            sizes="176px"
            className="object-cover"
            style={{ objectPosition: frame.position }}
          />
        </div>
        <p className="font-medium">
          {project.kind ? `${project.kind}, ` : ""}
          {statusLabel[project.status].toLowerCase()}
        </p>
        <p className="t-small mt-1 text-muted">
          {formatProjectPeriod(project.period.start, project.period.end)}
        </p>
        <p className="mt-3 max-w-[44ch] text-muted">{project.summary}</p>
        <p className="t-small mt-3">{project.stack.slice(0, 5).join(", ")}</p>
      </div>
    </article>
  );
}
