// CMS eye toggle: a section renders unless it exists and is marked hidden.
// Missing data (older documents without the section) is treated as "not shown"
// only when explicitly requested via `requireData`.
export const isShown = (section: unknown, requireData = false): boolean => {
  if (section == null) return !requireData;
  return !(section as { isHidden?: boolean }).isHidden;
};
