import { Heading } from "@/components/ui/Heading";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { categoryLabels, categoryOrder, type Achievement } from "@/content/achievements";
import { formatAchievementPeriod } from "@/lib/format";

function byRecency(a: Achievement, b: Achievement): number {
  const endA = a.endDate === "present" ? "9999-12" : (a.endDate ?? a.date);
  const endB = b.endDate === "present" ? "9999-12" : (b.endDate ?? b.date);
  return endB.localeCompare(endA) || b.date.localeCompare(a.date);
}

export function Timeline({ items }: { items: Achievement[] }) {
  return (
    <div className="space-y-12">
      {categoryOrder.map((category) => {
        const group = items.filter((i) => i.category === category).sort(byRecency);
        if (group.length === 0) return null;
        const id = `timeline-${category}`;
        return (
          <section key={category} aria-labelledby={id}>
            <Heading level={3} id={id}>
              {categoryLabels[category]}
            </Heading>
            <ol className="mt-5 space-y-6 border-l border-border-strong pl-6">
              {group.map((item) => (
                <li key={item.id} className="reveal relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[1.8125rem] top-2 size-2 rounded-full bg-accent"
                  />
                  <p className="font-mono text-[0.8125rem] text-muted">
                    {formatAchievementPeriod(item.date, item.endDate)}
                  </p>
                  <p className="mt-1 font-medium">{item.title}</p>
                  {item.issuer ? <p className="text-sm text-muted">{item.issuer}</p> : null}
                  {item.description ? <p className="mt-2 text-muted">{item.description}</p> : null}
                  {item.href ? (
                    <p className="mt-2 text-sm">
                      <ExternalLink href={item.href}>Kunjungi situs</ExternalLink>
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
