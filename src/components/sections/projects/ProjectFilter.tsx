import Link from "next/link";
import { cn } from "@/lib/cn";

type ProjectFilterProps = {
  stacks: Array<{ name: string; count: number }>;
  active?: string;
};

const chip = "press inline-flex h-10 items-center rounded-md px-3 font-mono text-[0.875rem]";

export function ProjectFilter({ stacks, active }: ProjectFilterProps) {
  return (
    <nav aria-label="Filter teknologi">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/projects"
            aria-current={active ? undefined : "true"}
            className={cn(
              chip,
              active ? "bg-surface text-muted hover:text-fg" : "bg-accent text-accent-fg",
            )}
          >
            Semua
          </Link>
        </li>
        {stacks.map(({ name, count }) => {
          const selected = active === name;
          return (
            <li key={name}>
              <Link
                href={`/projects?tech=${encodeURIComponent(name)}`}
                aria-current={selected ? "true" : undefined}
                className={cn(
                  chip,
                  selected ? "bg-accent text-accent-fg" : "bg-surface text-muted hover:text-fg",
                )}
              >
                {name}
                <span className="ml-1.5 opacity-70">{count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
