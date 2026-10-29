import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { achievements, type AchievementCategory } from "@/content/achievements";
import { contributions } from "@/content/contributions";
import { photos } from "@/content/photos";
import { formatAchievementPeriod } from "@/lib/format";

const groups: Array<{ category: AchievementCategory; label: string }> = [
  { category: "leadership", label: "Memimpin" },
  { category: "teaching", label: "Mengajar" },
  { category: "award", label: "Prestasi" },
];

// Kontribusi web sudah tampil di ledger; di sini hanya peran non-kode.
const shownInLedger = new Set(contributions.map((c) => c.achievementId));

function sortKey(endDate: string | undefined, date: string) {
  return endDate === "present" ? "9999-12" : (endDate ?? date);
}

export function BeyondCode() {
  const photo = photos.itera;
  return (
    <section aria-labelledby="beyond-heading" className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <Heading level={2} id="beyond-heading" className="rise">
              Di luar kode
            </Heading>
            <p
              className="reveal mt-4 max-w-[44ch] text-muted"
              style={{ "--d": 1 } as React.CSSProperties}
            >
              Memimpin tim, mengajar, dan lomba. Linimasa lengkap ada di halaman Tentang.
            </p>
            <div className="mt-12 space-y-10">
              {groups.map(({ category, label }) => {
                const items = achievements
                  .filter((a) => a.category === category && !shownInLedger.has(a.id))
                  .sort((a, b) =>
                    sortKey(b.endDate, b.date).localeCompare(sortKey(a.endDate, a.date)),
                  );
                if (items.length === 0) return null;
                return (
                  <div key={category} className="reveal">
                    <Heading level={3} look={5} className="font-normal text-muted">
                      {label}
                    </Heading>
                    <ul className="mt-3">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className="grid grid-cols-[auto_1fr] gap-x-3 py-2 sm:grid-cols-[auto_1fr_auto] sm:items-baseline"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2.5 size-2 rounded-full bg-accent sm:mt-0 sm:self-center"
                          />
                          <span className="text-fg">
                            {item.title}
                            {item.issuer ? (
                              <span className="text-muted">, {item.issuer}</span>
                            ) : null}
                          </span>
                          <span className="col-start-2 text-sm text-muted tabular-nums sm:col-start-3 sm:text-right">
                            {formatAchievementPeriod(item.date, item.endDate)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
          <figure className="reveal lg:col-span-5 lg:col-start-8">
            <div className="lg:sticky lg:top-20">
              <div className="drift-frame window relative aspect-[4/5] overflow-clip rounded-lg bg-surface">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 92vw"
                  className="drift object-cover"
                  style={{ objectPosition: photo.position }}
                />
              </div>
            </div>
            <figcaption className="mt-3 text-sm text-muted">
              Kampus ITERA saat senja, Lampung Selatan.
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
