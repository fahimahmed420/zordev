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
          background: "#050912",
          color: "white",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 44, fontWeight: 800, letterSpacing: 10 }}>
          <span>ZOR</span>
          <span style={{ color: "#F37842" }}>DEV</span>
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.15, maxWidth: 1000 }}>
          Websites, online stores and web apps, built properly and shipped on a fixed scope.
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#10A0FF" }}>zordev.com · Web development studio</div>
      </div>
    ),
    size,
  );
}
