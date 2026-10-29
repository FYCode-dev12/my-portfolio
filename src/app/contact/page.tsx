import type { Metadata } from "next";
import Image from "next/image";
import { RakitCue } from "@/components/mascot/RakitCue";
import { ContactPanel } from "@/components/sections/ContactPanel";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { photos } from "@/content/photos";
import { getCvHref } from "@/lib/cv";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Email, GitHub, dan LinkedIn Febrian Yoel Anggara Saputra.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const map = photos.petaTeluk;
  return (
    <Container className="py-16 sm:py-24">
      <Heading level={1}>Kontak</Heading>
      <RakitCue act="lambai" say="Mau ngobrol? Tulis subjeknya, nanti dibalas lewat email." />
      <p className="mt-6 max-w-[44ch] text-lg text-muted">
        Cara tercepat menghubungi saya adalah lewat email. Saya biasanya membalas dalam beberapa
        hari.
      </p>
      <div className="mt-20 grid items-start gap-16 sm:mt-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <ContactPanel cvHref={getCvHref()} />
        </div>
        <figure className="reveal lg:col-span-5 lg:col-start-8">
          <div className="drift-frame relative aspect-[4/5] overflow-clip rounded-lg bg-surface">
            <Image
              src={map.src}
              alt={map.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 92vw"
              className="drift object-cover"
              style={{ objectPosition: map.position }}
            />
          </div>
          <figcaption className="mt-3 text-sm text-muted">
            Teluk Lampung pada peta pelayaran 1774. Saya berbasis di Lampung Selatan, zona WIB.
          </figcaption>
        </figure>
      </div>
    </Container>
  );
}
