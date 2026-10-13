import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the Z mark on charcoal. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0c0c0c" }}>
        <svg width="112" height="112" viewBox="0 0 40 40">
          <defs>
            <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#0E77EF" />
              <stop offset="1" stopColor="#F37842" />
            </linearGradient>
          </defs>
          <path d="M6 6h28v6H6z" fill="#10A0FF" />
          <path d="M34 12 14 28H6l20-16z" fill="#0E77EF" />
          <path d="M6 28h28v6H6z" fill="url(#g)" />
        </svg>
      </div>
    ),
    size,
  );
}
