import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="gutter grid min-h-[max(30rem,calc(72svh-var(--header-h)))] items-end gap-10 pb-12 pt-10 lg:grid-cols-[42%_1fr] lg:gap-0 lg:pb-16"
    >
      <div className="order-2 flex flex-col items-start gap-8 lg:order-1 lg:max-w-[32ch] lg:pr-6">
        <p className="hero-in max-w-[32ch] text-lg leading-snug">
          {site.shortName}, fullstack web developer dan mahasiswa Teknik Informatika ITERA. Saya
          merilis sistem web untuk organisasi mahasiswa dan memimpin tim IT&#8209;nya.
        </p>
        <Button href="/projects" className="hero-in hero-in-late">
          Baca studi kasus
        </Button>
      </div>
      <h1
        id="hero-heading"
        className="order-1 text-[clamp(2.5rem,11.2vw,4.75rem)] font-medium leading-[0.95] tracking-[-0.04em] sm:text-[clamp(4rem,10vw,6rem)] lg:order-2 lg:text-[clamp(3.5rem,7.4vw,8rem)]"
      >
        <span className="sr-only">Sistem web untuk organisasi.</span>
        <span className="line" aria-hidden="true">
          <span style={{ "--i": 0 } as React.CSSProperties}>Sistem web</span>
        </span>
        <span className="line" aria-hidden="true">
          <span style={{ "--i": 1 } as React.CSSProperties}>untuk organisasi.</span>
        </span>
      </h1>
    </section>
  );
}
