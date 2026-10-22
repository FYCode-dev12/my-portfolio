import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

export default function NotFound() {
  return (
    <Container size="narrow" className="py-24">
      <p className="font-mono text-sm text-accent">404</p>
      <Heading level={1} className="mt-2">
        Halaman tidak ditemukan
      </Heading>
      <p className="mt-4 text-muted">Alamat yang Anda tuju tidak ada atau sudah dipindahkan.</p>
      <Button href="/" className="mt-8">
        Kembali ke beranda
      </Button>
    </Container>
  );
}
