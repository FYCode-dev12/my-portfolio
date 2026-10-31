import type { Metadata } from "next";
import { RakitCue } from "@/components/mascot/RakitCue";
import { ContactPanel } from "@/components/sections/ContactPanel";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { getCvHref } from "@/lib/cv";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Email, GitHub, dan LinkedIn Febrian Yoel Anggara Saputra.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Container className="py-16 sm:py-24">
      <Heading level={1}>Kontak</Heading>
      <RakitCue act="lambai" say="Mau ngobrol? Tulis subjeknya, nanti dibalas lewat email." />
      <p className="mt-6 max-w-[44ch] text-lg text-muted">
        Cara tercepat menghubungi saya adalah lewat email. Saya biasanya membalas dalam beberapa
        hari.
      </p>
      <div className="mt-20 grid items-start gap-16 sm:mt-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <ContactPanel cvHref={getCvHref()} />
        </div>
      </div>
    </Container>
  );
}
