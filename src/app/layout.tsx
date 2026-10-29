import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { BrandIntro } from "@/components/layout/BrandIntro";
import { Header } from "@/components/layout/Header";
import { Particles } from "@/components/layout/Particles";
import { SkipLink } from "@/components/layout/SkipLink";
import { RakitCompanion } from "@/components/mascot/RakitCompanion";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${site.name} | ${site.role}`, template: `%s | ${site.shortName}` },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
};

// Tema sebelum paint (tanpa flash) dan atribut `data-js` untuk animasi judul yang aman tanpa JS.
const themeScript = `(function(){var d=document.documentElement;d.setAttribute("data-js","");try{var t=localStorage.getItem("theme");d.setAttribute("data-theme",t==="light"?"light":"dark")}catch(e){}if(location.pathname==="/"&&!matchMedia("(prefers-reduced-motion: reduce)").matches)d.setAttribute("data-intro","");})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-svh flex-col">
        <SkipLink />
        <Particles />
        <Header />
        <BrandIntro />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
        <RakitCompanion />
      </body>
    </html>
  );
}
