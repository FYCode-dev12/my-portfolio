import type { Metadata } from "next";
import Image from "next/image";
import { PhotoStrip } from "@/components/sections/home/PhotoStrip";
import { PageTitle } from "@/components/ui/PageTitle";
import { photos } from "@/content/photos";
import { Button } from "@/components/ui/Button";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { site } from "@/content/site";
import { stagger } from "@/lib/style";
import { getCvHref } from "@/lib/cv";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Email, GitHub, dan LinkedIn Febrian Yoel Anggara Saputra.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const cvHref = getCvHref();
  return (
    <div className="gutter pb-24 pt-10 sm:pt-16">
      <PageTitle lines={["Kirim", "email dulu."]} />
      <div className="mt-14 grid gap-12 lg:grid-cols-[34%_1fr] lg:gap-0">
        <p className="reveal max-w-[34ch] text-muted lg:pr-10">
          Cara tercepat menghubungi saya adalah lewat email. Saya biasanya membalas dalam beberapa
          hari.
        </p>
        <div className="reveal" style={stagger(1)}>
          <p>
            <a
              href={`mailto:${site.links.email}`}
              className="link break-all text-[clamp(1.5rem,3.6vw,3.25rem)] font-medium leading-tight tracking-[-0.03em]"
            >
              {site.links.email}
            </a>
          </p>
          <ul className="mt-8 space-y-1">
            <li>
              <ExternalLink href={site.links.github}>github.com/FYCode-dev12</ExternalLink>
            </li>
            <li>
              <ExternalLink href={site.links.linkedin}>linkedin.com/in/febrianyoel</ExternalLink>
            </li>
          </ul>
          {cvHref ? (
            <div className="mt-10">
              <Button href={cvHref} download>
                Unduh CV (PDF)
              </Button>
            </div>
          ) : null}
        </div>
      </div>
      <div className="zoom-in reveal relative mt-20 aspect-[16/7] overflow-hidden rounded-lg bg-surface">
        <Image
          src={photos.pantai.src}
          alt={photos.pantai.alt}
          fill
          sizes="94vw"
          priority
          className="object-cover"
          style={{ objectPosition: photos.pantai.position }}
        />
      </div>
      <PhotoStrip skip={photos.pantai.src} />
    </div>
  );
}
