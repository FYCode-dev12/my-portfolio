import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  size?: "narrow" | "default";
};

export function Container({ size = "default", className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("gutter mx-auto w-full", size === "narrow" ? "max-w-4xl" : "max-w-[96rem]", className)}
      {...props}
    />
  );
}
