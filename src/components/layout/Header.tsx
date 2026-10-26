import Link from "next/link";
import { CommandTrigger } from "@/components/interactive/CommandTrigger";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";
import { getCommandContext } from "@/lib/command-context";
import { BrandMark } from "./BrandMark";
import { ThemeToggle } from "./ThemeToggle";

export async function Header() {
  const context = await getCommandContext();
  return (
    <header className="sticky top-0 z-40 bg-bg">
      <Container className="flex flex-wrap items-center justify-between gap-x-4 py-2 sm:h-16 sm:flex-nowrap sm:py-0">
        <Link
          href="/"
          aria-label={`${site.shortName}, beranda`}
          data-brand
          className="font-mono text-[0.9375rem] font-medium text-fg"
        >
          <BrandMark />
        </Link>
        <div className="order-2 flex items-center gap-2 sm:order-3">
          <div className="hidden sm:block">
            <CommandTrigger context={context} />
          </div>
          <ThemeToggle />
        </div>
        <nav
          aria-label="Navigasi utama"
          className="order-3 -mx-3 w-full sm:order-2 sm:mx-0 sm:ml-auto sm:w-auto"
        >
          <ul className="flex items-center gap-1">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="nav-link inline-flex h-10 items-center rounded-md px-3 text-[0.9375rem] text-muted transition-colors hover:text-fg"
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
