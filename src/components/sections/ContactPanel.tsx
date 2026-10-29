import { ArrowRight } from "lucide-react";
import { RakitListen } from "@/components/mascot/RakitListen";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Heading } from "@/components/ui/Heading";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

type Props = {
  cvHref?: string;
  /** Tingkat heading: 1 di halaman /contact, 2 di beranda. */
  level?: 1 | 2;
  /** Beranda: form di kiri, kartu kontak di kanan. /contact: satu kolom. */
  split?: boolean;
};

function host(url: string) {
  const u = new URL(url);
  return `${u.host}${u.pathname}`;
}

/**
 * Satu kolom isian yang membuka aplikasi email pengunjung (form `mailto:`, GET).
 * Tidak ada backend dan tidak ada data yang dikirim ke server situs ini.
 */
export function ContactPanel({ cvHref, level = 2, split = false }: Props) {
  const rows = [
    {
      label: "Email",
      value: (
        <a className="link-underline" href={`mailto:${site.links.email}`}>
          {site.links.email}
        </a>
      ),
    },
    {
      label: "GitHub",
      value: (
        <ExternalLink href={site.links.github} showIcon={false} className="text-fg">
          {host(site.links.github)}
        </ExternalLink>
      ),
    },
    {
      label: "LinkedIn",
      value: (
        <ExternalLink href={site.links.linkedin} showIcon={false} className="text-fg">
          {host(site.links.linkedin)}
        </ExternalLink>
      ),
    },
    ...(cvHref
      ? [
          {
            label: "CV",
            value: (
              <a className="link-underline" href={cvHref} download>
                cv.pdf (PDF)
              </a>
            ),
          },
        ]
      : []),
  ];

  const form = (
    <>
      <Heading
        level={level}
        look={3}
        id="contact-heading"
        className={cn(
          "reveal",
          split ? "text-3xl text-balance sm:text-[2.25rem]" : "text-2xl sm:text-[1.75rem]",
        )}
      >
        <span className="block text-muted">Butuh developer untuk tim Anda?</span>
        <span className="block">Tulis subjeknya, saya balas lewat email.</span>
      </Heading>
      <form
        action={`mailto:${site.links.email}`}
        method="get"
        className={cn("reveal", split ? "mt-10" : "mt-4")}
      >
        <RakitListen on="input" reaction={{ expression: "fokus", ms: 1600 }} />
        <div data-ui className="contact-field relative">
          <label htmlFor="contact-subject" className="sr-only">
            Subjek email
          </label>
          <input
            id="contact-subject"
            name="subject"
            required
            maxLength={120}
            placeholder="Mis. Tawaran magang fullstack"
            className="h-16 w-full rounded-md bg-fg pr-16 pl-5 text-base text-bg outline-none placeholder:text-bg/60 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
          />
          <button
            type="submit"
            aria-label="Buka aplikasi email dengan subjek ini"
            className="press absolute top-1/2 right-2.5 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-accent-fg"
          >
            <ArrowRight aria-hidden="true" className="size-5" />
          </button>
        </div>
        <p className="mt-4 text-[0.9375rem] text-muted">
          Tombol panah membuka aplikasi email Anda. Tidak ada data yang disimpan di situs ini.
        </p>
      </form>
    </>
  );

  if (!split) {
    return (
      <div className="mx-auto max-w-[34rem]">
        {form}
        <dl className="mt-16 space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="reveal grid gap-1 sm:grid-cols-[7rem_1fr]">
              <dt className="text-[0.9375rem] text-muted">{row.label}</dt>
              <dd className="text-fg">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  return (
    <div className="grid items-end gap-14 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-6">{form}</div>
      <div className="lg:col-span-5 lg:col-start-8">
        <div
          data-ui
          className="reveal overflow-hidden rounded-lg bg-surface font-mono text-[0.875rem] leading-6 text-muted"
        >
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3 text-[0.8125rem]">
            <span className="text-fg">kontak</span>
            <span>balasan lewat email</span>
          </div>
          <dl className="divide-y divide-border px-5">
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-[5.5rem_1fr] gap-x-4 py-3.5">
                <dt className="text-accent">{row.label.toLowerCase()}</dt>
                <dd className="min-w-0 truncate font-sans text-[0.9375rem] text-fg">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
