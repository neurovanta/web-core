export type SearchItemType = "Page" | "System" | "Solution" | "Industry";

export interface SearchItem {
  title: string;
  description: string;
  type: SearchItemType;
  href: string;
  // extra matchable text (e.g. a system's category name)
  keywords?: string;
  // CMS index only: item is hidden on the website
  isHidden?: boolean;
}
