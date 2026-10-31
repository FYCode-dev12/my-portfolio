import Image from "next/image";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/cn";

type ProjectCoverProps = {
  project: Project;
  sizes: string;
  priority?: boolean;
  /** Tampilkan kotak pengganti bila proyek belum punya situs publik (menjaga tinggi kartu tetap rata). */
  placeholder?: boolean;
  className?: string;
};

/** Tangkapan layar halaman depan situs proyek (1440×900). Tidak dirender bila proyek tanpa `cover`. */
export function ProjectCover({
  project,
  sizes,
  priority = false,
  placeholder = false,
  className,
}: ProjectCoverProps) {
  if (!project.cover) {
    if (!placeholder) return null;
    return (
      <div
        className={cn(
          "flex aspect-[16/10] items-center justify-center rounded-md border border-dashed border-border bg-bg font-mono text-[0.8125rem] text-muted",
          className,
        )}
      >
        belum ada situs publik
      </div>
    );
  }
  const isDemo = project.status === "demo";
  return (
    <div
      className={cn(
        "relative aspect-[16/10] overflow-hidden rounded-md border border-border bg-bg",
        className,
      )}
    >
      <Image
        src={project.cover}
        alt={`Tangkapan layar ${project.title}${isDemo ? " versi demo" : ""}`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover object-top"
      />
    </div>
  );
}
