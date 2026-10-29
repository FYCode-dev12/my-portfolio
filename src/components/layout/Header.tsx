import Link from "next/link";
import { CommandTrigger } from "@/components/interactive/CommandTrigger";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";
import { getCommandContext } from "@/lib/command-context";
import { FyGlyph } from "./FyGlyph";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

export async function Header() {
  const context = await getCommandContext();
  return (
    <header className="sticky top-0 z-40 bg-bg">
      <span aria-hidden="true" className="scroll-progress" />
      <Container className="flex flex-wrap items-center justify-between gap-x-4 py-2 sm:h-16 sm:flex-nowrap sm:py-0">
        <Link
          href="/"
          aria-label={`${site.shortName}, beranda`}
          className="brand-link -m-2 flex items-center gap-3 rounded-md p-2"
        >
          {/* `data-brand`: intro beranda (BrandIntro) mendarat tepat di logo ini. */}
          <span data-brand className="block">
            <FyGlyph />
          </span>
          {/* Nama hanya di tablet dan desktop; di ponsel baris header terlalu sempit. */}
          <span className="brand-name hidden text-[0.9375rem] font-semibold tracking-tight whitespace-nowrap text-fg md:block">
            {site.shortName}
          </span>
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
          <NavLinks items={site.nav} />
        </nav>
      </Container>
    </header>
  );
}
