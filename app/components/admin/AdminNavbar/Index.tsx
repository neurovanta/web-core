"use client";

import ClientSideLink from "@/app/(admin)/4dm1n-n3ur0v4nt4/client-side-link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  Info,
  Phone,
  Settings,
  Briefcase,
  Factory,
  Star,
  GraduationCap,
  Navigation,
  Layers,
  LayoutDashboard,
} from "lucide-react";

type NavEntry = {
  group?: string;
  name: string;
  href: string;
  icon: typeof Home;
  exact?: boolean;
  hasChild?: boolean;
  children?: { name: string; href: string }[];
};

const navItems: NavEntry[] = [
  { name: "Dashboard", href: "/4dm1n-n3ur0v4nt4", icon: LayoutDashboard, exact: true },
  {
    group: "Pages",
    name: "Home",
    href: "/4dm1n-n3ur0v4nt4/home",
    icon: Home,
    hasChild: true,
    children: [
      { name: "Page", href: "/4dm1n-n3ur0v4nt4/home" },
      { name: "Enquiries", href: "/4dm1n-n3ur0v4nt4/home/enquiries" },
    ],
  },
  { name: "About", href: "/4dm1n-n3ur0v4nt4/about", icon: Info },
  { name: "Solutions", href: "/4dm1n-n3ur0v4nt4/solutions", icon: Briefcase },
  { name: "Systems", href: "/4dm1n-n3ur0v4nt4/systems", icon: Layers },
  { name: "Industries", href: "/4dm1n-n3ur0v4nt4/industries", icon: Factory },
  { name: "Experience", href: "/4dm1n-n3ur0v4nt4/experience", icon: Star },
  {
    name: "Careers",
    href: "/4dm1n-n3ur0v4nt4/careers",
    icon: GraduationCap,
    hasChild: true,
    children: [
      { name: "Page", href: "/4dm1n-n3ur0v4nt4/careers" },
      { name: "Applications", href: "/4dm1n-n3ur0v4nt4/careers/applications" },
    ],
  },
  {
    name: "Contact",
    href: "/4dm1n-n3ur0v4nt4/contact",
    icon: Phone,
    hasChild: true,
    children: [
      { name: "Page", href: "/4dm1n-n3ur0v4nt4/contact" },
      { name: "Enquiries", href: "/4dm1n-n3ur0v4nt4/contact/enquiries" },
    ],
  },
  {
    group: "Site & System",
    name: "Navigation",
    href: "/4dm1n-n3ur0v4nt4/navigation",
    icon: Navigation,
  },
  { name: "Settings", href: "/4dm1n-n3ur0v4nt4/settings", icon: Settings },
];

const AdminNavbar = ({ collapsed = false }: { collapsed?: boolean }) => {
  const pathname = usePathname();

  const isItemActive = (item: NavEntry) => {
    const ownMatch =
      pathname === item.href ||
      (!item.exact && pathname?.startsWith(`${item.href}/`));
    const childMatch = item.children?.some(
      (child) =>
        pathname === child.href || pathname?.startsWith(`${child.href}/`),
    );
    return Boolean(ownMatch || childMatch);
  };

  const activeParentHref = () =>
    navItems.find((item) => item.hasChild && isItemActive(item))?.href ?? null;

  const [openLink, setOpenLink] = useState<string | null>(activeParentHref);

  useEffect(() => {
    setOpenLink(activeParentHref());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return navItems.map((item, index) => {
    const Icon = item.icon;
    return (
      <div key={item.href}>
        {item.group &&
          (collapsed ? (
            <div
              className={`mx-auto mb-2 h-px w-6 bg-white/15 ${index === 0 ? "mt-1" : "mt-4"}`}
            />
          ) : (
            <p
              className={`flex items-center gap-2 px-2.5 pb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/35 ${
                index === 0 ? "pt-1" : "pt-5"
              }`}
            >
              {item.group}
              <span className="h-px flex-1 bg-white/10" />
            </p>
          ))}
        <ClientSideLink
          href={item.href}
          name={item.name}
          icon={<Icon className="h-4 w-4" />}
          isOpen={openLink === item.href}
          setOpenLink={setOpenLink}
          hasChild={item.hasChild}
          isActiveOverride={isItemActive(item)}
          collapsed={collapsed}
        >
          {item.children}
        </ClientSideLink>
      </div>
    );
  });
};

export default AdminNavbar;
