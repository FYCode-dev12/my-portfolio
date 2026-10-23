import { ExternalLink } from "@/components/ui/ExternalLink";
import type { Project } from "@/lib/content";
import { formatProjectPeriod, statusLabel } from "@/lib/format";

const visibilityNote: Partial<Record<Project["repoVisibility"], string>> = {
  "private-org": "Kode sumber berada di repositori privat organisasi.",
};

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="t-small text-muted">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}

export function ProjectFacts({ project }: { project: Project }) {
  const note = visibilityNote[project.repoVisibility];
  return (
    <aside aria-label="Ringkasan proyek">
      <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-1">
        <Fact label="Status">{statusLabel[project.status]}</Fact>
        <Fact label="Peran">{project.role}</Fact>
        <Fact label="Periode">{formatProjectPeriod(project.period.start, project.period.end)}</Fact>
        <Fact label="Teknologi">{project.stack.join(", ")}</Fact>
        {project.metrics.map((metric) => (
          <Fact key={metric.label} label={metric.label === "Status" ? "Tahap" : metric.label}>
            {metric.value}
          </Fact>
        ))}
        {project.links.live || project.links.repo || note ? (
          <Fact label="Tautan">
            <ul>
              {project.links.live ? (
                <li>
                  <ExternalLink href={project.links.live}>Buka situs live</ExternalLink>
                </li>
              ) : null}
              {project.links.repo ? (
                <li>
                  <ExternalLink href={project.links.repo}>Lihat repositori</ExternalLink>
                </li>
              ) : null}
            </ul>
            {note ? <p className="t-small mt-1 text-muted">{note}</p> : null}
          </Fact>
        ) : null}
      </dl>
    </aside>
  );
}
