import type { NextConfig } from "next";

// Security headers, chosen so nothing the site relies on is blocked:
// - The CSP only restricts who may frame the site, <object>/<embed> plugins and <base>.
//   It deliberately has no script-src / style-src / img-src / connect-src / frame-src:
//   admins paste third-party tags (Settings, page SEO scripts), and the site uses
//   reCAPTCHA, Dropbox images/uploads, inline animation styles and a Google Maps embed.
// - No COEP/COOP/CORP: they would block Dropbox images and can break the reCAPTCHA popup.
// Tighten only after checking every external domain in use.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    dangerouslyAllowSVG: true,
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dl.dropboxusercontent.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  serverExternalPackages: ["node-fetch", "fetch-blob", "dropbox"],
};

export default nextConfig;
