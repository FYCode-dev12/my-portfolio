import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { LiveStatus } from "@/components/interactive/LiveStatus";
import type { Project } from "@/lib/content";
import { formatProjectPeriod } from "@/lib/format";
import { StatusBadge } from "./ProjectMeta";

const visibilityNote: Partial<Record<Project["repoVisibility"], string>> = {
  "private-org": "Kode sumber berada di repositori privat organisasi.",
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-[0.8125rem] text-accent">{label.toLowerCase()}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}

export function ProjectSidebar({ project }: { project: Project }) {
  const note = visibilityNote[project.repoVisibility];
  return (
    <Card as="aside" aria-label="Ringkasan proyek" data-ui>
      <dl className="space-y-5">
        <Row label="Status">
          <span className="flex flex-wrap items-center gap-3">
            <StatusBadge status={project.status} />
            {project.links.live ? <LiveStatus slug={project.slug} className="text-muted" /> : null}
          </span>
        </Row>
        <Row label="Peran">{project.role}</Row>
        <Row label="Periode">{formatProjectPeriod(project.period.start, project.period.end)}</Row>
        <Row label="Stack">
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li key={tech}>
                <Badge>{tech}</Badge>
              </li>
            ))}
          </ul>
        </Row>
        {project.metrics.map((metric) => (
          <Row key={metric.label} label={metric.label}>
            {metric.value}
          </Row>
        ))}
        {project.links.live || project.links.repo || note ? (
          <Row label="Tautan">
            <ul className="space-y-1">
              {project.links.live ? (
                <li>
                  <ExternalLink href={project.links.live}>Situs live</ExternalLink>
                </li>
              ) : null}
              {project.links.repo ? (
                <li>
                  <ExternalLink href={project.links.repo}>Repositori</ExternalLink>
                </li>
              ) : null}
            </ul>
            {note ? <p className="mt-1 text-sm text-muted">{note}</p> : null}
          </Row>
        ) : null}
      </dl>
    </Card>
  );
}
