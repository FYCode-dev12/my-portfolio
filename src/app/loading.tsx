import { RakitSvg } from "@/components/mascot/RakitSvg";
import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <Container className="flex items-center gap-4 py-24" aria-busy="true">
      {/* Mata setengah dan caret berkedip cepat: ekspresi "loading". CSS saja, tanpa JS. */}
      <RakitSvg expression="loading" className="h-12 w-[37px] shrink-0" />
      <p role="status" className="font-mono text-sm text-muted">
        Memuat…
      </p>
    </Container>
  );
}
