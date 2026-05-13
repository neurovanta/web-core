"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const EXISTING_PAGES = ["/", "/about-us", "/solutions"];

export default function Breadcrumb() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  const crumbs = [
    { label: "Home", href: "/" },
    ...segments.map((seg, i) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
      href: "/" + segments.slice(0, i + 1).join("/"),
    })),
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      className="h-[50px] flex justify-center items-center"
    >
      <ol className="flex items-center">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          const isClickable = !isLast && EXISTING_PAGES.includes(crumb.href);

          return (
            <li key={index} className="flex items-center tracking-[-0.03em]">
              {index > 0 && (
                <span className="inline-block rounded-full mx-[10px] bg-[#D9D9D9] w-[7px] h-[7px]" />
              )}

              {isLast ? (
                <span className="font-semibold text-description text-[#D9D9D9]">
                  {crumb.label}
                </span>
              ) : isClickable ? (
                <Link
                  href={crumb.href}
                  className="font-normal cursor-pointer opacity-70 text-[#D9D9D9] text-description"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-normal opacity-70 cursor-default text-[#D9D9D9] text-description">
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
