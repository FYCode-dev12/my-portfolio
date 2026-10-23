import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import type { Project } from "@/lib/content";
import { formatProjectPeriod } from "@/lib/format";
import { StatusBadge } from "./ProjectMeta";

const VISIBLE_STACK = 5;

type ProjectCardProps = { project: Project; headingLevel?: 2 | 3 };

export function ProjectCard({ project, headingLevel = 3 }: ProjectCardProps) {
  const extra = project.stack.length - VISIBLE_STACK;
  return (
    <Card as="article" interactive className="relative flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <StatusBadge status={project.status} />
        <p className="font-mono text-xs text-muted">
          {formatProjectPeriod(project.period.start, project.period.end)}
        </p>
      </div>
      <Heading level={headingLevel} look={3} className="mt-4">
        <Link
          href={`/projects/${project.slug}`}
          className="after:absolute after:inset-0 after:content-['']"
        >
          {project.title}
        </Link>
      </Heading>
      {project.kind ? <p className="mt-1 font-mono text-xs text-accent">{project.kind}</p> : null}
      <p className="mt-2 flex-1 text-muted">{project.summary}</p>
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Teknologi">
        {project.stack.slice(0, VISIBLE_STACK).map((tech) => (
          <li key={tech}>
            <Badge>{tech}</Badge>
          </li>
        ))}
        {extra > 0 ? (
          <li>
            <Badge>+{extra}</Badge>
          </li>
        ) : null}
      </ul>
    </Card>
  );
}
