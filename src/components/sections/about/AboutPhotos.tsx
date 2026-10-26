import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { photos, type Photo } from "@/content/photos";

const items: Photo[] = [photos.itera, photos.pantai, photos.petaTeluk, photos.petaKeyser];

export function AboutPhotos() {
  return (
    <Section
      id="lampung"
      title="Dari Lampung"
      description="Kampus dan pesisir tempat saya belajar dan tumbuh. Foto dan peta arsip berlisensi terbuka, kreditnya ada di footer."
      className="pt-0 sm:pt-0"
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((photo) => (
          <li
            key={photo.src}
            className="reveal relative aspect-[4/5] overflow-hidden rounded-lg bg-surface"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 90vw"
              className="object-cover"
              style={{ objectPosition: photo.position }}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
