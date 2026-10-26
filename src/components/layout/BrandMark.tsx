/**
 * Wordmark `~/febrian-yoel` dengan kursor blok. Dipakai di header dan di intro beranda,
 * jadi markup keduanya identik dan intro bisa mendarat tepat di posisi header.
 */
export const BRAND_TEXT_LENGTH = "~/febrian-yoel".length;

export function BrandMark() {
  return (
    <>
      <span className="brand-text">
        <span className="text-accent">~/</span>febrian-yoel
      </span>
      <span
        aria-hidden="true"
        className="caret ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-accent"
      />
    </>
  );
}
