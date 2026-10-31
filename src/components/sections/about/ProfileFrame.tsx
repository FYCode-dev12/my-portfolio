import Image from "next/image";
import { site } from "@/content/site";
import { getProfilePhoto } from "@/lib/profile";

// Pusat lingkaran pada 58,5% tinggi bingkai 4:5; jari-jari 47% lebar (= 37,6% tinggi).
const PHOTO_MASK: React.CSSProperties = {
  maskImage:
    "linear-gradient(#000, #000), radial-gradient(ellipse 47% 37.6% at 50% 58.5%, #000 99.5%, transparent 100%)",
  maskSize: "100% 58.5%, 100% 100%",
  maskPosition: "top, center",
  maskRepeat: "no-repeat",
};

export function ProfileFrame() {
  const src = getProfilePhoto();
  if (src) {
    return (
      // Lingkaran di belakang badan. Setengah atas foto bebas (kepala boleh keluar dari
      // lingkaran), setengah bawah dipotong mengikuti lingkaran lewat dua lapis mask.
      <div className="relative mx-auto aspect-[4/5] w-full max-w-xs">
        <div
          aria-hidden="true"
          className="absolute inset-x-[3%] bottom-[4%] aspect-square rounded-full bg-linear-to-b from-accent/30 to-surface"
        />
        <div className="absolute inset-0" style={PHOTO_MASK}>
          <Image
            src={src}
            alt={`Foto ${site.name}`}
            fill
            sizes="(min-width: 1024px) 20rem, 90vw"
            className="object-cover"
            style={{ objectPosition: "50% 25%" }}
            priority
          />
        </div>
      </div>
    );
  }
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-lg bg-surface">
      <svg
        viewBox="0 0 100 125"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
        className="absolute inset-0 size-full text-border-strong opacity-70"
      >
        <circle cx="50" cy="48" r="17" fill="currentColor" />
        <path d="M10 125C10 92 28 76 50 76s40 16 40 49Z" fill="currentColor" />
      </svg>
    </div>
  );
}
