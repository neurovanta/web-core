"use client";

import { ChevronRight, ExternalLink, Inbox, Link2, Plus } from "lucide-react";
import { RiDeleteBin6Line, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { cn } from "@/lib/utils";

export interface AdminListItem {
  key: string;
  id?: string;
  title: string;
  slug?: string;
  isHidden?: boolean;
}

interface AdminItemListProps {
  heading: string; // "Industries"
  singular: string; // "Industry"
  sitePrefix: string; // "/industries"
  items: AdminListItem[];
  onAdd: () => void;
  onOpen: (id: string) => void;
  onToggleVisibility: (
    e: React.MouseEvent,
    id: string,
    index: number,
    isHidden: boolean,
  ) => void;
  onDelete: (id: string, index: number, label: string) => void;
  className?: string;
}

const iconBtn =
  "inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/20";

// CMS list of pages (industries, solutions): visibility, title, website slug, open on site, delete.
// Actions save straight away; clicking a row opens its editor.
export default function AdminItemList({
  heading,
  singular,
  sitePrefix,
  items,
  onAdd,
  onOpen,
  onToggleVisibility,
  onDelete,
  className,
}: AdminItemListProps) {
  const hiddenCount = items.filter((i) => i.isHidden).length;

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border-color/50 bg-white shadow-[0_1px_2px_rgba(81,70,62,0.05),0_10px_30px_-14px_rgba(81,70,62,0.16)]",
        className,
      )}
    >
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-color/50 px-6 py-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[16px] font-semibold text-secondary">
            {heading}
          </h2>
          <p className="text-[12.5px] text-secondary/60">
            {items.length}{" "}
            {items.length === 1
              ? singular.toLowerCase()
              : heading.toLowerCase()}
            {hiddenCount > 0 && ` · ${hiddenCount} hidden`} · click a row to
            edit. Show / hide and delete save straight away.
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-secondary px-4 text-[13.5px] font-medium text-white shadow-[0_6px_16px_-8px_rgba(81,70,62,0.8)] transition-colors hover:bg-[#3f3630] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary/20"
        >
          <Plus className="h-4 w-4" />
          Add {singular}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-6 py-12 text-center text-sm text-secondary/60">
          <Inbox className="h-8 w-8 text-secondary/30" />
          No {heading.toLowerCase()} yet.
        </div>
      ) : (
        <ul className="divide-y divide-border-color/40">
          {items.map((item, index) => {
            const label = item.title || `${singular} ${index + 1}`;
            const sitePath = item.slug ? `${sitePrefix}/${item.slug}` : null;
            const open = () => item.id && onOpen(item.id);
            return (
              <li
                key={item.key}
                role="button"
                tabIndex={0}
                title={`Edit ${singular.toLowerCase()}`}
                onClick={open}
                onKeyDown={(e) => {
                  if (e.target !== e.currentTarget) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open();
                  }
                }}
                className="group flex cursor-pointer items-center justify-between gap-4 px-6 py-3.5 transition-colors hover:bg-cream-bg/60 focus-visible:bg-cream-bg/60 focus-visible:outline-none"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <span className="w-5 shrink-0 text-right text-[12px] tabular-nums text-secondary/40">
                    {index + 1}
                  </span>

                  <button
                    type="button"
                    title={
                      item.isHidden
                        ? "Hidden on the website - click to show"
                        : "Visible on the website - click to hide"
                    }
                    aria-label={
                      item.isHidden ? `Show ${label}` : `Hide ${label}`
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.id)
                        onToggleVisibility(e, item.id, index, !!item.isHidden);
                    }}
                    className={cn(
                      iconBtn,
                      "border",
                      item.isHidden
                        ? "border-border-color/70 bg-white text-gray-400 hover:text-gray-600"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300",
                    )}
                  >
                    {item.isHidden ? (
                      <RiEyeOffLine size={16} />
                    ) : (
                      <RiEyeLine size={16} />
                    )}
                  </button>

                  <div className="flex min-w-0 flex-col gap-0.5">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className={cn(
                          "truncate text-[14.5px]",
                          item.isHidden
                            ? "text-secondary/50"
                            : "font-medium text-secondary",
                        )}
                      >
                        {label}
                      </span>
                      {item.isHidden && (
                        <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                          Hidden
                        </span>
                      )}
                    </div>
                    {/* website slug */}
                    {sitePath ? (
                      <span className="flex min-w-0 items-center gap-1 font-mono text-[12px] text-secondary/55">
                        <Link2 className="h-3 w-3 shrink-0" />
                        <span className="truncate">{sitePath}</span>
                      </span>
                    ) : (
                      <span className="text-[12px] text-amber-600">
                        No slug yet - add one in the editor
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <span className="hidden items-center gap-1 pr-2 text-[12.5px] font-medium text-secondary/0 transition-colors group-hover:text-secondary/70 sm:flex">
                    Edit
                    <ChevronRight className="h-4 w-4" />
                  </span>
                  {sitePath ? (
                    <a
                      href={sitePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title={
                        item.isHidden
                          ? "Hidden: the website page shows a 404"
                          : "View on website"
                      }
                      aria-label={`View ${label} on the website`}
                      className={cn(
                        iconBtn,
                        "text-secondary/60 hover:bg-primary/40 hover:text-secondary",
                      )}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <span
                      title="No website link yet (add a slug first)"
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        iconBtn,
                        "cursor-not-allowed text-secondary/20",
                      )}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </span>
                  )}
                  <button
                    type="button"
                    title={`Delete ${singular.toLowerCase()}`}
                    aria-label={`Delete ${label}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.id) onDelete(item.id, index, label);
                    }}
                    className={cn(
                      iconBtn,
                      "text-red-400 hover:bg-red-50 hover:text-red-600",
                    )}
                  >
                    <RiDeleteBin6Line size={16} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
