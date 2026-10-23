import { ArrowDown, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { diagrams } from "@/content/diagrams";

export function ArchitectureFlow({ slug }: { slug: string }) {
  const columns = diagrams[slug];
  if (!columns) return null;
  const headingId = `flow-${slug}`;
  return (
    <section aria-labelledby={headingId} className="mt-16">
      <Heading level={2} look={3} id={headingId}>
        Alur sistem sekilas
      </Heading>
      <ol className="mt-6 flex flex-col items-stretch gap-3 lg:flex-row">
        {columns.map((col, i) => (
          <li key={col.title} className="flex flex-1 flex-col items-center gap-3 lg:flex-row">
            <Card className="h-full w-full">
              <p className="font-mono text-sm text-accent">{col.title}</p>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {col.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </Card>
            {i < columns.length - 1 ? (
              <>
                <ArrowDown aria-hidden="true" className="size-5 shrink-0 text-border-strong lg:hidden" />
                <ArrowRight aria-hidden="true" className="hidden size-5 shrink-0 text-border-strong lg:block" />
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
