import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { site } from "@/content/site";
import { HeroVisual } from "./HeroVisual";

export function Hero({ cvHref }: { cvHref?: string }) {
  return (
    <section aria-labelledby="hero-heading" className="py-16 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
        <div className="fade-in hero-copy">
          <p className="font-mono text-sm text-accent">{site.role}</p>
          <Heading level={1} id="hero-heading" className="mt-4">
            {site.name}
          </Heading>
          <p className="mt-6 max-w-2xl text-lg text-muted">{site.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/projects">Lihat proyek</Button>
            <Button href="/contact" variant="secondary">
              Hubungi saya
            </Button>
            {cvHref ? (
              <Button href={cvHref} variant="ghost" download>
                Unduh CV
              </Button>
            ) : null}
          </div>
        </div>
        <div className="hidden lg:block">
          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}
