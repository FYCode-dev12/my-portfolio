import { skillGroups } from "@/content/skills";

export function SkillList() {
  return (
    <div className="space-y-12">
      {skillGroups.map((group, i) => (
        <section
          key={group.id}
          aria-labelledby={`skill-${group.id}`}
          className="reveal grid gap-4 lg:grid-cols-[34%_1fr] lg:gap-0"
          style={{ "--i": i } as React.CSSProperties}
        >
          <h3 id={`skill-${group.id}`} className="t-lead font-medium lg:pr-10">
            {group.title}
          </h3>
          <div>
            <p className="max-w-[48ch] text-lg leading-relaxed">{group.items.join(", ")}.</p>
            {group.note ? <p className="mt-3 text-muted">{group.note}</p> : null}
          </div>
        </section>
      ))}
    </div>
  );
}
