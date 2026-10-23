import Image from "next/image";
import { site } from "@/content/site";
import { getProfilePhoto } from "@/lib/profile";

export function ProfileFrame() {
  const src = getProfilePhoto();
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-lg border border-border bg-surface">
      {src ? (
        <Image
          src={src}
          alt={`Foto ${site.name}`}
          fill
          sizes="(min-width: 1024px) 20rem, 90vw"
          className="object-cover"
          style={{ objectPosition: "50% 25%" }}
          priority
        />
      ) : (
        <svg
          viewBox="0 0 100 125"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
          className="absolute inset-0 size-full text-border-strong opacity-70"
        >
          <circle cx="50" cy="48" r="17" fill="currentColor" />
          <path d="M10 125C10 92 28 76 50 76s40 16 40 49Z" fill="currentColor" />
        </svg>
      )}
    </div>
  );
}
