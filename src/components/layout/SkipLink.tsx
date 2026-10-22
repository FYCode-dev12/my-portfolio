export function SkipLink({ targetId = "main" }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only z-50 rounded-md bg-accent px-4 py-2 font-medium text-accent-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Lewati ke konten utama
    </a>
  );
}
