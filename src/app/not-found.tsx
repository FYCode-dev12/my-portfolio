import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { RakitSeat } from "@/components/mascot/RakitSeat";

export default function NotFound() {
  return (
    <Container className="py-24 sm:py-32">
      <div aria-hidden="true" className="flex items-end gap-5">
        <p className="display font-mono text-accent">404</p>
        {/* Rakit bingung. Tampil statis dari server, lalu hidup setelah mesin dimuat. */}
        <RakitSeat fallback expression="bingung" arrive="toleh" className="mb-2 w-32 shrink-0" />
      </div>
      <Heading level={1} look={2} className="mt-6">
        Halaman tidak ditemukan
      </Heading>
      <div
        data-ui
        className="mt-8 max-w-xl rounded-lg bg-surface px-5 py-4 font-mono text-[0.875rem] leading-7 text-muted"
      >
        <p>
          <span className="text-accent">~$</span> <span className="text-fg">cd halaman-ini</span>
        </p>
        <p>cd: tidak ada berkas atau direktori dengan nama itu</p>
      </div>
      <p className="mt-6 text-muted">Alamat yang Anda tuju tidak ada atau sudah dipindahkan.</p>
      <Button href="/" className="mt-8">
        Kembali ke beranda
      </Button>
    </Container>
  );
}
