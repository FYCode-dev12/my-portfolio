import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "../../../../mdx-components";
import { ArchitectureFlow } from "@/components/sections/diagram/ArchitectureFlow";
import { PhotoStrip } from "@/components/sections/home/PhotoStrip";
import { ProjectFacts } from "@/components/sections/projects/ProjectFacts";
import { ProjectNav } from "@/components/sections/projects/ProjectNav";
import { PageTitle } from "@/components/ui/PageTitle";
import { workFrames } from "@/content/photos";
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
  const cover = workFrames[index % workFrames.length];

  return (
    <div className="gutter pb-24 pt-8 sm:pt-12">
      <PageTitle lines={[project.title]} size="poster" className="break-words" />
      <p className="t-lead hero-in mt-8 max-w-[44ch] text-pretty">{project.summary}</p>

      <div className="mt-16 grid gap-14 lg:grid-cols-[22rem_1fr] lg:gap-20">
        <div className="reveal lg:sticky lg:top-8 lg:self-start">
          <ProjectFacts project={project} />
        </div>
        <article className="min-w-0 max-w-[68ch]">
          <MDXRemote source={project.body} components={mdxComponents} />
        </article>
      </div>

      <div className="zoom-in reveal relative mt-24 aspect-[16/7] overflow-hidden rounded-lg bg-surface">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="94vw"
          className="object-cover"
          style={{ objectPosition: cover.position }}
        />
      </div>
      <PhotoStrip skip={cover.src} />

      <div className="mt-24">
        <ArchitectureFlow slug={project.slug} />
      </div>
      <ProjectNav prev={all[index - 1]} next={all[index + 1]} />
      <p className="mt-12">
        <Link href="/projects" className="link inline-flex min-h-11 items-center">
          Kembali ke semua proyek
        </Link>
      </p>
    </div>
  );
}
