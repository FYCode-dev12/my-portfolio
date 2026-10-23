import { AboutPreview } from "@/components/sections/home/AboutPreview";
import { ContactCta } from "@/components/sections/home/ContactCta";
import { FeaturedProjects } from "@/components/sections/home/FeaturedProjects";
import { Hero } from "@/components/sections/home/Hero";
import { PhotoBand } from "@/components/sections/home/PhotoBand";
import { SkillsSummary } from "@/components/sections/home/SkillsSummary";
import { getAllProjects } from "@/lib/content";

export default async function Home() {
  const projects = await getAllProjects();
  return (
    <>
      <Hero />
      <FeaturedProjects projects={projects} />
      <AboutPreview />
      <SkillsSummary />
      <PhotoBand />
      <ContactCta />
    </>
  );
}
