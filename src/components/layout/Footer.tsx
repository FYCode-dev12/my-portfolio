import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <Container className="flex flex-col gap-2 text-sm text-muted sm:flex-row sm:justify-between">
        <p>{site.name}</p>
        <p>Dibangun dengan Next.js, TypeScript, dan Tailwind CSS.</p>
      </Container>
    </footer>
  );
}
