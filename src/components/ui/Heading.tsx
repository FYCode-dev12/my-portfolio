import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/cn";

type Level = 1 | 2 | 3 | 4;

const visual: Record<Level, string> = {
  1: "t-display",
  2: "t-head",
  3: "t-sub",
  4: "t-lead font-medium",
};

type HeadingProps = Omit<ComponentPropsWithoutRef<"h1">, "children"> & {
  level: Level;
  /** Tingkat tampilan, bila berbeda dari tingkat semantik. */
  look?: Level;
  children: React.ReactNode;
};

export function Heading({ level, look, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as ElementType;
  return <Tag className={cn("text-fg text-balance", visual[look ?? level], className)} {...props} />;
}
