import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { ProjectFilter } from "@/components/sections/projects/ProjectFilter";
import { ProjectRow } from "@/components/sections/projects/ProjectRow";
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
    <div className="gutter pb-24 pt-10 sm:pt-16">
      <PageTitle lines={["Empat", "sistem web."]} />
      <div className="hero-in mt-12">
        <ProjectFilter stacks={stacks} active={active} />
      </div>
      <p className="reveal mt-8 text-muted" aria-live="polite">
        {projects.length} proyek{active ? ` dengan ${active}` : ""}
      </p>
      <div className="mt-6">
        {projects.map((project, index) => (
          <ProjectRow key={project.slug} project={project} index={index} />
        ))}
      </div>
    </div>
  );
}
