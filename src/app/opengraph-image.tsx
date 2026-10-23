import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        background: "#ddd6c6",
        color: "#2a2a26",
      }}
    >
      <div style={{ fontSize: 28, color: "#465833" }}>{site.role}</div>
      <div style={{ fontSize: 84, fontWeight: 600, letterSpacing: -3, marginTop: 16 }}>{site.name}</div>
      <div style={{ fontSize: 30, color: "#4f4d45", marginTop: 24 }}>
        React · TypeScript · Next.js
      </div>
    </div>,
    size,
  );
}
