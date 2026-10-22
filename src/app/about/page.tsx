import type { Metadata } from "next";
import { SkillGroups } from "@/components/sections/about/SkillGroups";
import { Timeline } from "@/components/sections/about/Timeline";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { achievements } from "@/content/achievements";
import { site } from "@/content/site";
import { personJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tentang",
  description:
    "Mahasiswa Teknik Informatika ITERA, fullstack web developer, dan Kepala Departemen CMIT PMK ITERA 2026.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <Container className="pt-16 sm:pt-24">
        <Heading level={1}>Tentang</Heading>
        <div className="mt-6 max-w-2xl space-y-4 text-lg text-muted">
          <p>
            Saya {site.name}, mahasiswa S1 Teknik Informatika di Institut Teknologi Sumatera
            (ITERA). Saya membangun sistem web untuk organisasi mahasiswa, dari form builder dan
            pemendek tautan sampai sistem identitas dengan login terpusat.
          </p>
          <p>
            Di luar kode, saya memimpin departemen media, informasi, dan teknologi di PMK ITERA,
            mengajar sebagai asisten dosen, dan mengerjakan desain serta dokumentasi acara.
          </p>
        </div>
      </Container>
      <Section id="skills" title="Keahlian">
        <SkillGroups />
      </Section>
      <Section id="timeline" title="Perjalanan" className="pt-0 sm:pt-0">
        <Timeline items={achievements} />
      </Section>
    </>
  );
}
