import Link from "next/link";
import { achievements, highlightIds } from "@/content/achievements";
import { formatAchievementPeriod } from "@/lib/format";

const facts = [
  { label: "Kuliah", value: "S1 Teknik Informatika, ITERA" },
  { label: "Memimpin", value: "Departemen CMIT, PMK ITERA 2026" },
  { label: "Mengajar", value: "Asisten dosen Pengenalan Komputasi" },
  { label: "Tumpukan utama", value: "React, Next.js, TypeScript" },
];

export function AboutPreview() {
  const records = highlightIds
    .map((id) => achievements.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => a !== undefined);

  return (
    <section aria-labelledby="about-heading" className="section gutter">
      <h2 id="about-heading" className="t-sub reveal">
        Tentang saya
      </h2>
      <div className="mt-10 grid gap-12 lg:grid-cols-[34%_1fr] lg:gap-0">
        <dl className="reveal grid gap-5 lg:pr-10" style={{ "--i": 1 } as React.CSSProperties}>
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="t-small text-muted">{fact.label}</dt>
              <dd className="mt-1">{fact.value}</dd>
            </div>
          ))}
        </dl>
        <div className="reveal" style={{ "--i": 2 } as React.CSSProperties}>
          <p className="max-w-[38ch] text-[clamp(1.25rem,1.7vw+0.4rem,1.625rem)] leading-[1.4] tracking-[-0.01em] text-pretty">
            Saya membangun sistem web untuk organisasi mahasiswa, dari form builder dan pemendek
            tautan sampai sistem identitas dengan login terpusat. Di luar kode, saya memimpin
            departemen media, informasi, dan teknologi, mengajar, dan mengerjakan desain serta
            dokumentasi acara.
          </p>
          <p className="mt-8">
            <Link href="/about" className="link inline-flex min-h-11 items-center font-medium">
              Baca perjalanan lengkap
            </Link>
          </p>
        </div>
      </div>
      <ul className="mt-16 grid gap-x-12 gap-y-6 sm:grid-cols-2 lg:ml-[34%] lg:pl-0">
        {records.map((item, i) => (
          <li key={item.id} className="reveal" style={{ "--i": i } as React.CSSProperties}>
            <p className="t-small text-muted">{formatAchievementPeriod(item.date, item.endDate)}</p>
            <p className="mt-1 font-medium">{item.title}</p>
            {item.issuer ? <p className="t-small text-muted">{item.issuer}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
