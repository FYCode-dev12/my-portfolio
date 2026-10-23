import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  tone?: "neutral" | "accent";
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-xs",
        tone === "accent" ? "border-accent text-accent" : "border-border text-muted",
        className,
      )}
      {...props}
    />
  );
}
