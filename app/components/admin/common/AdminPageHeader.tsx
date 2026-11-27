"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminVisitLink } from "@/app/components/admin/common/AdminVisitLink";
import {
  ArrowUpRight,
  Briefcase,
  ChevronRight,
  Factory,
  GraduationCap,
  Home,
  Info,
  Layers,
  LayoutDashboard,
  Navigation,
  Phone,
  Settings,
  Star,
  type LucideIcon,
} from "lucide-react";

export const ADMIN_BASE = "/4dm1n-n3ur0v4nt4";

// One entry per admin section (first URL segment after the admin base).
// `site` is the matching public page, used for the "View on website" link.
const SECTIONS: Record<
  string,
  { label: string; icon: LucideIcon; singular?: string; site?: string }
> = {
  home: { label: "Home", icon: Home, site: "/" },
  about: { label: "About", icon: Info, site: "/about-us" },
  solutions: { label: "Solutions", icon: Briefcase, singular: "Solution", site: "/solutions" },
  systems: { label: "Systems", icon: Layers, singular: "System", site: "/longevity-systems" },
  industries: { label: "Industries", icon: Factory, singular: "Industry", site: "/industries" },
  experience: { label: "Experience", icon: Star, site: "/experience" },
  careers: { label: "Careers", icon: GraduationCap, site: "/careers" },
  contact: { label: "Contact", icon: Phone, site: "/contact-us" },
  navigation: { label: "Navigation", icon: Navigation },
  settings: { label: "Settings", icon: Settings },
};

const ID_PATTERN = /^[0-9a-fA-F]{24}$|^\d+$/;

const humanize = (segment: string) =>
  segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getSegments = (pathname: string) =>
  pathname.slice(ADMIN_BASE.length).split("/").filter(Boolean);

const getCrumbs = (segments: string[]): string[] => {
  if (segments.length === 0) return [];

  const [first, second] = segments;
  const section = SECTIONS[first];
  const crumbs = [section?.label ?? humanize(first)];

  if (!second) return crumbs;
  if (second === "new") crumbs.push(`New ${section?.singular ?? "Item"}`);
  else if (ID_PATTERN.test(second)) crumbs.push(`Edit ${section?.singular ?? "Item"}`);
  else crumbs.push(humanize(second));

  return crumbs;
};

// Top bar of every admin page: section icon, breadcrumb, page title and a
// "View on website" link. Page save buttons sit on the right of this bar.
const AdminPageHeader = () => {
  const pathname = usePathname() ?? "";
  const pageVisitHref = useAdminVisitLink();
  const segments = getSegments(pathname);
  const isDashboard = segments.length === 0;
  const crumbs = getCrumbs(segments);
  const section = SECTIONS[segments[0] ?? ""];
  const Icon = isDashboard ? LayoutDashboard : (section?.icon ?? LayoutDashboard);
  const title = isDashboard ? "Dashboard" : crumbs[crumbs.length - 1];
  // detail editors set their own URL; section pages link to their public page
  const visitHref = pageVisitHref ?? (segments.length === 1 ? section?.site : undefined);

  return (
    <header className="relative flex h-[88px] shrink-0 items-center border-b border-border-color/40 bg-white/85 px-8 shadow-[0_6px_20px_-16px_rgba(81,70,62,0.3)] backdrop-blur-xl backdrop-saturate-150">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-secondary/25 to-transparent"
      />

      <div className="flex min-w-0 items-center gap-4">
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6b5d52] to-secondary text-white shadow-[0_10px_22px_-10px_rgba(81,70,62,0.75),inset_0_1px_0_rgba(255,255,255,0.14)] ring-1 ring-black/5">
          <Icon className="h-[22px] w-[22px]" strokeWidth={1.75} />
        </span>

        <span aria-hidden className="h-9 w-px shrink-0 bg-border-color/60" />

        <div className="flex min-w-0 flex-col gap-1.5">
          {isDashboard ? (
            <p
              className="truncate text-[11px] font-medium uppercase tracking-[0.14em] text-secondary/60"
              suppressHydrationWarning
            >
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          ) : (
            <nav
              aria-label="Breadcrumb"
              className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium uppercase leading-none tracking-[0.14em]"
            >
              <Link
                href={ADMIN_BASE}
                className="flex shrink-0 items-center gap-1 text-secondary/55 transition-colors hover:text-secondary"
              >
                <Home className="h-3 w-3" />
                <span>Admin</span>
              </Link>
              {crumbs.map((crumb, index) => {
                const last = index === crumbs.length - 1;
                return (
                  <span key={`${crumb}-${index}`} className="flex min-w-0 items-center gap-1.5">
                    <ChevronRight className="h-3 w-3 shrink-0 text-border-color" />
                    <span
                      className={last ? "truncate text-secondary" : "truncate text-secondary/55"}
                      aria-current={last ? "page" : undefined}
                    >
                      {crumb}
                    </span>
                  </span>
                );
              })}
            </nav>
          )}

          <div className="flex min-w-0 items-center gap-3">
            <h1 className="truncate text-[22px] font-semibold leading-none tracking-tight text-secondary">
              {title}
            </h1>
            {visitHref && (
              <a
                href={visitHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open this page on the website"
                className="group/visit relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border-color/70 bg-white text-secondary/70 transition-colors hover:border-secondary hover:bg-secondary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/20"
              >
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/visit:-translate-y-px group-hover/visit:translate-x-px" />
                <span
                  role="tooltip"
                  className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 flex origin-left -translate-x-1.5 -translate-y-1/2 scale-90 items-center whitespace-nowrap rounded-xl border border-border-color/60 bg-white px-3.5 py-2.5 opacity-0 shadow-[0_12px_32px_-12px_rgba(81,70,62,0.3)] transition-[opacity,transform] duration-150 ease-out group-hover/visit:translate-x-0 group-hover/visit:scale-100 group-hover/visit:opacity-100 group-hover/visit:duration-500 group-hover/visit:ease-[cubic-bezier(0.34,1.7,0.5,1)] group-focus-visible/visit:translate-x-0 group-focus-visible/visit:scale-100 group-focus-visible/visit:opacity-100"
                >
                  <span className="absolute -left-[5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 rounded-[2px] border-b border-l border-border-color/60 bg-white" />
                  <span className="relative text-[12.5px] font-medium text-secondary">
                    View on website
                  </span>
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminPageHeader;
