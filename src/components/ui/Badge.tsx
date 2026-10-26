import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  /** `raised` untuk badge di atas latar halaman, `neutral` di atas permukaan (kartu). */
  tone?: "neutral" | "accent" | "raised";
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[0.8125rem]",
        tone === "accent" && "bg-accent text-accent-fg",
        tone === "neutral" && "bg-bg text-muted",
        tone === "raised" && "bg-surface text-fg",
        className,
      )}
      {...props}
    />
  );
}
