import type { NextConfig } from "next";

// Security headers for every page. The app only talks to its own origin
// (the BFF), so connect-src can stay 'self'.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

// `next dev` only: hosts allowed to load dev resources (HMR), e.g. the
// notebook's LAN IP to open the app on a phone on the same Wi-Fi.
const allowedDevOrigins = (process.env.DEV_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins,
  reactStrictMode: true,
  images: {
    // YouTube video thumbnails on the song page.
    remotePatterns: [new URL("https://i.ytimg.com/vi/**")],
  },
  // Event pages (and venues) moved from the agenda to their own menus:
  // links already sent by e-mail / in notifications keep working.
  async redirects() {
    return [
      // The audit page was dropped: each table shows its own history.
      {
        source: "/admin/auditoria",
        destination: "/admin/usuarios",
        permanent: true,
      },
      {
        source: "/agenda/locais",
        destination: "/locais",
        permanent: true,
      },
      {
        source: "/eventos/locais",
        destination: "/locais",
        permanent: true,
      },
      {
        source: "/agenda/:id([0-9a-fA-F-]{36})/:rest*",
        destination: "/eventos/:id/:rest*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Service worker (Web Push): always the latest version, own origin
        // only (Next.js PWA guide).
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
