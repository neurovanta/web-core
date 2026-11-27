import type { MetadataRoute } from "next";

// Served at /robots.txt:
//   User-agent: *
//   Disallow: /
// Blocks all search engines from crawling the site (pre-launch / staging).
// At launch, change to `allow: "/"` (and disallow the admin path) so the site can be indexed.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
