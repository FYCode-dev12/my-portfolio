export type NavItem = { href: string; label: string };

export const site = {
  name: "Febrian Yoel Anggara Saputra",
  shortName: "Febrian Yoel",
  role: "Fullstack Web Developer",
  tagline:
    "Fullstack web developer (React/TypeScript) yang membangun dan merilis sistem web untuk organisasi, sekaligus memimpin tim IT, dengan sisi desain & media.",
  description:
    "Portofolio Febrian Yoel Anggara Saputra, fullstack web developer (React/TypeScript) dan mahasiswa Teknik Informatika ITERA.",
  nav: [
    { href: "/", label: "Beranda" },
    { href: "/projects", label: "Proyek" },
    { href: "/about", label: "Tentang" },
    { href: "/contact", label: "Kontak" },
  ] satisfies NavItem[],
  links: {
    email: "febrianyoel.work@gmail.com",
    github: "https://github.com/FYCode-dev12",
    linkedin: "https://www.linkedin.com/in/febrianyoel",
  },
} as const;
