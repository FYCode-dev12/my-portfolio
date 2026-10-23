import type { ComponentPropsWithoutRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type ExternalLinkProps = Omit<ComponentPropsWithoutRef<"a">, "target" | "rel"> & {
  showIcon?: boolean;
};

export function ExternalLink({
  showIcon = true,
  className,
  children,
  ...props
}: ExternalLinkProps) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1 text-accent underline-offset-4 hover:underline",
        className,
      )}
      {...props}
    >
      {children}
      {showIcon ? <ArrowUpRight aria-hidden="true" className="size-4" /> : null}
      <span className="sr-only">(buka di tab baru)</span>
    </a>
  );
}
