import Link from "next/link";
import { cn } from "@/lib/cn";

type ProjectFilterProps = {
  stacks: Array<{ name: string; count: number }>;
  active?: string;
};

const chip = "inline-flex h-9 items-center rounded-md border px-3 text-sm transition-colors";

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
              active
                ? "border-border-strong text-muted hover:text-fg"
                : "border-accent bg-accent text-accent-fg",
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
                  selected
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-border-strong text-muted hover:text-fg",
                )}
              >
                {name}
                <span className="ml-1.5 font-mono text-xs opacity-70">{count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
