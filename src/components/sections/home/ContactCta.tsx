import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { site } from "@/content/site";

export function ContactCta({ cvHref }: { cvHref?: string }) {
  return (
    <section aria-labelledby="cta-heading" className="border-t border-border py-16 sm:py-24">
      <Container size="narrow" className="text-center">
        <Heading level={2} id="cta-heading">
          Mari berbincang
        </Heading>
        <p className="mt-3 text-muted">Terbuka untuk magang dan kolaborasi pengembangan web.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={`mailto:${site.links.email}`}>Kirim email</Button>
          {cvHref ? (
            <Button href={cvHref} variant="secondary" download>
              Unduh CV
            </Button>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
