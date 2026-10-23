import { credits } from "@/content/photos";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <Container className="flex flex-col gap-6 text-sm text-muted">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <p>{site.name}</p>
          <p>Dibangun dengan Next.js, TypeScript, dan Tailwind CSS.</p>
        </div>
        <details className="text-xs">
          <summary className="inline-flex min-h-11 cursor-pointer items-center">Kredit foto</summary>
          <ul className="mt-2 space-y-1">
            {credits.map((credit) => (
              <li key={credit.page}>
                <a href={credit.page} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-fg">
                  {credit.title}
                </a>
                , {credit.creator},{" "}
                <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-fg">
                  {credit.license}
                </a>
                , via Wikimedia Commons
              </li>
            ))}
          </ul>
        </details>
      </Container>
    </footer>
  );
}
