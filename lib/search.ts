import { getSystems } from "@/lib/services/systems.service";
import { getSolutions } from "@/lib/services/solutions.service";
import { getIndustries } from "@/lib/services/industries.service";
import { SearchItem, SearchItemType } from "@/app/types/search";

const ADMIN_BASE = "/4dm1n-n3ur0v4nt4";

const SITE_PAGES: SearchItem[] = [
  { title: "Home", description: "Neuro Vanta – advanced longevity and wellness solutions", type: "Page", href: "/" },
  { title: "About Us", description: "Who we are and how we work", type: "Page", href: "/about-us" },
  { title: "Longevity Systems", description: "Our full range of longevity systems", type: "Page", href: "/longevity-systems" },
  { title: "Solutions", description: "Wellness space design and solutions", type: "Page", href: "/solutions" },
  { title: "Industries", description: "Clinics, hotels, gyms and private residences", type: "Page", href: "/industries" },
  { title: "Experience", description: "The Neuro Vanta experience", type: "Page", href: "/experience" },
  { title: "Careers", description: "Open positions and job applications", type: "Page", href: "/careers" },
  { title: "Contact Us", description: "Get in touch with our team", type: "Page", href: "/contact-us" },
];

// Mirrors the admin sidebar.
const ADMIN_PAGES: SearchItem[] = [
  { title: "Dashboard", description: "Admin overview", type: "Page", href: ADMIN_BASE },
  { title: "Home Page", description: "Edit the home page sections", type: "Page", href: `${ADMIN_BASE}/home` },
  { title: "Home Enquiries", description: "Enquiries from the home page form", type: "Page", href: `${ADMIN_BASE}/home/enquiries` },
  { title: "About", description: "Edit the about page", type: "Page", href: `${ADMIN_BASE}/about` },
  { title: "Solutions", description: "Solutions list and page", type: "Page", href: `${ADMIN_BASE}/solutions` },
  { title: "Systems", description: "Categories, products and page", type: "Page", href: `${ADMIN_BASE}/systems` },
  { title: "Industries", description: "Industries list and page", type: "Page", href: `${ADMIN_BASE}/industries` },
  { title: "Experience", description: "Edit the experience page", type: "Page", href: `${ADMIN_BASE}/experience` },
  { title: "Careers Page", description: "Edit the careers page and positions", type: "Page", href: `${ADMIN_BASE}/careers` },
  { title: "Career Applications", description: "Job applications received", type: "Page", href: `${ADMIN_BASE}/careers/applications` },
  { title: "Contact Page", description: "Edit the contact page", type: "Page", href: `${ADMIN_BASE}/contact` },
  { title: "Contact Enquiries", description: "Enquiries from the contact form", type: "Page", href: `${ADMIN_BASE}/contact/enquiries` },
  { title: "Navigation", description: "Header and footer menus", type: "Page", href: `${ADMIN_BASE}/navigation` },
  { title: "Settings", description: "Emails and site settings", type: "Page", href: `${ADMIN_BASE}/settings` },
];

const DESCRIPTION_LIMIT = 160;

// CMS fields can hold HTML and \n markers; keep the payload small and plain.
const clean = (value?: string) =>
  (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const short = (value?: string) => {
  const text = clean(value);
  return text.length > DESCRIPTION_LIMIT ? `${text.slice(0, DESCRIPTION_LIMIT).trimEnd()}…` : text;
};

// A missing CMS document must not take search down; that section is simply absent.
const safe = async <T,>(load: () => Promise<T>): Promise<T | null> => {
  try {
    return await load();
  } catch {
    return null;
  }
};

interface ContentEntry {
  title: string;
  description: string;
  type: SearchItemType;
  keywords?: string;
  siteHref: string;
  adminHref: string;
  isHidden: boolean;
}

// Every CMS item once, with both its public and its admin URL. Built from the
// tag-cached services, so it refreshes when the admin saves.
async function getContentEntries(): Promise<ContentEntry[]> {
  const [systems, solutions, industries] = await Promise.all([
    safe(getSystems),
    safe(getSolutions),
    safe(getIndustries),
  ]);

  const entries: ContentEntry[] = [];

  for (const category of systems?.secondSection?.categories ?? []) {
    for (const product of category.products ?? []) {
      entries.push({
        title: clean(product.thumbnailTitle || product.bannerSection?.title),
        description: short(product.seo?.metaDescription || product.firstSection?.description),
        type: "System",
        keywords: clean(category.title),
        siteHref: `/longevity-systems/${product.slug}`,
        adminHref: `${ADMIN_BASE}/systems/${product._id}`,
        isHidden: Boolean(product.isHidden || category.isHidden || !product.slug),
      });
    }
  }

  for (const solution of solutions?.solutions ?? []) {
    entries.push({
      title: clean(solution.thumbnailTitle || solution.bannerSection?.title),
      description: short(solution.thumbnailDescription || solution.seo?.metaDescription),
      type: "Solution",
      siteHref: `/solutions/${solution.slug}`,
      adminHref: `${ADMIN_BASE}/solutions/${solution._id}`,
      isHidden: Boolean(solution.isHidden || !solution.slug),
    });
  }

  for (const industry of industries?.industries ?? []) {
    entries.push({
      title: clean(industry.thumbnailTitle || industry.bannerSection?.title),
      description: short(industry.thumbnailDescription || industry.seo?.metaDescription),
      type: "Industry",
      siteHref: `/industries/${industry.slug}`,
      adminHref: `${ADMIN_BASE}/industries/${industry._id}`,
      isHidden: Boolean(industry.isHidden || !industry.slug),
    });
  }

  return entries.filter((entry) => entry.title);
}

// Public website search: visible items only, linking to the live pages.
export async function getSearchIndex(): Promise<SearchItem[]> {
  const entries = await getContentEntries();
  return [
    ...SITE_PAGES,
    ...entries
      .filter((entry) => !entry.isHidden)
      .map(({ title, description, type, keywords, siteHref }) => ({
        title,
        description,
        type,
        keywords,
        href: siteHref,
      })),
  ];
}

// CMS search: admin sections plus every item (hidden ones flagged), linking to their editors.
export async function getAdminSearchIndex(): Promise<SearchItem[]> {
  const entries = await getContentEntries();
  return [
    ...ADMIN_PAGES,
    ...entries.map(({ title, description, type, keywords, adminHref, isHidden }) => ({
      title,
      description,
      type,
      keywords,
      href: adminHref,
      isHidden,
    })),
  ];
}
