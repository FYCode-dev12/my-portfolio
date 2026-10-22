import type { Metadata } from "next";
import { Briefcase, Code, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Heading } from "@/components/ui/Heading";
import { site } from "@/content/site";
import { getCvHref } from "@/lib/cv";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Email, GitHub, dan LinkedIn Febrian Yoel Anggara Saputra.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const cvHref = getCvHref();
  return (
    <Container size="narrow" className="py-16 sm:py-24">
      <Heading level={1}>Kontak</Heading>
      <p className="mt-4 text-muted">
        Cara tercepat menghubungi saya adalah lewat email. Saya biasanya membalas dalam beberapa
        hari.
      </p>
      <Card as="ul" className="mt-10 space-y-5 list-none">
        <li className="flex items-center gap-3">
          <Mail aria-hidden="true" className="size-5 text-muted" />
          <a
            href={`mailto:${site.links.email}`}
            className="text-accent underline-offset-4 hover:underline"
          >
            {site.links.email}
          </a>
        </li>
        <li className="flex items-center gap-3">
          <Code aria-hidden="true" className="size-5 text-muted" />
          <ExternalLink href={site.links.github}>github.com/FYCode-dev12</ExternalLink>
        </li>
        <li className="flex items-center gap-3">
          <Briefcase aria-hidden="true" className="size-5 text-muted" />
          <ExternalLink href={site.links.linkedin}>linkedin.com/in/febrianyoel</ExternalLink>
        </li>
      </Card>
      {cvHref ? (
        <div className="mt-8">
          <Button href={cvHref} download>
            Unduh CV
          </Button>
        </div>
      ) : null}
    </Container>
  );
}
