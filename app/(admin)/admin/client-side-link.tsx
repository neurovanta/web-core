"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { MdExpandCircleDown } from "react-icons/md";

interface ClientSideLinkProps {
  href: string;
  name: string;
  icon: React.ReactNode;
  className?: string;
  children?: { href: string; name: string }[];
  isOpen?: boolean;
  setOpenLink?: (href: string | null) => void;
  hasChild?: boolean;
}

// Client component for handling active states
function ClientSideLink({
  href,
  name,
  icon,
  className,
  children,
  isOpen = false,
  setOpenLink,
  hasChild = false,
}: ClientSideLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === `${href}` || pathname?.startsWith(`${href}/`);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = "/admin/login";
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Link
        href={href == "/admin/logout" ? "#" : href}
        onClick={() => {
          // Prevent navigation on click
          setOpenLink?.(isOpen ? null : href);
          if (href === "/admin/logout") {
            handleLogout();
            return;
          }
        }}
        className={cn(
          "flex items-center px-4 py-3 text-md font-medium transition-colors justify-between",
          "hover:bg-primary/40 hover:text-secondary/80",
          isActive ? "bg-primary text-white" : "text-gray-700",
          className,
        )}
      >
        <div className="flex items-center">
          <span className="mr-3">{icon}</span>
          {name}
        </div>
        {hasChild &&
          (!isOpen ? (
            <MdExpandCircleDown className="ml-1 mt-1" />
          ) : (
            <MdExpandCircleDown className="ml-1 mt-1 rotate-180" />
          ))}
      </Link>
      {isOpen && children && (
        <div className="flex pl-14 flex-col items-start gap-2">
          {children.map((item, index) => {
            const isChildActive = pathname === item.href;
            return (
              <div key={index} className="flex items-center gap-2">
                <div>-</div>
                <Link
                  href={item.href}
                  className={cn(
                    "w-full rounded-md cursor-pointer hover:bg-gray-50 hover:text-primary text-[15px] font-medium px-2 py-0.5",
                    isChildActive && "text-primary font-semibold",
                  )}
                >
                  {item.name}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default memo(ClientSideLink);
