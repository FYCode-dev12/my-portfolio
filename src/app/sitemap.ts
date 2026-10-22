import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjects();
  const pages = ["", "/projects", "/about", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
  }));
  return [...pages, ...projects.map((p) => ({ url: `${siteUrl}/projects/${p.slug}` }))];
}
