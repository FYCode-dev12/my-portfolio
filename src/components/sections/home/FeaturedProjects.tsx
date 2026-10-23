import Link from "next/link";
import { Section } from "@/components/ui/Section";
import type { Project } from "@/lib/content";
import { ProjectCard } from "@/components/sections/projects/ProjectCard";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  return (
    <Section
      id="projects"
      title="Proyek unggulan"
      description="Sistem web yang saya bangun dan rilis untuk organisasi."
    >
      <ul className="grid gap-4 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
      <p className="mt-8">
        <Link href="/projects" className="text-accent underline-offset-4 hover:underline">
          Lihat semua proyek
        </Link>
      </p>
    </Section>
  );
}
