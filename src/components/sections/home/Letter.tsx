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
        // Foto profil sampai pinggang: perbesar ke arah wajah agar terbaca di ukuran 48px.
        <Image
          src={src}
          alt=""
          fill
          sizes="96px"
          className="scale-200 object-cover"
          style={{ objectPosition: "50% 0%", transformOrigin: "50% 40%" }}
        />
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

/** Kartu profil di samping surat. Semua baris dari AGENTS.md bagian 5. */
const PROFILE = [
  { key: "kampus", value: "S1 Teknik Informatika, ITERA", note: "Mei 2024 – sekarang" },
  { key: "peran", value: "Kepala Departemen CMIT", note: "BPH PMK ITERA 2026" },
  { key: "mengajar", value: "Asisten Dosen", note: "Pengenalan Komputasi" },
  { key: "sekolah", value: "SMK Pangudi Luhur Seputih Mataram", note: "Rekayasa Perangkat Lunak" },
  { key: "lokasi", value: "Lampung Selatan", note: "WIB" },
] as const;

/** Surat singkat orang pertama. Semua fakta berasal dari AGENTS.md bagian 5 dan studi kasus. */
export function Letter({ projects }: { projects: Project[] }) {
  const live = projects.filter((p) => p.status === "live").length;
  const demo = projects.filter((p) => p.status === "demo").length;
  const building = projects.filter((p) => p.status === "in-progress").length;
  return (
    <section aria-labelledby="letter-heading" className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <div className="reveal flex items-center gap-4">
              <Portrait />
              <Heading level={2} look={3} id="letter-heading" className="rise">
                Halo, saya Febrian
              </Heading>
            </div>
            <div className="mt-8 max-w-[36rem] space-y-6 text-[1.0625rem] leading-[1.65] text-fg">
              <p className="reveal">
                Saya mulai menulis kode di SMK jurusan Rekayasa Perangkat Lunak, lalu melanjutkan ke
                Teknik Informatika ITERA pada 2024.
              </p>
              <p className="reveal">
                Sebagian besar yang saya bangun lahir dari kebutuhan organisasi kampus: form
                rekrutmen, arsip bahan ibadah, pemendek tautan, e-voting, dan login terpusat.{" "}
                <mark className="rounded-sm bg-accent px-1 text-accent-fg">{live} sudah live</mark>
                {demo > 0 ? `, ${demo} bisa dicoba sebagai demo` : ""}
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
            <div className="mt-10">
              <p className="reveal text-[1.375rem] font-medium text-fg">{site.shortName}</p>
              <p className="reveal text-sm text-muted">{site.role}, Teknik Informatika ITERA</p>
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="lg:sticky lg:top-20">
              <div
                data-ui
                className="reveal overflow-hidden rounded-lg bg-surface font-mono text-[0.875rem] leading-6 text-muted"
              >
                <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3 text-[0.8125rem]">
                  <span className="text-fg">profil.txt</span>
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className="pulse-dot size-2 rounded-full bg-accent" />
                    terbuka untuk magang
                  </span>
                </div>
                <dl className="divide-y divide-border px-5">
                  {PROFILE.map((row) => (
                    <div key={row.key} className="grid grid-cols-[6.5rem_1fr] gap-x-4 py-3.5">
                      <dt className="text-accent">{row.key}</dt>
                      <dd>
                        <span className="block font-sans text-[0.9375rem] text-fg">
                          {row.value}
                        </span>
                        <span className="block text-[0.8125rem]">{row.note}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
