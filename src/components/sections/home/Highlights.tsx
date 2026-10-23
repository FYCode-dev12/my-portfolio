import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { achievements, highlightIds } from "@/content/achievements";
import { formatAchievementPeriod } from "@/lib/format";

export function Highlights() {
  const items = highlightIds
    .map((id) => achievements.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => a !== undefined);

  return (
    <Section id="highlights" title="Sorotan">
      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.id}>
            <Card className="h-full">
              <p className="font-mono text-xs text-muted">
                {formatAchievementPeriod(item.date, item.endDate)}
              </p>
              <Heading level={3} look={4} className="mt-2">
                {item.title}
              </Heading>
              {item.issuer ? <p className="mt-1 text-sm text-muted">{item.issuer}</p> : null}
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
