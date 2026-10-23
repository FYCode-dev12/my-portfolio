import Image from "next/image";
import { photos, type Photo } from "@/content/photos";

function Frame({
  photo,
  className,
  sizes,
  drift = false,
}: {
  photo: Photo;
  className: string;
  sizes: string;
  drift?: boolean;
}) {
  return (
    <div className={`zoom-in relative overflow-hidden rounded-lg bg-surface ${className}`}>
      <div className={drift ? "drift absolute inset-0" : "absolute inset-0"}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition: photo.position }}
        />
      </div>
    </div>
  );
}

export function PhotoBand() {
  return (
    <div className="gutter section pt-0">
      <div className="grid gap-4 md:grid-cols-12 md:gap-6">
        <Frame photo={photos.itera} className="aspect-[4/3] md:col-span-7" sizes="(min-width: 768px) 58vw, 94vw" />
        <Frame photo={photos.petaKeyser} className="aspect-[4/5] md:col-span-5 md:aspect-auto md:min-h-[24rem]" sizes="(min-width: 768px) 40vw, 94vw" />
        <Frame photo={photos.petaTeluk} className="aspect-[4/5] md:col-span-5 md:aspect-auto md:min-h-[22rem]" sizes="(min-width: 768px) 40vw, 94vw" />
        <Frame photo={photos.pantai} drift className="aspect-[3/2] md:col-span-7" sizes="(min-width: 768px) 58vw, 94vw" />
      </div>
    </div>
  );
}
