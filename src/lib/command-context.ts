import type { CommandContext } from "@/components/interactive/command-data";
import { site } from "@/content/site";
import { getAllProjects } from "./content";
import { getCvHref } from "./cv";

/** Data ringkas untuk terminal dan command palette, dibangun saat build. */
export async function getCommandContext(): Promise<CommandContext> {
  const projects = await getAllProjects();
  return {
    projects: projects.map((p) => ({
      slug: p.slug,
      title: p.title,
      kind: p.kind,
      status: p.status,
      live: p.links.live,
    })),
    cvHref: getCvHref(),
    email: site.links.email,
    github: site.links.github,
    linkedin: site.links.linkedin,
  };
}
