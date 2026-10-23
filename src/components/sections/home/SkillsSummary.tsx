import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { skillGroups } from "@/content/skills";

export function SkillsSummary() {
  return (
    <Section
      id="skills"
      title="Keahlian"
      description="Teknologi yang dipakai pada proyek di atas, ditambah sisi desain dan media."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <Card key={group.id}>
            <Heading level={3}>{group.title}</Heading>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.items.slice(0, 6).map((item) => (
                <li key={item}>
                  <Badge>{item}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      <p className="mt-6">
        <Link href="/about#skills" className="text-accent underline-offset-4 hover:underline">
          Lihat semua keahlian
        </Link>
      </p>
    </Section>
  );
}
