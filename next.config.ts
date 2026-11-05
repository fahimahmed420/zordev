import type { NextConfig } from "next";

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://app.cal.com https://cloud.umami.is",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "frame-src https://challenges.cloudflare.com https://app.cal.com https://cal.com",
  "connect-src 'self' https://challenges.cloudflare.com https://app.cal.com https://cloud.umami.is https://api-gateway.umami.dev https://gateway.umami.is",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    // Screenshots are at most 1440px wide (desktop) and 780px (mobile); larger variants only cost
    // extra optimizer work and first-visit misses.
    deviceSizes: [640, 828, 1080, 1440],
    imageSizes: [256, 384],
    // Cache optimized images for 31 days in the CDN and browser. Rename a screenshot file to bust it.
    minimumCacheTTL: 2678400,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    // Browsers and crawlers still request /favicon.ico; point them at the SVG icon instead of a 404.
    return [{ source: "/favicon.ico", destination: "/icon.svg", permanent: true }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Report-only first; switch the key to Content-Security-Policy once verified in production.
          { key: "Content-Security-Policy-Report-Only", value: csp },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
