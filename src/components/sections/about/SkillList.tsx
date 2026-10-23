import { skillGroups } from "@/content/skills";

export function SkillList() {
  return (
    <div className="space-y-16">
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
            <p className="max-w-[36ch] text-[clamp(1.25rem,1.5vw+0.4rem,1.75rem)] leading-[1.35] tracking-[-0.01em]">{group.items.join(", ")}.</p>
            {group.note ? <p className="mt-4 text-lg opacity-90">{group.note}</p> : null}
          </div>
        </section>
      ))}
    </div>
  );
}
