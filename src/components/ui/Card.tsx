import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/cn";

type CardProps = ComponentPropsWithoutRef<"div"> & {
  as?: ElementType;
  interactive?: boolean;
};

export function Card({ as: Tag = "div", interactive = false, className, ...props }: CardProps) {
  return (
    <Tag
      className={cn("rounded-lg bg-surface p-5 sm:p-6", interactive && "card-lift", className)}
      {...props}
    />
  );
}
