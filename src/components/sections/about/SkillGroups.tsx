import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { skillGroups } from "@/content/skills";

export function SkillGroups() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {skillGroups.map((group) => (
        <Card key={group.id} as="section" aria-labelledby={`skill-${group.id}`}>
          <Heading level={3} id={`skill-${group.id}`}>
            {group.title}
          </Heading>
          <ul className="mt-4 flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li key={item}>
                <Badge>{item}</Badge>
              </li>
            ))}
          </ul>
          {group.note ? <p className="mt-4 text-sm text-muted">{group.note}</p> : null}
        </Card>
      ))}
    </div>
  );
}
