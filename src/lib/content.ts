import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { projectFrontmatterSchema, type ProjectFrontmatter } from "./schema";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export type Project = ProjectFrontmatter & { body: string };

async function readProject(file: string): Promise<Project> {
  const raw = await readFile(path.join(PROJECTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const parsed = projectFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Frontmatter tidak valid di content/projects/${file}: ${detail}`);
  }
  return { ...parsed.data, body: content };
}

function compareProjects(a: Project, b: Project): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  if (a.order !== b.order) return a.order - b.order;
  return b.period.start.localeCompare(a.period.start);
}

export async function getAllProjects(): Promise<Project[]> {
  const files = (await readdir(PROJECTS_DIR)).filter((f) => f.endsWith(".mdx"));
  const projects = await Promise.all(files.map(readProject));
  const visible =
    process.env.NODE_ENV === "production" ? projects.filter((p) => !p.draft) : projects;
  return visible.sort(compareProjects);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return (await getAllProjects()).find((p) => p.slug === slug);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getAllProjects()).filter((p) => p.featured).slice(0, 3);
}

export function getStackCounts(projects: Project[]): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const tech of project.stack) counts.set(tech, (counts.get(tech) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
