import { diagrams } from "@/content/diagrams";

export function ArchitectureFlow({ slug }: { slug: string }) {
  const columns = diagrams[slug];
  if (!columns) return null;
  return (
    <figure aria-labelledby={`flow-${slug}`}>
      <figcaption id={`flow-${slug}`} className="t-sub mb-8">
        Alur sistem sekilas
      </figcaption>
      <ol className="grid gap-14 lg:auto-cols-fr lg:grid-flow-col lg:gap-14">
        {columns.map((col, i) => (
          <li
            key={col.title}
            className="flow-col reveal relative rounded-md bg-surface p-5"
            style={{ "--i": i } as React.CSSProperties}
          >
            <p className="font-semibold">{col.title}</p>
            <ul className="mt-3 space-y-2 text-muted">
              {col.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </figure>
  );
}
