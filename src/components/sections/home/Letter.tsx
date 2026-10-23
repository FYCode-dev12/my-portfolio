import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { site } from "@/content/site";
import type { Project } from "@/lib/content";
import { getProfilePhoto } from "@/lib/profile";

function Portrait() {
  const src = getProfilePhoto();
  return (
    <span className="relative block size-12 overflow-hidden rounded-full bg-surface">
      {src ? (
        <Image src={src} alt="" fill sizes="48px" className="object-cover" />
      ) : (
        <svg
          viewBox="0 0 100 100"
          aria-hidden="true"
          className="absolute inset-0 size-full text-border-strong"
        >
          <circle cx="50" cy="40" r="17" fill="currentColor" />
          <path d="M14 100c0-24 16-36 36-36s36 12 36 36Z" fill="currentColor" />
        </svg>
      )}
    </span>
  );
}

/** Surat singkat orang pertama. Semua fakta berasal dari AGENTS.md bagian 5 dan studi kasus. */
export function Letter({ projects }: { projects: Project[] }) {
  const live = projects.filter((p) => p.status === "live").length;
  const building = projects.filter((p) => p.status === "in-progress").length;
  return (
    <section aria-labelledby="letter-heading" className="py-28 sm:py-36">
      <Container size="narrow">
        <div className="mx-auto max-w-[34rem]">
          <div className="reveal flex items-center gap-4">
            <Portrait />
            <Heading level={2} look={3} id="letter-heading">
              Halo, saya Febrian
            </Heading>
          </div>
          <div className="mt-8 space-y-6 text-[1.0625rem] leading-[1.6] text-fg">
            <p className="reveal">
              Saya mulai menulis kode di SMK jurusan Rekayasa Perangkat Lunak, lalu melanjutkan ke
              Teknik Informatika ITERA pada 2024.
            </p>
            <p className="reveal">
              Yang saya bangun lahir dari kebutuhan organisasi kampus: form rekrutmen, arsip bahan
              ibadah, pemendek tautan, dan login terpusat.{" "}
              <mark className="rounded-sm bg-accent px-1 text-accent-fg">{live} sudah live</mark>
              {building > 0 ? `, ${building} masih dikerjakan.` : "."}
            </p>
            <p className="reveal">
              Sejak Februari 2026 saya memimpin departemen yang mengurus media, informasi, dan
              teknologi, dan menjadi asisten dosen Pengenalan Komputasi.
            </p>
            <p className="reveal">
              Di luar kode saya memotret, merekam, dan menyunting video acara. Dari situ saya
              terbiasa memikirkan tampilan, bukan hanya API.
            </p>
            <p className="reveal">
              Sekarang saya mencari tempat magang sebagai fullstack web developer.
            </p>
          </div>
          <p className="reveal mt-10 text-[1.375rem] font-medium text-fg">{site.shortName}</p>
          <p className="reveal text-sm text-muted">{site.role}, Teknik Informatika ITERA</p>
        </div>
      </Container>
    </section>
  );
}
