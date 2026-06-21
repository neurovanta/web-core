export interface NavSocial {
  label: string;
  type: string;
  link: string;
  isHidden: boolean;
  _id: string;
}

export interface NavLink {
  label: string;
  link: string;
  isHidden: boolean;
  _id: string;
}

export interface NavSolution {
  solutionId: string;
  thumbnailTitle: string;
  slug: string;
  isHidden: boolean;
}

export interface NavSystem {
  categoryId: string;
  title: string;
  slug: string;
  isHidden: boolean;
}

export interface NavIndustry {
  industryId: string;
  thumbnailTitle: string;
  slug: string;
  isHidden: boolean;
}

export interface NavContact {
  email: string;
  phone: string;
  address: string;
}

export interface MenuItemData {
  _id?: string;
  kind: "link" | "group";
  label?: string;
  link?: string;
  groupKey?: "solutions" | "systems" | "industries";
  isHidden: boolean;
}

export interface NavItem {
  label: string;
  href?: string;
  subItems?: { label: string; href: string }[];
}

export interface NavData {
  contact: NavContact;
  socials: NavSocial[];
  header: {
    solutionsLabel: string;
    systemsLabel: string;
    industriesLabel: string;
    menuItems: MenuItemData[];
    solutions: NavSolution[];
    systems: NavSystem[];
    industries: NavIndustry[];
  };
  footer: {
    solutionsLabel: string;
    systemsLabel: string;
    quickLinks: NavLink[];
    solutions: NavSolution[];
    systems: NavSystem[];
  };
}