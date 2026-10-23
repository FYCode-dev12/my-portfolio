import { cn } from "@/lib/cn";
import { stagger } from "@/lib/style";

type PageTitleProps = {
  /** Satu entri per baris judul. Dua baris paling banyak. */
  lines: [string] | [string, string];
  className?: string;
  size?: "display" | "poster";
};

export function PageTitle({ lines, className, size = "display" }: PageTitleProps) {
  return (
    <h1 className={cn(size === "poster" ? "t-poster" : "t-display", className)}>
      <span className="sr-only">{lines.join(" ")}</span>
      {lines.map((line, i) => (
        <span key={line} className="line" aria-hidden="true">
          <span style={stagger(i)}>{line}</span>
        </span>
      ))}
    </h1>
  );
}
