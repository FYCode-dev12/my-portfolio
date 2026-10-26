import { Heading } from "@/components/ui/Heading";
import { diagrams } from "@/content/diagrams";

function Wire({ index }: { index: number }) {
  const style = { "--k": index } as React.CSSProperties;
  return (
    <>
      <span aria-hidden="true" data-dir="y" className="flow-wire mx-auto h-8 lg:hidden">
        <span className="flow-packet" style={style} />
      </span>
      <span
        aria-hidden="true"
        data-dir="x"
        className="flow-wire hidden w-8 shrink-0 self-center lg:block"
      >
        <span className="flow-packet" style={style} />
      </span>
    </>
  );
}

/** Diagram alur sekilas. Paket data bergerak di kabel antar-node; diam saat reduced-motion. */
export function ArchitectureFlow({ slug }: { slug: string }) {
  const columns = diagrams[slug];
  if (!columns) return null;
  const headingId = `flow-${slug}`;
  return (
    <section aria-labelledby={headingId} className="mt-24">
      <Heading level={2} look={3} id={headingId}>
        Alur sistem sekilas
      </Heading>
      <ol data-ui className="mt-6 flex flex-col items-stretch lg:flex-row">
        {columns.map((col, i) => (
          <li key={col.title} className="flex flex-1 flex-col lg:flex-row">
            <div className="h-full w-full rounded-lg bg-surface p-5 font-mono">
              <p className="text-[0.875rem] text-accent">{col.title}</p>
              <ul className="mt-3 space-y-2 font-sans text-sm text-muted">
                {col.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            {i < columns.length - 1 ? <Wire index={i} /> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
