import Link from "next/link";
import { credits } from "@/content/photos";
import { site } from "@/content/site";

const cols = "grid gap-10 sm:grid-cols-2 lg:grid-cols-4";

export function Footer({ cvHref }: { cvHref?: string }) {
  return (
    <footer className="site-footer gutter flex min-h-[80svh] flex-col justify-between gap-16 pt-16 pb-6 sm:pt-24">
      <div className={cols}>
        <nav aria-label="Halaman">
          <p className="font-semibold">Halaman</p>
          <ul className="mt-3 space-y-1">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link inline-flex min-h-11 items-center">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="font-semibold">Hubungi</p>
          <ul className="mt-3 space-y-1">
            <li>
              <a href={`mailto:${site.links.email}`} className="link inline-flex min-h-11 items-center break-all">
                {site.links.email}
              </a>
            </li>
            <li>
              <a href={site.links.github} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center">
                GitHub<span className="sr-only"> (buka di tab baru)</span>
              </a>
            </li>
            <li>
              <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center">
                LinkedIn<span className="sr-only"> (buka di tab baru)</span>
              </a>
            </li>
            {cvHref ? (
              <li>
                <a href={cvHref} download className="link inline-flex min-h-11 items-center">
                  Unduh CV
                </a>
              </li>
            ) : null}
          </ul>
        </div>
        <div>
          <p className="font-semibold">Dibuat dengan</p>
          <p className="mt-3 max-w-[28ch]">Next.js, TypeScript, dan Tailwind CSS. Huruf: Hanken Grotesk.</p>
        </div>
        <div>
          <p className="font-semibold">Foto</p>
          <ul className="mt-3 space-y-2 text-[0.8125rem] leading-snug opacity-85">
            {credits.map((credit) => (
              <li key={credit.page}>
                <a href={credit.page} target="_blank" rel="noopener noreferrer" className="link">
                  {credit.title}
                </a>
                , {credit.creator},{" "}
                <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="link">
                  {credit.license}
                </a>
                , via Wikimedia Commons
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="@container">
        <p
          aria-hidden="true"
          className="whitespace-nowrap font-medium leading-[0.85] tracking-[-0.05em] text-[19.8cqw]"
        >
          {site.shortName}
        </p>
        <p className="mt-4 text-[0.8125rem] opacity-85">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
