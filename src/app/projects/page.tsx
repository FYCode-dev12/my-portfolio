import type { Metadata } from "next";
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
      <Heading level={1}>Proyek</Heading>
      <p className="mt-4 max-w-2xl text-muted">
        Studi kasus sistem web yang saya bangun dan rilis. Filter berdasarkan teknologi.
      </p>
      <div className="mt-8">
        <ProjectFilter stacks={stacks} active={active} />
      </div>
      <p className="mt-8 text-sm text-muted" aria-live="polite">
        {projects.length} proyek{active ? ` dengan ${active}` : ""}
      </p>
      <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
