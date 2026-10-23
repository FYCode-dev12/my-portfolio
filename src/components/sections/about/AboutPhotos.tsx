import Image from "next/image";
import { photos, type Photo } from "@/content/photos";

function Frame({ photo, className, sizes }: { photo: Photo; className: string; sizes: string }) {
  return (
    <div className={`zoom-in relative overflow-hidden rounded-lg bg-surface ${className}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition: photo.position }}
      />
    </div>
  );
}

export function AboutPhotos() {
  return (
    <div className="gutter section">
      <div className="grid gap-4 md:grid-cols-12 md:gap-6">
        <Frame photo={photos.petaTeluk} className="aspect-[4/5] md:col-span-4 md:aspect-auto md:min-h-[26rem]" sizes="(min-width: 768px) 32vw, 94vw" />
        <Frame photo={photos.pantai} className="aspect-[3/2] md:col-span-8 md:aspect-auto md:min-h-[26rem]" sizes="(min-width: 768px) 62vw, 94vw" />
        <Frame photo={photos.itera} className="aspect-[4/3] md:col-span-8 md:aspect-auto md:min-h-[26rem]" sizes="(min-width: 768px) 62vw, 94vw" />
        <Frame photo={photos.petaKeyser} className="aspect-[4/5] md:col-span-4 md:aspect-auto md:min-h-[26rem]" sizes="(min-width: 768px) 32vw, 94vw" />
      </div>
    </div>
  );
}
