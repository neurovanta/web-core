"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  LogOut,
} from "lucide-react";
import AdminNavbar from "@/app/components/admin/AdminNavbar/Index";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "nv-admin-sidebar-collapsed";

const readCollapsed = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

const writeCollapsed = (value: boolean) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch {
    /* storage unavailable: preference just isn't remembered */
  }
};

export default function AdminSidebar({ username }: { username: string | null }) {
  const [collapsed, setCollapsed] = useState(false);

  // Restore the saved preference after mount (avoids a hydration mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCollapsed(readCollapsed());
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      writeCollapsed(!prev);
      return !prev;
    });
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      const data = await res.json();
      if (data.success) window.location.href = "/admin/login";
    } catch (error) {
      console.log(error);
    }
  };

  const displayName = username || "Admin";
  const initials =
    displayName
      .split(/[\s._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "A";

  return (
    <aside
      className={cn(
        "relative z-[45] shrink-0 bg-white flex flex-col h-screen border-r border-border-color/60 shadow-[2px_0_16px_-8px_rgba(81,70,62,0.18)] transition-[width] duration-300 ease-out",
        collapsed ? "w-[84px]" : "w-[272px]",
      )}
    >
      {/* Collapse toggle */}
      <button
        type="button"
        onClick={toggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-9 z-40 flex h-6 w-6 items-center justify-center rounded-full border border-border-color bg-white text-secondary/60 shadow-sm transition-all hover:scale-110 hover:text-secondary cursor-pointer"
      >
        {collapsed ? (
          <ChevronsRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronsLeft className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Brand */}
      <div className="relative overflow-hidden border-b border-border-color/60">
        <div className="pointer-events-none absolute -top-16 -right-10 h-36 w-36 rounded-full bg-[#BFA373]/15 blur-2xl" />
        <Link
          href="/admin"
          className={cn(
            "relative flex flex-col items-center gap-2.5 pt-7 pb-5",
            collapsed ? "px-3" : "px-6",
          )}
        >
          {collapsed ? (
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#C9B6AC] via-[#BFA373] to-[#7F6157] text-[15px] font-semibold tracking-tight text-white shadow-[0_8px_18px_-8px_rgba(127,97,87,0.8)]">
              NV
            </span>
          ) : (
            <>
              <Image
                src="/assets/logos/header-logo-full.svg"
                alt="Neuro Vanta"
                width={170}
                height={60}
                className="h-auto w-[160px]"
              />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-bg px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-secondary/60 ring-1 ring-border-color/50">
                <span className="h-1.5 w-1.5 rounded-full bg-[#BFA373]" />
                Admin Console
              </span>
            </>
          )}
        </Link>

        {/* View website */}
        <div className={cn("relative pb-4", collapsed ? "px-3" : "px-4")}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="View website"
            className={cn(
              "group flex items-center justify-center gap-2 rounded-xl border border-border-color/70 bg-white py-2 text-[13px] font-medium text-secondary/80 transition-all hover:border-[#BFA373] hover:bg-cream-bg hover:text-secondary",
              collapsed ? "px-0" : "px-3",
            )}
          >
            <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
            {!collapsed && "View website"}
          </a>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className={cn(
          "flex-1 px-3 py-4 flex flex-col gap-0.5 [scrollbar-width:thin]",
          // A scroll container would clip the hover tooltips in icon-only mode.
          collapsed ? "overflow-visible" : "overflow-y-auto",
        )}
      >
        <AdminNavbar collapsed={collapsed} />
      </nav>

      {/* Profile + logout */}
      <div className="border-t border-border-color/60 p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl bg-cream-bg/70 ring-1 ring-border-color/40",
            collapsed ? "flex-col p-2" : "p-2.5",
          )}
        >
          <span
            title={collapsed ? displayName : undefined}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-[12px] font-semibold text-[#E2D3C3] ring-2 ring-white"
          >
            {initials}
          </span>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-secondary">
                {displayName}
              </p>
              <p className="text-[11px] text-gray-500">Administrator</p>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
