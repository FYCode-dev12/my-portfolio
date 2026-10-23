import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ScrollSpy } from "@/components/interactive/ScrollSpy";
import { skillGroups } from "@/content/skills";

const ROOT_ID = "stack";

/** Fragmen `stack.json` dipaku di satu sisi; tiap pernyataan menyorot kuncinya saat dibaca. */
export function SkillsStack() {
  return (
    <section id={ROOT_ID} aria-labelledby="stack-heading" className="bg-surface py-28 sm:py-40">
      <ScrollSpy rootId={ROOT_ID} />
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Heading level={2} id="stack-heading" className="reveal">
              Stack yang saya pakai
            </Heading>
            <p
              className="reveal mt-4 max-w-[40ch] text-muted"
              style={{ "--d": 1 } as React.CSSProperties}
            >
              Teknologi web diambil dari repositori proyek di atas. Desain dan media dari
              dokumentasi acara.
            </p>
            <ul className="mt-16 space-y-24 lg:space-y-[34vh] lg:pb-[20vh]">
              {skillGroups.map((group) => (
                <li key={group.id} data-step={group.key} className="stack-step reveal">
                  <Heading level={3} look={2}>
                    {group.title}
                  </Heading>
                  <p className="mt-4 max-w-[38ch] text-lg leading-relaxed text-fg">
                    {group.summary}
                  </p>
                  {group.note ? <p className="mt-3 text-muted">{group.note}</p> : null}
                </li>
              ))}
            </ul>
            <p className="mt-16">
              <Link href="/about#skills" className="link-arrow text-accent">
                Rincian keahlian <span aria-hidden="true">→</span>
              </Link>
            </p>
          </div>
          <div className="lg:col-span-7">
            <figure className="lg:sticky lg:top-28">
              <div
                data-ui
                className="overflow-hidden rounded-lg bg-bg font-mono text-[0.875rem] leading-7 text-muted"
              >
                <div className="flex items-center justify-between border-b border-border px-5 py-3 text-[0.8125rem]">
                  <span className="text-fg">stack.json</span>
                  <span>{skillGroups.reduce((n, g) => n + g.items.length, 0)} entri</span>
                </div>
                <pre className="whitespace-pre-wrap px-5 py-4">
                  <code>
                    <span>{"{"}</span>
                    {skillGroups.map((group, gi) => (
                      <span key={group.id} data-target={group.key} className="stack-key block pl-4">
                        <span className="text-accent">&quot;{group.key}&quot;</span>: [
                        <span className="text-fg">
                          {group.items.map((item) => `"${item}"`).join(", ")}
                        </span>
                        ]{gi < skillGroups.length - 1 ? "," : ""}
                      </span>
                    ))}
                    <span>{"}"}</span>
                  </code>
                </pre>
              </div>
              <figcaption className="mt-3 text-sm text-muted">
                Bagian yang sedang dibaca disorot.
              </figcaption>
            </figure>
          </div>
        </div>
      </Container>
    </section>
  );
}
