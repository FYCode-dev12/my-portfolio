import { ContactCta } from "@/components/sections/home/ContactCta";
import { FeaturedProjects } from "@/components/sections/home/FeaturedProjects";
import { Hero } from "@/components/sections/home/Hero";
import { Highlights } from "@/components/sections/home/Highlights";
import { SkillsSummary } from "@/components/sections/home/SkillsSummary";
import { getFeaturedProjects } from "@/lib/content";
import { getCvHref } from "@/lib/cv";

export default async function Home() {
  const featured = await getFeaturedProjects();
  const cvHref = getCvHref();
  return (
    <>
      <Hero cvHref={cvHref} />
      <FeaturedProjects projects={featured} />
      <SkillsSummary />
      <Highlights />
      <ContactCta cvHref={cvHref} />
    </>
  );
}
