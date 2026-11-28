"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  CornerDownLeft,
  EyeOff,
  Factory,
  FileText,
  Layers,
  Loader2,
  Search,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteSearch } from "@/app/hooks/useSiteSearch";
import { SearchItemType } from "@/app/types/search";

const TYPE_ICON: Record<SearchItemType, LucideIcon> = {
  Page: FileText,
  System: Layers,
  Solution: Briefcase,
  Industry: Factory,
};

// Sidebar trigger + ⌘K / Ctrl+K command palette for jumping to any admin page or CMS item.
// Uses the same lazy Fuse search as the website header, against the admin-only index.
export default function AdminSearch({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { results, status, load } = useSiteSearch(query, {
    endpoint: "/api/admin/search-index",
    limit: 12,
  });

  const [isMac, setIsMac] = useState(true);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
  }, []);

  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const openPalette = () => {
    setOpen(true);
    load(true);
  };

  const closePalette = () => {
    setOpen(false);
    setQuery("");
    setActive(0);
  };

  // ⌘K / Ctrl+K from anywhere in the admin
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (openRef.current) {
          setOpen(false);
          setQuery("");
          setActive(0);
        } else {
          setOpen(true);
          load(true);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [load]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // keep the highlighted row in view while arrowing through results
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (href: string) => {
    closePalette();
    router.push(href);
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") closePalette();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active].href);
    }
  };

  const hasQuery = query.trim().length >= 2;

  return (
    <>
      <button
        type="button"
        onClick={openPalette}
        title={`Search (${isMac ? "⌘" : "Ctrl+"}K)`}
        aria-label="Search the CMS"
        className={cn(
          "group mt-2 flex w-full items-center gap-2 rounded-xl border border-white/10 bg-black/20 py-2 text-[13px] text-white/55 transition-all hover:border-[#BFA373]/60 hover:bg-white/[0.06] hover:text-white cursor-pointer",
          collapsed ? "justify-center px-0" : "px-3",
        )}
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">Search…</span>
            <kbd className="rounded-md border border-white/15 bg-white/[0.06] px-1.5 py-0.5 font-sans text-[10.5px] text-white/60">
              {isMac ? "⌘K" : "Ctrl K"}
            </kbd>
          </>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-[#1c1714]/45 px-4 pt-[12vh] backdrop-blur-sm"
          onMouseDown={(e) => e.target === e.currentTarget && closePalette()}
          role="dialog"
          aria-modal="true"
          aria-label="Search the CMS"
        >
          <div className="w-full max-w-[620px] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_30px_80px_-20px_rgba(28,23,20,0.55)]">
            <div className="flex items-center gap-3 border-b border-black/[0.07] px-5">
              <Search className="h-4 w-4 shrink-0 text-secondary/50" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder="Search pages, systems, solutions, industries…"
                className="h-14 flex-1 bg-transparent text-[15px] text-secondary outline-none placeholder:text-secondary/40"
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls="admin-search-results"
                aria-activedescendant={results[active] ? `admin-search-${active}` : undefined}
              />
              {status === "loading" && (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-secondary/40" />
              )}
              <kbd className="rounded-md border border-black/10 bg-black/[0.03] px-1.5 py-0.5 text-[10.5px] text-secondary/50">
                Esc
              </kbd>
            </div>

            <ul
              ref={listRef}
              id="admin-search-results"
              role="listbox"
              className="max-h-[min(420px,60vh)] overflow-y-auto p-2"
            >
              {results.map((item, i) => {
                const Icon = TYPE_ICON[item.type];
                const isActive = i === active;
                return (
                  <li
                    key={item.href}
                    id={`admin-search-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={isActive}
                    onMouseMove={() => setActive(i)}
                    onClick={() => go(item.href)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                      isActive ? "bg-secondary/[0.07]" : "",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                        isActive
                          ? "border-secondary bg-secondary text-white"
                          : "border-black/[0.07] bg-[#F4F1EC] text-secondary/70",
                      )}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="truncate text-[14px] font-medium text-secondary">
                          {item.title}
                        </span>
                        {item.isHidden && (
                          <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10.5px] font-medium text-amber-700 ring-1 ring-amber-200">
                            <EyeOff className="h-3 w-3" />
                            Hidden
                          </span>
                        )}
                      </span>
                      {item.description && (
                        <span className="truncate text-[12px] text-secondary/50">
                          {item.description}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-secondary/40">
                      {item.type}
                    </span>
                    <CornerDownLeft
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 text-secondary/40",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </li>
                );
              })}

              {results.length === 0 && (
                <li className="px-3 py-8 text-center text-[13px] text-secondary/50">
                  {status === "error"
                    ? "Search is unavailable right now. Close and try again."
                    : !hasQuery
                      ? "Type at least 2 characters to search admin pages and every system, solution and industry."
                      : status === "ready"
                        ? `No results for “${query.trim()}”`
                        : "Loading…"}
                </li>
              )}
            </ul>

            <div className="flex items-center gap-4 border-t border-black/[0.07] bg-[#F9F7F4] px-5 py-2.5 text-[11px] text-secondary/50">
              <span>↑ ↓ to navigate</span>
              <span>↵ to open</span>
              <span>Esc to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
