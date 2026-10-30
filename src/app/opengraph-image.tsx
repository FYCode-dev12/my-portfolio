import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name}, ${site.role}. Logo FY dan maskot Rakit.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Versi gelap dari kit brand (repo MaskotYoel, brand/final; salinannya di src/brand).
// Latar sama dengan tema gelap situs, sehingga tubuh Rakit (biru malam) tetap lulus kontras 3:1.
async function svgData(file: string) {
  const svg = await readFile(join(process.cwd(), "src/brand", file), "base64");
  return `data:image/svg+xml;base64,${svg}`;
}

export default async function OpengraphImage() {
  const [logo, rakit] = await Promise.all([
    svgData("fy-logo-dark.svg"),
    svgData("rakit-netral-dark.svg"),
  ]);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "80px 96px 80px 80px",
        background: "#0a0f1e",
        color: "#e6eaf5",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
        <img src={logo} width={88} height={88} alt="" />
        <div style={{ fontSize: 28, color: "#7aa2ff", marginTop: 40 }}>{site.role}</div>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 12, lineHeight: 1.1 }}>
          {site.name}
        </div>
        <div style={{ fontSize: 30, color: "#94a3c0", marginTop: 24 }}>
          React · TypeScript · Next.js
        </div>
      </div>
      <img src={rakit} width={244} height={320} alt="" />
    </div>,
    size,
  );
}
