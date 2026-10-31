import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Terminal } from "@/components/interactive/Terminal";
import type { CommandContext } from "@/components/interactive/command-data";
import { site } from "@/content/site";
import { skillGroups } from "@/content/skills";

/** Fakta ringkas di bawah tombol hero. Semua dari AGENTS.md bagian 5 dan frontmatter proyek. */
function heroFacts(context: CommandContext) {
  const live = context.projects.filter((p) => p.status === "live").length;
  return [
    { value: `${live} sistem`, label: "live dan bisa dibuka" },
    { value: "Kepala CMIT", label: "BPH PMK ITERA 2026" },
    { value: "Asisten dosen", label: "Pengenalan Komputasi" },
  ];
}

export function Hero({ context }: { context: CommandContext }) {
  return (
    <section aria-labelledby="hero-heading" className="pt-10 pb-20 sm:pt-16 sm:pb-28">
      <Container>
        <h1 id="hero-heading" className="lines display hero-exit text-fg">
          <span className="line">
            <span data-line style={{ "--i": 0 } as React.CSSProperties}>
              Febrian Yoel,
            </span>
          </span>
          <span className="line">
            <span data-line style={{ "--i": 1 } as React.CSSProperties}>
              fullstack developer
            </span>
          </span>
        </h1>
        <div className="mt-10 grid gap-12 lg:mt-12 lg:grid-cols-12 lg:gap-8">
          <div className="after-lines lg:col-span-5">
            <p className="max-w-[34ch] text-lg leading-relaxed text-fg sm:text-xl">
              Saya membangun dan merilis sistem web untuk organisasi kampus dengan React dan
              TypeScript, sekaligus memimpin tim IT-nya.
            </p>
            <p className="mt-4 max-w-[40ch] text-muted">
              Mahasiswa Teknik Informatika ITERA. Terminalnya sungguhan: coba ketik{" "}
              <code className="font-mono text-fg">proyek</code>, seret Rakit ke dalamnya, atau tekan{" "}
              <kbd className="font-mono text-fg">Ctrl K</kbd>.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button href="/projects">Lihat proyek</Button>
              {context.cvHref ? (
                <Button href={context.cvHref} variant="secondary" download>
                  Unduh CV
                </Button>
              ) : null}
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-border pt-6">
              {heroFacts(context).map((fact) => (
                <div key={fact.value} className="flex flex-col-reverse justify-end">
                  <dt className="mt-1 text-sm leading-snug text-muted">{fact.label}</dt>
                  <dd className="text-base leading-tight font-semibold tracking-tight text-fg sm:text-xl">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="hero-visual after-lines lg:col-span-7">
            {/* Rakit bereaksi pada setiap perintah terminal selama terminal terlihat. */}
            <Terminal
              name={site.name}
              role={site.role}
              campus="Teknik Informatika ITERA"
              skills={skillGroups.map((g) => ({ key: g.key, items: g.items }))}
              context={context}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
