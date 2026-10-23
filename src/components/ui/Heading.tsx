import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/cn";

type Level = 1 | 2 | 3 | 4 | 5 | 6;

const visual: Record<Level, string> = {
  1: "page-title text-5xl sm:text-7xl font-semibold tracking-[-0.04em]",
  2: "text-2xl sm:text-3xl font-semibold tracking-tight",
  3: "text-xl font-semibold",
  4: "text-lg font-semibold",
  5: "text-base font-semibold",
  6: "text-sm font-semibold",
};

type HeadingProps = Omit<ComponentPropsWithoutRef<"h1">, "children"> & {
  level: Level;
  /** Tingkat tampilan, bila berbeda dari tingkat semantik. */
  look?: Level;
  children: React.ReactNode;
};

export function Heading({ level, look, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as ElementType;
  return (
    <Tag className={cn("text-fg leading-tight", visual[look ?? level], className)} {...props} />
  );
}
