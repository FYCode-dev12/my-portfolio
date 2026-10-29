import { RakitListen } from "@/components/mascot/RakitListen";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import type { Project } from "@/lib/content";

type Figure = { label: string; value: number };

/** "Migrasi SQL" → "migrasi SQL", tanpa merusak akronim di awal ("ADR ..."). */
function unit(label: string) {
  return /^[A-Z]{2}/.test(label) ? label : label.charAt(0).toLowerCase() + label.slice(1);
}

function numericMetrics(project: Project): Figure[] {
  return project.metrics
    .filter((m) => /^\d+$/.test(m.value))
    .map((m) => ({ label: m.label, value: Number(m.value) }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Angka besar dipilih pengunjung lewat kontrol proyek. Murni CSS (radio + :has), tanpa JS.
 * Hanya metrik bernilai bulat dari frontmatter yang dipakai; tidak ada angka tambahan.
 */
export function RepoFigures({ projects }: { projects: Project[] }) {
  const items = projects
    .map((project) => ({ project, figures: numericMetrics(project) }))
    .filter((item) => item.figures.length > 0);
  if (items.length === 0) return null;

  const css = items
    .map(
      ({ project }) =>
        `.figures:has(#fig-${project.slug}:checked) [data-fig="${project.slug}"]{display:grid}`,
    )
    .join("");

  return (
    <section aria-labelledby="figures-heading" className="figures bg-surface">
      <style>{css}</style>
      <Container className="flex min-h-[72svh] flex-col py-20 sm:py-28">
        <Heading level={2} id="figures-heading" className="rise text-3xl sm:text-[2.5rem]">
          Seberapa besar tiap sistem?
        </Heading>
        {/* Jatuhkan Rakit di sebuah tab untuk memilihnya; ia melompat setiap tab berganti. */}
        <div className="mt-8">
          <fieldset data-ui className="reveal max-w-full">
            <legend className="sr-only">Pilih proyek</legend>
            <RakitListen on="change" reaction={{ act: "lompat" }} />
            <div className="flex flex-wrap gap-1 rounded-md bg-bg p-1">
              {items.map(({ project }, i) => (
                <span key={project.slug}>
                  <input
                    type="radio"
                    name="figure-project"
                    id={`fig-${project.slug}`}
                    defaultChecked={i === 0}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={`fig-${project.slug}`}
                    data-rakit-drop="click"
                    className="press inline-flex h-11 cursor-pointer items-center rounded-sm px-4 font-mono text-[0.875rem] text-muted transition-colors peer-checked:bg-accent peer-checked:text-accent-fg peer-focus-visible:outline-2 peer-focus-visible:outline-accent hover:text-fg"
                  >
                    {project.slug}
                  </label>
                </span>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="mt-auto pt-16">
          {items.map(({ project, figures }, i) => {
            const [main, ...rest] = figures;
            const all = figures.map((f) => `${f.value} ${unit(f.label)}`);
            return (
              <div
                key={project.slug}
                data-fig={project.slug}
                data-first={i === 0 || undefined}
                className="fig-panel hidden items-end gap-8 lg:grid-cols-[1fr_auto]"
              >
                <p className="fig-number font-semibold leading-[0.8] tracking-tight text-fg tabular-nums">
                  {main.value}
                  <span className="ml-[0.14em] text-[0.14em] font-medium tracking-normal text-muted">
                    {unit(main.label)}
                  </span>
                </p>
                <p className="max-w-[30ch] pb-2 text-[1.0625rem] text-fg">
                  {project.title}:{" "}
                  {rest.length > 0 ? `${all.slice(0, -1).join(", ")} dan ${all.at(-1)}` : all[0]},
                  dihitung dari repositorinya.
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
