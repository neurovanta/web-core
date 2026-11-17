"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { ChevronDown } from "lucide-react";

interface ClientSideLinkProps {
  href: string;
  name: string;
  icon: React.ReactNode;
  className?: string;
  children?: { href: string; name: string }[];
  isOpen?: boolean;
  setOpenLink?: (href: string | null) => void;
  hasChild?: boolean;
  isActiveOverride?: boolean;
  /** Icon-only sidebar mode: hides the label and shows it as a hover tooltip. */
  collapsed?: boolean;
}

function ClientSideLink({
  href,
  name,
  icon,
  className,
  children,
  isOpen = false,
  setOpenLink,
  hasChild = false,
  isActiveOverride,
  collapsed = false,
}: ClientSideLinkProps) {
  const pathname = usePathname();
  const isLogout = href === "/admin/logout";

  const isActive =
    !isLogout &&
    (isActiveOverride ??
      (pathname === href || pathname?.startsWith(`${href}/`)));

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        window.location.href = "/admin/login";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showChildren = hasChild && children && !collapsed;

  return (
    <div>
      <Link
        href={isLogout ? "#" : href}
        aria-label={collapsed ? name : undefined}
        aria-current={isActive ? "page" : undefined}
        onClick={(e) => {
          if (isLogout) {
            e.preventDefault();
            handleLogout();
            return;
          }
          setOpenLink?.(isOpen ? null : href);
        }}
        className={cn(
          "group relative flex items-center gap-3 rounded-xl py-2 text-[14px] font-medium transition-all duration-200",
          collapsed ? "justify-center px-0" : "justify-between px-2.5",
          isActive
            ? "bg-gradient-to-r from-[#BFA373]/[0.16] to-[#BFA373]/[0.04] text-secondary"
            : "text-gray-600 hover:bg-cream-bg hover:text-secondary",
          className,
        )}
      >
        {isActive && (
          <span className="absolute -left-3 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[#BFA373]" />
        )}
        <span className="flex items-center gap-3 min-w-0">
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
              isActive
                ? "bg-secondary text-[#E2D3C3] shadow-[0_6px_14px_-6px_rgba(81,70,62,0.7)]"
                : "bg-cream-bg text-secondary/60 group-hover:bg-white group-hover:text-secondary group-hover:shadow-sm",
              isLogout &&
                "bg-red-50 text-red-600 group-hover:bg-red-100 group-hover:text-red-700",
            )}
          >
            {icon}
          </span>
          {!collapsed && <span className="truncate">{name}</span>}
        </span>
        {hasChild && !collapsed && (
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        )}

        {/* Tooltip in collapsed mode */}
        {collapsed && (
          <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-secondary px-2.5 py-1 text-[12px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
            {name}
          </span>
        )}
      </Link>

      {showChildren && (
        <div
          className={cn(
            "grid transition-all duration-200 ease-out",
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <div className="ml-7 mt-1 mb-1 flex flex-col gap-0.5 border-l border-border-color/70 pl-3">
              {children.map((item) => {
                const isChildActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                      isChildActive
                        ? "bg-secondary/[0.05] text-secondary"
                        : "text-gray-500 hover:bg-cream-bg hover:text-secondary",
                    )}
                  >
                    {isChildActive && (
                      <span className="absolute -left-[13px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 -translate-x-1/2 rounded-full bg-[#BFA373]" />
                    )}
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(ClientSideLink);
