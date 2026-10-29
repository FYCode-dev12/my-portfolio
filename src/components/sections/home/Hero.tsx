import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Terminal } from "@/components/interactive/Terminal";
import { Mascot } from "@/components/mascot/Mascot";
import type { CommandContext } from "@/components/interactive/command-data";
import { site } from "@/content/site";
import { skillGroups } from "@/content/skills";

export function Hero({ context }: { context: CommandContext }) {
  return (
    <section aria-labelledby="hero-heading" className="pt-12 pb-28 sm:pt-20 sm:pb-40">
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
        <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-8">
          <div className="after-lines lg:col-span-5">
            <p className="max-w-[34ch] text-lg leading-relaxed text-fg sm:text-xl">
              Saya membangun dan merilis sistem web untuk organisasi kampus dengan React dan
              TypeScript, sekaligus memimpin tim IT-nya.
            </p>
            <p className="mt-4 max-w-[40ch] text-muted">
              Mahasiswa Teknik Informatika ITERA. Terminalnya sungguhan: coba ketik{" "}
              <code className="font-mono text-fg">proyek</code> atau tekan{" "}
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
          </div>
          <div className="hero-visual after-lines lg:col-span-7">
            {/* Tepi atas terminal jadi pijakan Rakit: ruang 80 px dicadangkan agar tidak ada CLS.
                Kaki ada di y=158 dari viewBox 168, jadi di tinggi 84 px telapak kaki jatuh di 79 px. */}
            <div className="relative pt-20">
              <Mascot className="absolute top-px right-6 z-10 h-[84px] w-16" />
              <Terminal
                name={site.name}
                role={site.role}
                campus="Teknik Informatika ITERA"
                skills={skillGroups.map((g) => ({ key: g.key, items: g.items }))}
                context={context}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
