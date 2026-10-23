"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { PageTitle } from "@/components/ui/PageTitle";

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
    <div className="gutter pb-24 pt-10 sm:pt-16">
      <PageTitle lines={["Terjadi", "kesalahan."]} />
      <p className="t-lead mt-8 max-w-[36ch] text-muted">
        Halaman gagal dimuat. Coba lagi, atau kembali ke beranda.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <Button onClick={reset}>Coba lagi</Button>
        <Button href="/" variant="quiet">
          Kembali ke beranda
        </Button>
      </div>
    </div>
  );
}
