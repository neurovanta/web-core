import type { Metadata } from "next";

export type Seo =
  | { metaTitle?: string; metaDescription?: string; script?: string }
  | null
  | undefined;

// Production origin, e.g. https://www.neurovanta.com (no trailing slash).
// Set as metadataBase in the root layout so relative canonicals become absolute.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");

// Page metadata from the admin SEO block plus the page's canonical path.
// Empty SEO fields are left out, so the root layout's defaults ("Neuro Vanta") stay.
export function pageMetadata(seo: Seo, path: string): Metadata {
  const title = seo?.metaTitle?.trim();
  const description = seo?.metaDescription?.trim();
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: path },
  };
}

// The admin "Script" field holds structured data (JSON-LD). Admins may paste
// raw JSON or one or more <script type="application/ld+json"> blocks. Only
// valid JSON is kept; anything else (e.g. plain JavaScript) is dropped so it
// never runs on the site.
export function parseSeoScript(script?: string | null): unknown[] {
  const raw = script?.trim();
  if (!raw) return [];

  const blocks = /<script[\s>]/i.test(raw)
    ? Array.from(raw.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi), (m) => m[1])
    : [raw];

  const out: unknown[] = [];
  for (const block of blocks) {
    try {
      out.push(JSON.parse(block.trim()));
    } catch {
      // not JSON-LD, skip
    }
  }
  return out;
}
