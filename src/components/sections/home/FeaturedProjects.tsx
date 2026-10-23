import Image from "next/image";
import Link from "next/link";
import { workFrames } from "@/content/photos";
import type { Project } from "@/lib/content";
import { formatYearMonth } from "@/lib/format";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  const earliest = projects.map((p) => p.period.start).sort()[0];
  return (
    <section id="projects" aria-labelledby="projects-heading" className="section gutter">
      <div className="work-copy t-name reveal text-pretty">
        <h2 id="projects-heading">Proyek:</h2>{" "}
        <ul>
          {projects.map((project, index) => {
            const frame = workFrames[index % workFrames.length];
            return (
              <li key={project.slug}>
                <Link href={`/projects/${project.slug}`} className="work-name">
                  {project.title}
                </Link>
                <span className="work-frame" aria-hidden="true">
                  <Image
                    src={frame.src}
                    alt=""
                    fill
                    sizes="240px"
                    className="object-cover"
                    style={{ objectPosition: frame.position }}
                  />
                </span>
                {index < projects.length - 1 ? ", " : "."}{" "}
              </li>
            );
          })}
        </ul>
      </div>
      <p className="t-small reveal mt-10 max-w-[60ch] text-muted" style={{ "--i": 1 } as React.CSSProperties}>
        {projects.length} sistem web sejak {formatYearMonth(earliest)}.{" "}
        <Link href="/projects" className="link text-fg">
          Buka semua studi kasus
        </Link>
      </p>
    </section>
  );
}
