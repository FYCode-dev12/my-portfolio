"use client";

import { useEffect } from "react";
import { RakitSeat } from "@/components/mascot/RakitSeat";
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
      <div className="flex items-end justify-between gap-6">
        <Heading level={1}>Terjadi kesalahan</Heading>
        <RakitSeat fallback expression="bingung" className="w-32 shrink-0 sm:w-48" />
      </div>
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
