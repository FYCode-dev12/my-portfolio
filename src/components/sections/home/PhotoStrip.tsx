import Image from "next/image";
import { photos, type Photo } from "@/content/photos";

const order: Photo[] = [photos.itera, photos.petaTeluk, photos.petaKeyser, photos.pantai];

export function PhotoStrip({ skip }: { skip?: string }) {
  const items = order.filter((p) => p.src !== skip).slice(0, 3);
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3 md:gap-6">
      {items.map((photo, i) => (
        <div
          key={photo.src}
          className="zoom-in reveal relative aspect-[4/3] overflow-hidden rounded-lg bg-surface"
          style={{ "--i": i } as React.CSSProperties}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 768px) 31vw, 94vw"
            className="object-cover"
            style={{ objectPosition: photo.position }}
          />
        </div>
      ))}
    </div>
  );
}
