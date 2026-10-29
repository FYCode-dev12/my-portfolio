import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "../../../../mdx-components";
import { RakitCue } from "@/components/mascot/RakitCue";
import { ArchitectureFlow } from "@/components/sections/diagram/ArchitectureFlow";
import { ProjectNav } from "@/components/sections/projects/ProjectNav";
import { ProjectSidebar } from "@/components/sections/projects/ProjectSidebar";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { getAllProjects, getProjectBySlug } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.title, description: project.summary, type: "article" },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const all = await getAllProjects();
  const index = all.findIndex((p) => p.slug === slug);

  return (
    <Container className="py-16 sm:py-24">
      <Heading level={1}>{project.title}</Heading>
      <p className="mt-6 max-w-2xl text-lg text-muted">{project.summary}</p>
      <nav aria-label="Breadcrumb" className="mt-6 font-mono text-[0.875rem] text-muted">
        <Link href="/projects" className="hover:text-fg">
          <span aria-hidden="true">←</span> ~/proyek
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-fg" aria-current="page">
          {project.slug}
        </span>
      </nav>
      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_20rem]">
        <article className="min-w-0 max-w-2xl">
          <MDXRemote source={project.body} components={mdxComponents} />
        </article>
        <div className="lg:sticky lg:top-20 lg:self-start">
          <ProjectSidebar project={project} />
        </div>
      </div>
      <ArchitectureFlow slug={project.slug} />
      <RakitCue act="toleh" say="Selamat membaca studi kasusnya!" />
      <ProjectNav prev={all[index - 1]} next={all[index + 1]} />
    </Container>
  );
}
