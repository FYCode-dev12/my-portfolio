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
        background: "#0a0f1e",
        color: "#e6eaf5",
      }}
    >
      <div style={{ fontSize: 28, color: "#7aa2ff" }}>{site.role}</div>
      <div style={{ fontSize: 72, fontWeight: 700, marginTop: 16 }}>{site.name}</div>
      <div style={{ fontSize: 30, color: "#94a3c0", marginTop: 24 }}>
        React · TypeScript · Next.js
      </div>
    </div>,
    size,
  );
}
