// Content for CMS fields added after the site launched. Both the CMS (to pre-fill
// its form) and the website (as a fallback) use these, so a field that has never
// been saved shows exactly the text that used to be hard-coded. Saving it in the
// CMS stores it in the database; from then on the stored value is used.

export type OptionItem = { label: string };

export const CAREERS_APPLY_DEFAULTS = {
  title: "YOUR NEXT CHAPTER STARTS HERE.",
  subtitle:
    "We are always looking for talented, driven individuals who want to be part of something that matters.",
  description:
    "At Neurovanta, you will work on projects that are genuinely changing the way the world approaches wellness and longevity. We value expertise, integrity, and a high standard of work. If that resonates with you, we would like to hear from you. ",
};

export const CONTACT_FORM_DEFAULTS = {
  title: "General Inquiry",
  submitLabel: "SUBMIT INQUIRY",
  serviceOptions: [
    { label: "General" },
    { label: "Career Opportunities" },
    { label: "Investor Inquiries" },
    { label: "Supplier Partnerships" },
  ] as OptionItem[],
};

export const HOME_ENQUIRY_FORM_DEFAULTS = {
  companyOptions: [
    { label: "Individual" },
    { label: "Startup" },
    { label: "Small / Medium Business" },
    { label: "Enterprise" },
    { label: "Non-profit" },
  ] as OptionItem[],
  detailsLabel: "Details about your description",
  submitLabel: "Send",
};

const filled = (v: unknown) =>
  Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && v !== "";

/** Stored values where set, defaults for the rest (an empty option list falls
 *  back too, so a form is never left without choices). */
export function withDefaults<T extends Record<string, unknown>>(
  stored: Partial<T> | null | undefined,
  defaults: T,
): T {
  const out = { ...defaults };
  for (const key of Object.keys(defaults) as (keyof T)[]) {
    if (stored && filled(stored[key])) out[key] = stored[key] as T[keyof T];
  }
  return out;
}

/** Dropdown options for the website forms: the label doubles as the value,
 *  so enquiry emails show readable text. */
export const toSelectOptions = (items: OptionItem[]) =>
  items
    .map((i) => i.label?.trim())
    .filter(Boolean)
    .map((label) => ({ label, value: label }));
