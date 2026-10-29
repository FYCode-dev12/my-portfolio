import type { Metadata } from "next";
import { RakitSeat } from "@/components/mascot/RakitSeat";
import { ProjectCard } from "@/components/sections/projects/ProjectCard";
import { ProjectFilter } from "@/components/sections/projects/ProjectFilter";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { getAllProjects, getStackCounts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Proyek",
  description: "Sistem web yang saya bangun dan rilis: studi kasus, arsitektur, dan teknologi.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage({ searchParams }: PageProps<"/projects">) {
  const params = await searchParams;
  const tech = typeof params.tech === "string" ? params.tech : undefined;

  const all = await getAllProjects();
  const stacks = getStackCounts(all);
  const active = stacks.some((s) => s.name === tech) ? tech : undefined;
  const projects = active ? all.filter((p) => p.stack.includes(active)) : all;

  return (
    <Container className="py-16 sm:py-24">
      <div className="flex items-end justify-between gap-6">
        <Heading level={1}>Proyek & studi kasus</Heading>
        <RakitSeat fallback expression="fokus" arrive="lompat" className="w-32 shrink-0 sm:w-56" />
      </div>
      <p className="mt-6 max-w-[48ch] text-lg text-muted">
        Sistem web yang saya bangun dan rilis, lengkap dengan arsitektur dan alasan teknisnya.
        Saring berdasarkan teknologi.
      </p>
      <div className="mt-8">
        <ProjectFilter stacks={stacks} active={active} />
      </div>
      <p className="mt-8 text-sm text-muted" aria-live="polite">
        {projects.length} proyek{active ? ` dengan ${active}` : ""}
      </p>
      <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <li key={project.slug} className="reveal" style={{ "--d": i % 3 } as React.CSSProperties}>
            <ProjectCard project={project} headingLevel={2} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
