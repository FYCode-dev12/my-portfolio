import Link from "next/link";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <Container className="flex flex-wrap items-center justify-between gap-x-4 py-2 sm:h-16 sm:flex-nowrap sm:py-0">
        <Link href="/" className="font-mono text-sm font-medium text-fg">
          {site.shortName}
        </Link>
        <div className="order-2 sm:order-3">
          <ThemeToggle />
        </div>
        <nav aria-label="Navigasi utama" className="order-3 w-full sm:order-2 sm:ml-auto sm:w-auto">
          <ul className="flex items-center gap-1 sm:gap-2">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex h-10 items-center rounded-md px-3 text-sm text-muted transition-colors hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
