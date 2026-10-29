import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";
import { Heading } from "./Heading";

type SectionProps = Omit<ComponentPropsWithoutRef<"section">, "title"> & {
  title?: string;
  description?: string;
  /** Kursi Rakit (RakitSeat) di samping judul. */
  seat?: ReactNode;
};

export function Section({
  id,
  title,
  description,
  seat,
  className,
  children,
  ...props
}: SectionProps) {
  const headingId = id && title ? `${id}-heading` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("py-16 sm:py-24", className)}
      {...props}
    >
      <Container>
        {title ? (
          <header className="mb-10 max-w-2xl">
            <div className="flex items-end justify-between gap-6">
              <Heading level={2} id={headingId}>
                {title}
              </Heading>
              {seat}
            </div>
            {description ? <p className="mt-3 text-muted">{description}</p> : null}
          </header>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
