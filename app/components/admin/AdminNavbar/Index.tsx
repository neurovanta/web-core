"use client";

import ClientSideLink from "@/app/(admin)/admin/client-side-link";
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
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { group: "Pages", name: "Home", href: "/admin/home", icon: Home },
  { name: "About", href: "/admin/about", icon: Info },
  { name: "Solutions", href: "/admin/solutions", icon: Briefcase },
  { name: "Systems", href: "/admin/systems", icon: Layers },
  { name: "Industries", href: "/admin/industries", icon: Factory },
  { name: "Experience", href: "/admin/experience", icon: Star },
  { name: "Careers", href: "/admin/careers", icon: GraduationCap },
  { name: "Contact", href: "/admin/contact", icon: Phone },
  {
    group: "Site & System",
    name: "Navigation",
    href: "/admin/navigation",
    icon: Navigation,
  },
  { name: "Settings", href: "/admin/settings", icon: Settings },
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
              className={`mx-auto mb-2 h-px w-6 bg-border-color ${index === 0 ? "mt-1" : "mt-4"}`}
            />
          ) : (
            <p
              className={`flex items-center gap-2 px-2.5 pb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-gray-400 ${
                index === 0 ? "pt-1" : "pt-5"
              }`}
            >
              {item.group}
              <span className="h-px flex-1 bg-border-color/60" />
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
