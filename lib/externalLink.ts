/**
 * Normalises a CMS-entered external link: trims it, adds https:// to a bare
 * domain ("maps.app.goo.gl/…"), and drops anything that is not http(s)
 * (e.g. "javascript:"). Returns "" when there is no usable link.
 */
export function toExternalHref(value?: string | null): string {
  const v = (value ?? "").trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  if (/^[a-z][a-z\d+.-]*:/i.test(v)) return ""; // other schemes are not allowed
  return `https://${v.replace(/^\/+/, "")}`;
}
