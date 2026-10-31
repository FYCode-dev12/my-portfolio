import Link from "next/link";
import { LocalClock } from "@/components/interactive/LocalClock";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";

const tile = "rounded-lg bg-surface p-6 sm:p-7";

export function Footer() {
  return (
    <footer className="pb-5 sm:pb-8">
      <Container className="grid grid-cols-2 gap-2 lg:grid-cols-12">
        <div
          className={`${tile} col-span-2 flex flex-col justify-between gap-8 sm:min-h-56 lg:col-span-4`}
        >
          <p className="max-w-[26ch] text-2xl leading-snug text-fg">
            Sistem web untuk organisasi, dirilis dan dirawat.
          </p>
          <div className="space-y-2 text-[0.9375rem] text-muted">
            <p>Dibangun dengan Next.js, TypeScript, dan Tailwind CSS.</p>
          </div>
        </div>
        <nav aria-label="Navigasi footer" className={`${tile} sm:min-h-56 lg:col-span-2`}>
          <ul className="space-y-1">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-10 items-center text-fg hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={`${tile} flex flex-col justify-between gap-6 sm:min-h-56 lg:col-span-2`}>
          <p className="text-muted">Lampung Selatan</p>
          <p className="font-mono text-2xl text-fg">
            <LocalClock />
          </p>
        </div>
        <div
          className={`${tile} col-span-2 flex flex-col justify-between gap-6 sm:min-h-56 lg:col-span-4`}
        >
          <p className="text-muted">Email</p>
          <a
            href={`mailto:${site.links.email}`}
            className="text-lg text-fg sm:text-xl underline-offset-4 hover:text-accent hover:underline"
          >
            {site.links.email}
          </a>
        </div>
        <div
          aria-hidden="true"
          className="footer-wordmark col-span-2 flex min-h-40 items-center justify-center rounded-lg bg-fg px-6 text-bg lg:col-span-8 lg:min-h-80"
        >
          <span className="wordmark font-mono text-[13vw] leading-none font-semibold tracking-tighter sm:text-[11vw] lg:text-[6.5rem]">
            febrian<span className="text-accent">_</span>
          </span>
        </div>
        <Link
          href="/contact"
          className="footer-cta press group col-span-2 flex min-h-44 flex-col justify-between rounded-lg bg-accent p-6 text-accent-fg sm:p-7 lg:col-span-4 lg:min-h-80"
        >
          <span className="text-[1.75rem] leading-tight font-semibold">Ajak saya ngobrol</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 48 48"
            className="size-14 self-end transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          >
            <path d="M10 38 38 10M16 10h22v22" fill="none" stroke="currentColor" strokeWidth="4" />
          </svg>
        </Link>
      </Container>
    </footer>
  );
}
