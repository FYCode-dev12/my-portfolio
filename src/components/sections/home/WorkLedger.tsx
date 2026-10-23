import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { LiveStatus } from "@/components/interactive/LiveStatus";
import { contributions } from "@/content/contributions";
import { diagrams } from "@/content/diagrams";
import type { Project } from "@/lib/content";
import { formatAchievementPeriod, statusLabel } from "@/lib/format";

type Row = {
  key: string;
  name: string;
  kind: string;
  year: string;
  href: string;
  external: boolean;
  live: boolean;
  preview: React.ReactNode;
};

function ProjectPreview({ project }: { project: Project }) {
  const flow = diagrams[project.slug];
  return (
    <>
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3 text-[0.8125rem]">
        <span className="text-fg">{project.slug}</span>
        {project.links.live ? (
          <LiveStatus slug={project.slug} />
        ) : (
          <span>{statusLabel[project.status].toLowerCase()}</span>
        )}
      </div>
      <div className="space-y-5 px-5 py-5">
        <p className="font-sans text-base leading-relaxed text-fg">{project.summary}</p>
        {flow ? (
          <ol aria-label="Alur sistem" className="flex flex-wrap items-center gap-x-2 gap-y-2">
            {flow.map((step, i) => (
              <li key={step.title} className="flex items-center gap-2">
                <span className="rounded-sm bg-bg px-2 py-1 text-fg">{step.title}</span>
                {i < flow.length - 1 ? (
                  <span aria-hidden="true" className="flow-arrow text-accent">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        ) : null}
        <p>
          <span className="text-accent">stack</span> {project.stack.slice(0, 6).join(" · ")}
          {project.stack.length > 6 ? ` +${project.stack.length - 6}` : ""}
        </p>
      </div>
    </>
  );
}

function buildRows(projects: Project[]): Row[] {
  const fromProjects = projects.map<Row>((p) => ({
    key: p.slug,
    name: p.title,
    kind: p.kind ?? p.role,
    year: p.period.start.slice(0, 4),
    href: `/projects/${p.slug}`,
    external: false,
    live: p.status === "live",
    preview: <ProjectPreview project={p} />,
  }));
  const fromContributions = contributions.map<Row>((c) => ({
    key: c.achievementId,
    name: c.name,
    kind: c.kind,
    year: c.achievement.date.slice(0, 4),
    href: c.achievement.href ?? "/about#timeline",
    external: Boolean(c.achievement.href),
    live: false,
    preview: (
      <>
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3 text-[0.8125rem]">
          <span className="text-fg">{c.kind.toLowerCase()}</span>
          <span>{formatAchievementPeriod(c.achievement.date, c.achievement.endDate)}</span>
        </div>
        <div className="space-y-4 px-5 py-5">
          <p className="font-sans text-base leading-relaxed text-fg">
            {c.achievement.description ?? c.achievement.title}
          </p>
          <p>{c.achievement.title}</p>
        </div>
      </>
    ),
  }));
  return [...fromProjects, ...fromContributions];
}

export function WorkLedger({ projects }: { projects: Project[] }) {
  const rows = buildRows(projects);
  const years = [...new Set(rows.map((r) => r.year))].sort().reverse();
  const index = new Map(rows.map((r, i) => [r.key, i]));
  // Pratinjau dipilih murni dengan CSS (:has), tanpa JS.
  const css = rows
    .map(
      (_, i) =>
        `.ledger:has([data-i="${i}"]:is(:hover,:focus-visible)) .ledger-preview[data-i="${i}"]{opacity:1;transform:none;visibility:visible}`,
    )
    .join("");

  return (
    <section id="work" aria-labelledby="work-heading" className="py-28 sm:py-40">
      <style>{css}</style>
      <Container>
        <div className="ledger grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <Heading level={2} id="work-heading" className="reveal">
              Sistem yang sudah dirilis
            </Heading>
            <p
              className="reveal mt-4 max-w-[46ch] text-muted"
              style={{ "--d": 1 } as React.CSSProperties}
            >
              Empat proyek dengan studi kasus, lalu sistem kepanitiaan tempat saya memegang frontend
              atau backend. Arahkan ke baris untuk melihat isinya.
            </p>
            <div className="mt-10 space-y-8">
              {years.map((year) => (
                <div key={year} className="reveal">
                  <p className="mb-2 text-sm text-muted tabular-nums">{year}</p>
                  <ol className="ledger-rows">
                    {rows
                      .filter((r) => r.year === year)
                      .map((row) => (
                        <li key={row.key}>
                          <Link
                            href={row.href}
                            data-i={index.get(row.key)}
                            target={row.external ? "_blank" : undefined}
                            rel={row.external ? "noopener noreferrer" : undefined}
                            className="ledger-row group grid min-h-13 grid-cols-[1fr_auto] items-center gap-x-4 py-2 sm:grid-cols-[1.1fr_1fr_auto]"
                          >
                            <span className="flex items-center gap-2.5 font-medium text-fg">
                              <span
                                aria-hidden="true"
                                className={
                                  row.live
                                    ? "pulse-dot size-2 rounded-full bg-accent"
                                    : "size-2 rounded-full bg-border-strong"
                                }
                              />
                              {row.name}
                              {row.live ? <span className="sr-only">(live)</span> : null}
                            </span>
                            <span className="col-start-1 pl-[1.125rem] text-sm text-muted sm:col-start-auto sm:pl-0">
                              {row.kind}
                            </span>
                            <span className="row-span-2 row-start-1 col-start-2 flex items-center gap-1 text-sm text-muted tabular-nums sm:col-start-3 sm:row-span-1">
                              {row.external ? (
                                <>
                                  <ArrowUpRight aria-hidden="true" className="size-4" />
                                  <span className="sr-only">(buka di tab baru)</span>
                                </>
                              ) : (
                                <span aria-hidden="true" className="ledger-arrow">
                                  →
                                </span>
                              )}
                            </span>
                          </Link>
                        </li>
                      ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
          <div inert className="relative hidden lg:col-span-6 lg:block">
            <div className="sticky top-28 h-[22rem]">
              {rows.map((row, i) => (
                <div
                  key={row.key}
                  data-i={i}
                  data-ui
                  className="ledger-preview absolute inset-x-0 top-0 overflow-hidden rounded-lg bg-surface font-mono text-[0.875rem] leading-6 text-muted"
                >
                  {row.preview}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
