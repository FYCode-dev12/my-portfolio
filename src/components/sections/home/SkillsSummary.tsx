import Link from "next/link";
import { skillGroups } from "@/content/skills";

export function SkillsSummary() {
  return (
    <section aria-labelledby="skills-heading" className="section gutter">
      <h2 id="skills-heading" className="t-sub reveal">
        Keahlian
      </h2>
      <ul className="mt-10">
        {skillGroups.map((group, i) => (
          <li
            key={group.id}
            className="poster-row reveal grid gap-3 py-4 md:grid-cols-[1fr_20rem] md:items-end md:gap-10 md:py-3"
            style={{ "--i": i } as React.CSSProperties}
          >
            <h3 className="poster-name text-[clamp(3rem,8vw,7rem)] font-medium leading-[0.95] tracking-[-0.045em]">
              {group.title}
            </h3>
            <p className="max-w-[40ch] text-muted md:pb-3">
              {group.items.slice(0, 5).join(", ")}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-10">
        <Link href="/about#skills" className="link inline-flex min-h-11 items-center font-medium">
          Lihat daftar lengkap keahlian
        </Link>
      </p>
    </section>
  );
}
