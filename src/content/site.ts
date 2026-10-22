export type NavItem = { href: string; label: string };

export const site = {
  name: "Febrian Yoel Anggara Saputra",
  shortName: "Febrian Yoel",
  tagline:
    "Fullstack web developer (React/TypeScript) yang membangun dan merilis sistem web untuk organisasi, sekaligus memimpin tim IT, dengan sisi desain & media.",
  nav: [
    { href: "/", label: "Beranda" },
    { href: "/projects", label: "Proyek" },
    { href: "/about", label: "Tentang" },
    { href: "/contact", label: "Kontak" },
  ] satisfies NavItem[],
  // TODO(owner): email, URL GitHub, URL LinkedIn, dan cv.pdf belum diberikan (INVENTORY pertanyaan 9).
  links: {
    email: undefined as string | undefined,
    github: undefined as string | undefined,
    linkedin: undefined as string | undefined,
    cv: undefined as string | undefined,
  },
} as const;
