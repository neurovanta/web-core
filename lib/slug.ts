// URL slugs: lowercase letters, digits and single hyphens ("Immersion Tubs" -> "immersion-tubs").
export const slugify = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // accents
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Route params arrive URL-encoded ("Immersion%20Tubs"); decode before matching stored slugs.
export const decodeSlug = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};
