import type { Metadata } from "next";
import Image from "next/image";
import { PageTitle } from "@/components/ui/PageTitle";
import { SkillList } from "@/components/sections/about/SkillList";
import { AboutPhotos } from "@/components/sections/about/AboutPhotos";
import { Timeline } from "@/components/sections/about/Timeline";
import { achievements } from "@/content/achievements";
import { photos } from "@/content/photos";
import { site } from "@/content/site";
import { personJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Tentang",
  description:
    "Mahasiswa Teknik Informatika ITERA, fullstack web developer, dan Kepala Departemen CMIT PMK ITERA 2026.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const photo = photos.itera;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <section className="gutter pb-16 pt-10 sm:pt-16">
        <PageTitle lines={["Dari kode", "sampai tim."]} />
        <div className="mt-14 grid gap-12 lg:grid-cols-[34%_1fr] lg:gap-0">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface lg:mr-10">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 30vw, 94vw"
              className="object-cover"
              style={{ objectPosition: photo.position }}
              priority
            />
          </div>
          <div className="space-y-6">
            <p className="max-w-[40ch] text-[clamp(1.25rem,1.7vw+0.4rem,1.625rem)] leading-[1.4] tracking-[-0.01em]">
              Saya {site.name}, mahasiswa S1 Teknik Informatika di Institut Teknologi Sumatera
              (ITERA). Saya membangun sistem web untuk organisasi mahasiswa, dari form builder dan
              pemendek tautan sampai sistem identitas dengan login terpusat.
            </p>
            <p className="max-w-[48ch] text-lg text-muted">
              Di luar kode, saya memimpin departemen media, informasi, dan teknologi di PMK ITERA,
              mengajar sebagai asisten dosen, dan mengerjakan desain serta dokumentasi acara.
            </p>
          </div>
        </div>
      </section>

      <section id="skills" aria-labelledby="skills-heading" className="section gutter">
        <h2 id="skills-heading" className="t-head mb-14">
          Keahlian
        </h2>
        <SkillList />
      </section>

      <AboutPhotos />

      <section id="timeline" aria-labelledby="timeline-heading" className="section gutter pt-0 sm:pt-0">
        <h2 id="timeline-heading" className="t-head mb-14">
          Perjalanan
        </h2>
        <Timeline items={achievements} />
      </section>
    </>
  );
}
