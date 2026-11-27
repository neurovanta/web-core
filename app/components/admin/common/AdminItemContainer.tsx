"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminItemContainerProps {
  children: React.ReactNode;
  // false: always open, no toggle (containers whose first child is not a section title)
  expansion?: boolean;
}

const cardClass =
  "flex flex-col rounded-2xl border border-border-color/50 bg-white shadow-[0_1px_2px_rgba(81,70,62,0.05),0_10px_30px_-14px_rgba(81,70,62,0.16)] transition-[box-shadow,border-color] duration-300 hover:border-secondary/30 hover:shadow-[0_1px_2px_rgba(81,70,62,0.06),0_16px_36px_-14px_rgba(81,70,62,0.28)]";

// CMS section card. The first child is the header (the section title); clicking it opens / closes the rest.
// Starts collapsed. Closed content is only hidden (0 height), never unmounted, so every field keeps its value and is
// still submitted. It opens by itself when a field inside it gets focus (react-hook-form focuses the first invalid
// field) or a validation message ([data-form-error]) appears in it, so errors are never hidden in a closed section.
const AdminItemContainer = ({ children, expansion = true }: AdminItemContainerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // content is clipped only while closed or animating; once fully open, dropdowns / pickers inside can overflow
  const [isOpenSettled, setIsOpenSettled] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const [header, ...content] = React.Children.toArray(children);

  useEffect(() => {
    const el = contentRef.current;
    if (!expansion || !el) return;
    const observer = new MutationObserver(() => {
      if (el.querySelector("[data-form-error]")) setIsExpanded(true);
    });
    observer.observe(el, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [expansion]);

  if (!expansion) {
    return <div className={cn(cardClass, "gap-2")}>{children}</div>;
  }

  const toggle = () => {
    setIsOpenSettled(false);
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      className={cn(
        cardClass,
        isExpanded &&
          "border-secondary/25 shadow-[0_1px_2px_rgba(81,70,62,0.06),0_18px_40px_-18px_rgba(81,70,62,0.3)]",
      )}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        className={cn(
          "group flex min-h-[64px] cursor-pointer select-none items-center justify-between gap-2 pr-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/20",
          // section title: roomier, no divider (the card adds one when open), accent bar grows when open
          "[&>div>label]:cursor-pointer [&>div>label]:border-b-0 [&>div>label]:py-5 [&>div>label]:pl-6 [&>div>label]:before:transition-all [&>div>label]:before:duration-300",
          isExpanded
            ? "rounded-t-2xl bg-gradient-to-r from-primary/35 via-transparent to-transparent [&>div>label]:before:h-8"
            : "rounded-2xl hover:bg-gradient-to-r hover:from-primary/30 hover:via-primary/10 hover:to-transparent",
        )}
      >
        <div className="min-w-0 flex-1">{header}</div>
        <span
          aria-hidden
          className={cn(
            "mr-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
            isExpanded
              ? "border-secondary bg-secondary text-white shadow-[0_4px_12px_-4px_rgba(81,70,62,0.55)]"
              : "border-border-color/60 bg-cream-bg text-secondary/70 group-hover:border-secondary/40 group-hover:bg-primary/40 group-hover:text-secondary",
          )}
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform duration-300", isExpanded && "rotate-180")}
          />
        </span>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-in-out",
          isExpanded ? "border-t border-border-color/40" : "border-t-0",
        )}
        style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
        onTransitionEnd={(e) => {
          if (e.target === e.currentTarget) setIsOpenSettled(isExpanded);
        }}
      >
        <div
          ref={contentRef}
          className={cn("min-h-0", isExpanded && isOpenSettled ? "overflow-visible" : "overflow-hidden")}
          onFocusCapture={() => setIsExpanded(true)}
        >
          <div className="flex flex-col gap-2">{content}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminItemContainer;
