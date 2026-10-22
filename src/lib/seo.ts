import { site } from "@/content/site";

export const siteUrl = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    url: siteUrl,
    sameAs: [site.links.github, site.links.linkedin],
    alumniOf: { "@type": "CollegeOrUniversity", name: "Institut Teknologi Sumatera" },
  };
}
