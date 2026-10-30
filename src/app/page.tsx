import { ContactPanel } from "@/components/sections/ContactPanel";
import { BeyondCode } from "@/components/sections/home/BeyondCode";
import { Hero } from "@/components/sections/home/Hero";
import { Letter } from "@/components/sections/home/Letter";
import { RepoFigures } from "@/components/sections/home/RepoFigures";
import { SkillsStack } from "@/components/sections/home/SkillsStack";
import { WorkLedger } from "@/components/sections/home/WorkLedger";
import { Container } from "@/components/ui/Container";
import { getAllProjects } from "@/lib/content";
import { getCommandContext } from "@/lib/command-context";

export default async function Home() {
  const [projects, context] = await Promise.all([getAllProjects(), getCommandContext()]);
  return (
    <>
      <Hero context={context} />
      <WorkLedger projects={projects} />
      <SkillsStack />
      <Letter projects={projects} />
      <RepoFigures projects={projects} />
      <BeyondCode />
      <section aria-labelledby="contact-heading" className="pt-20 pb-24 sm:pt-28 sm:pb-32">
        <Container>
          <ContactPanel cvHref={context.cvHref} split />
        </Container>
      </section>
    </>
  );
}
