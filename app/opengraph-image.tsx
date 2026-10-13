import { ImageResponse } from "next/og";

export const alt = "Zordev, web development studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "radial-gradient(circle at 80% 0%, #2a1a12 0%, #0c0c0c 55%)",
          color: "#f2eee8",
          padding: 80,
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontFamily: "sans-serif", fontSize: 40, fontWeight: 800, letterSpacing: 10 }}>
          <span>ZOR</span>
          <span style={{ color: "#f37842" }}>DEV</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1.05, maxWidth: 1000 }}>
          <span>Websites, online stores and web apps,</span>
          <span style={{ color: "#f37842", fontStyle: "italic" }}>built properly.</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "sans-serif", fontSize: 26, color: "#b3ada4" }}>
          <span>zordev.com</span>
          <span>Web development studio · Dhaka → worldwide</span>
        </div>
      </div>
    ),
    size,
  );
}
