import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Design system (sementara)",
  robots: { index: false, follow: false },
};

const tokens = ["bg", "surface", "border", "fg", "muted", "accent", "accent-fg"] as const;

export default function DesignPage() {
  return (
    <>
      <Container className="pt-16">
        <Badge tone="accent">Halaman sementara Fase 2, dihapus sebelum Fase 4 selesai</Badge>
        <Heading level={1} className="mt-4">
          Design system
        </Heading>
        <p className="mt-4 max-w-2xl text-muted">
          Semua komponen dasar. Gunakan tombol tema di header untuk membandingkan gelap dan terang.
        </p>
      </Container>

      <Section id="tokens" title="Token warna" description="Hanya token dari AGENTS.md bagian 6.">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {tokens.map((t) => (
            <li key={t}>
              <div
                className="h-16 rounded-md border border-border"
                style={{ backgroundColor: `var(--${t})` }}
              />
              <p className="mt-2 font-mono text-xs text-muted">--{t}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="type" title="Tipografi">
        <div className="space-y-4">
          <Heading level={1}>Heading 1 tampilan besar</Heading>
          <Heading level={2}>Heading 2 judul seksi</Heading>
          <Heading level={3}>Heading 3 judul kartu</Heading>
          <p>Teks isi memakai Geist Sans dengan line-height 1,6 agar nyaman dibaca.</p>
          <p className="text-muted">Teks sekunder memakai warna muted.</p>
          <p className="font-mono text-sm">Geist Mono untuk kode dan label teknis.</p>
        </div>
      </Section>

      <Section id="buttons" title="Button dan tautan">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="sm">Kecil</Button>
          <Button href="/projects" variant="secondary">
            Sebagai tautan
          </Button>
          <Button disabled>Nonaktif</Button>
          <ExternalLink href="https://nextjs.org">Tautan eksternal</ExternalLink>
        </div>
      </Section>

      <Section id="cards" title="Card dan Badge">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <Heading level={3}>Card biasa</Heading>
            <p className="mt-2 text-muted">Permukaan dengan border dan radius sedang.</p>
            <div className="mt-4 flex gap-2">
              <Badge>Neutral</Badge>
              <Badge tone="accent">Accent</Badge>
            </div>
          </Card>
          <Card interactive>
            <Heading level={3}>Card interaktif</Heading>
            <p className="mt-2 text-muted">Border berubah ke aksen saat hover.</p>
          </Card>
        </div>
      </Section>
    </>
  );
}
