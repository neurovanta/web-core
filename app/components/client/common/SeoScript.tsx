import { parseSeoScript } from "@/lib/seo";

// Renders the admin SEO "Script" field as JSON-LD structured data.
// "<" is escaped so the payload cannot close the script tag (per Next.js JSON-LD guide).
const SeoScript = ({ script }: { script?: string | null }) => {
  const items = parseSeoScript(script);
  if (!items.length) return null;

  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
};

export default SeoScript;
