import Image from "next/image";
import { Heading } from "@/components/ui/Heading";
import type { Project } from "@/lib/content";

/** Tangkapan layar alur utama di luar halaman depan (1440×900). Tidak dirender bila galeri kosong. */
export function ProjectGallery({ project }: { project: Project }) {
  if (project.gallery.length === 0) return null;
  const headingId = `gallery-${project.slug}`;
  return (
    <section aria-labelledby={headingId} className="mt-24">
      <Heading level={2} look={3} id={headingId}>
        Tangkapan layar
      </Heading>
      <ul className="mt-6 grid gap-8 md:grid-cols-2">
        {project.gallery.map((shot) => (
          <li key={shot.src}>
            <figure>
              <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-border bg-bg">
                <Image
                  src={shot.src}
                  alt={shot.caption}
                  fill
                  sizes="(min-width: 768px) 45vw, 94vw"
                  className="object-cover object-top"
                />
              </div>
              <figcaption className="mt-3 text-sm text-muted">{shot.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
