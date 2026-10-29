"use client";

import { useEffect } from "react";
import { RakitCue } from "@/components/mascot/RakitCue";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container size="narrow" className="py-24">
      <Heading level={1}>Terjadi kesalahan</Heading>
      <RakitCue expression="bingung" ms={3200} say="Waduh, ada yang error. Coba lagi, yuk." />
      <p className="mt-4 text-muted">Halaman gagal dimuat. Coba lagi, atau kembali ke beranda.</p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Coba lagi</Button>
        <Button href="/" variant="secondary">
          Beranda
        </Button>
      </div>
    </Container>
  );
}
