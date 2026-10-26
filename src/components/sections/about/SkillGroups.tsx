import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { skillGroups } from "@/content/skills";

export function SkillGroups() {
  return (
    <div className="grid gap-x-12 gap-y-14 sm:grid-cols-2">
      {skillGroups.map((group, i) => (
        <section
          key={group.id}
          aria-labelledby={`skill-${group.id}`}
          className="reveal"
          style={{ "--d": i % 2 } as React.CSSProperties}
        >
          <Heading level={3} id={`skill-${group.id}`}>
            {group.title}
          </Heading>
          <p className="mt-2 max-w-[44ch] text-fg">{group.summary}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li key={item}>
                <Badge tone="raised">{item}</Badge>
              </li>
            ))}
          </ul>
          {group.note ? <p className="mt-4 text-sm text-muted">{group.note}</p> : null}
        </section>
      ))}
    </div>
  );
}
