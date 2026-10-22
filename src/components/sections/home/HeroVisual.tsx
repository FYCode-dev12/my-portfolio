/** Name tag statis (SVG). Dekoratif, tinggi tetap, tanpa JS. */
export function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="hero-visual relative mx-auto h-[320px] w-[240px] select-none"
    >
      <svg viewBox="0 0 240 320" width="240" height="320" className="hero-card text-fg">
        <line x1="120" y1="0" x2="120" y2="64" stroke="var(--border-strong)" strokeWidth="2" />
        <rect x="104" y="58" width="32" height="12" rx="4" fill="var(--border-strong)" />
        <rect
          x="20"
          y="70"
          width="200"
          height="240"
          rx="20"
          fill="var(--surface)"
          stroke="var(--border-strong)"
          strokeWidth="2"
        />
        <rect x="44" y="96" width="152" height="6" rx="3" fill="var(--accent)" />
        <text x="44" y="150" fontFamily="var(--font-mono)" fontSize="13" fill="var(--muted)">
          HELLO, I&apos;M
        </text>
        <text
          x="44"
          y="186"
          fontFamily="var(--font-sans)"
          fontSize="26"
          fontWeight="600"
          fill="var(--fg)"
        >
          Febrian
        </text>
        <text
          x="44"
          y="216"
          fontFamily="var(--font-sans)"
          fontSize="26"
          fontWeight="600"
          fill="var(--fg)"
        >
          Yoel
        </text>
        <text x="44" y="262" fontFamily="var(--font-mono)" fontSize="12" fill="var(--accent)">
          fullstack · react · ts
        </text>
      </svg>
    </div>
  );
}
