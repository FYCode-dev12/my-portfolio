import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";

export function ContactCta() {
  return (
    <section aria-labelledby="cta-heading" className="cta-band relative min-h-[60svh]">
      <h2 id="cta-heading" className="sr-only">
        Kontak
      </h2>
      <a
        href={`mailto:${site.links.email}`}
        className="gutter flex min-h-[60svh] flex-col justify-between py-8 sm:py-10"
      >
        <span className="flex items-start justify-between gap-8">
          <span className="max-w-[28ch] text-lg leading-snug">
            Terbuka untuk magang dan kolaborasi pengembangan web.
          </span>
          <ArrowUpRight aria-hidden="true" className="cta-arrow size-12 shrink-0" strokeWidth={1.5} />
        </span>
        <span className="block text-[clamp(5rem,24vw,24rem)] font-medium leading-[0.8] tracking-[-0.055em]">
          Hubungi
        </span>
        <span className="sr-only">saya lewat email, {site.links.email}</span>
      </a>
    </section>
  );
}
