import Image from "next/image";
import { site } from "@/content/site";
import { getProfilePhoto } from "@/lib/profile";

export function ProfileFrame() {
  const src = getProfilePhoto();
  if (src) {
    // Foto asli utuh dari kepala sampai kaki, tanpa crop (1080x1918).
    return (
      <Image
        src={src}
        alt={`Foto ${site.name}`}
        width={1080}
        height={1918}
        sizes="(min-width: 1024px) 20rem, 90vw"
        className="mx-auto h-auto w-full max-w-xs rounded-lg"
        priority
      />
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
