import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";
import { Heading } from "./Heading";

type SectionProps = Omit<ComponentPropsWithoutRef<"section">, "title"> & {
  title?: string;
  description?: string;
};

export function Section({ id, title, description, className, children, ...props }: SectionProps) {
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
            <Heading level={2} id={headingId}>
              {title}
            </Heading>
            {description ? <p className="mt-3 text-muted">{description}</p> : null}
          </header>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
