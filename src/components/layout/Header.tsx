import Link from "next/link";
import { CommandTrigger } from "@/components/interactive/CommandTrigger";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";
import { getCommandContext } from "@/lib/command-context";
import { FyGlyph } from "./FyGlyph";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

export async function Header() {
  const context = await getCommandContext();
  return (
    // Tinggi header tetap; saat digulir hanya bilah kacanya yang menyempit dan turun (tanpa CLS).
    // `data-rakit-floor`: Rakit bisa berdiri di atas bilah ini.
    <header className="site-header sticky top-0 z-40">
      <div data-rakit-floor="" className="nav-shell">
        <span aria-hidden="true" className="scroll-progress" />
        <Container className="flex h-14 items-center justify-between gap-x-4 sm:h-16">
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
          {/* Mulai `sm` tautan tampil sebaris; di ponsel pindah ke menu hamburger (MobileNav). */}
          <nav aria-label="Navigasi utama" className="ml-auto hidden sm:block">
            <NavLinks items={site.nav} />
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <CommandTrigger context={context} />
            </div>
            <ThemeToggle />
            <MobileNav items={site.nav} />
          </div>
        </Container>
      </div>
    </header>
  );
}
