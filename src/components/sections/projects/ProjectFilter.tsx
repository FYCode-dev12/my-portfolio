import Link from "next/link";
import { cn } from "@/lib/cn";

type ProjectFilterProps = {
  stacks: Array<{ name: string; count: number }>;
  active?: string;
};

const chip = "inline-flex min-h-11 items-center rounded-md px-4 transition-colors";

export function ProjectFilter({ stacks, active }: ProjectFilterProps) {
  return (
    <nav aria-label="Filter teknologi">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/projects"
            aria-current={active ? undefined : "true"}
            className={cn(chip, active ? "bg-surface hover:bg-fg hover:text-bg" : "bg-field text-field-fg")}
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
                className={cn(chip, selected ? "bg-field text-field-fg" : "bg-surface hover:bg-fg hover:text-bg")}
              >
                {name}
                <span className="ml-2 opacity-75">{count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
