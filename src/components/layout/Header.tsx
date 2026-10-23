import Link from "next/link";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "./ThemeToggle";

const links = site.nav.filter((item) => item.href !== "/");

export function Header({ cvHref }: { cvHref?: string }) {
  return (
    <header className="gutter relative flex min-h-[var(--header-h)] items-center justify-between gap-4 py-3">
      <Link href="/" className="-ml-1 inline-flex min-h-11 whitespace-nowrap items-center px-1 text-lg font-semibold tracking-tight">
        {site.shortName}
      </Link>

      <nav
        aria-label="Navigasi utama"
        className="hidden lg:absolute lg:left-[42%] lg:block"
      >
        <ul className="flex items-center gap-8">
          {links.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="link inline-flex min-h-11 items-center">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-1 sm:gap-3">
        <details className="relative lg:hidden">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center px-3 font-medium [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <ul className="absolute right-0 top-full z-40 mt-1 hidden min-w-44 rounded-md bg-surface p-2 [details[open]>&]:block">
            {links.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="flex min-h-11 items-center rounded-md px-3 hover:bg-bg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </details>
        <ThemeToggle />
        {cvHref ? (
          <Button href={cvHref} download className="max-sm:hidden">
            Unduh CV
          </Button>
        ) : null}
      </div>
    </header>
  );
}
