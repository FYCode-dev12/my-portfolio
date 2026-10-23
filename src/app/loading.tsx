import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <Container className="py-24" aria-busy="true">
      <p role="status" className="font-mono text-sm text-muted">
        Memuat…
      </p>
    </Container>
  );
}
