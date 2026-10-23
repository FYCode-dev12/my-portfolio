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
    <div className="space-y-16">
      {categoryOrder.map((category) => {
        const group = items.filter((i) => i.category === category).sort(byRecency);
        if (group.length === 0) return null;
        const id = `timeline-${category}`;
        return (
          <section key={category} aria-labelledby={id} className="grid gap-6 lg:grid-cols-[34%_1fr] lg:gap-0">
            <h3 id={id} className="t-lead font-medium lg:pr-10">
              {categoryLabels[category]}
            </h3>
            <ol className="space-y-12">
              {group.map((item, i) => (
                <li key={item.id} className="reveal" style={{ "--i": i } as React.CSSProperties}>
                  <p className="t-small text-muted">{formatAchievementPeriod(item.date, item.endDate)}</p>
                  <p className="mt-1 text-[clamp(1.25rem,1.2vw+0.6rem,1.625rem)] font-medium leading-snug tracking-[-0.01em]">{item.title}</p>
                  {item.issuer ? <p className="text-lg text-muted">{item.issuer}</p> : null}
                  {item.description ? <p className="mt-2 max-w-[56ch] text-lg">{item.description}</p> : null}
                  {item.href ? (
                    <p className="mt-1">
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
