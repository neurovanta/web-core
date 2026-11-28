"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type Pending = { href: string } | { element: HTMLElement };

// Lets code that navigates without a link (e.g. the CMS search palette) go through
// the active guard. Set while a guard with unsaved changes is mounted.
let requestLeave: ((href: string) => void) | null = null;

/** Opens the "Leave without saving?" dialog when a page has unsaved changes.
 *  Returns true when the guard took over; otherwise navigate as usual. */
export function guardNavigation(href: string): boolean {
  if (!requestLeave) return false;
  requestLeave(href);
  return true;
}

/**
 * Confirms before leaving a page with unsaved changes (ported from Brighton):
 * in-app links (sidebar, breadcrumb, header), elements marked `data-unsaved-guard`
 * (logout, list rows that open an editor) and type="button" actions next to Save.
 * Reload / tab close is handled by the browser prompt in useUnsavedChanges.
 */
export default function UnsavedLeaveGuard({
  active,
  sections,
  actionsRef,
}: {
  active: boolean;
  sections: string[];
  actionsRef: RefObject<HTMLElement | null>;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<Pending | null>(null);
  const bypass = useRef(false);

  useEffect(() => {
    if (!active) return;

    requestLeave = (href) => setPending({ href });

    const onClick = (e: MouseEvent) => {
      if (bypass.current || e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (!target || target.closest("[role=dialog]")) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (anchor) {
        if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
        const url = new URL(anchor.href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (
          url.pathname === window.location.pathname &&
          url.search === window.location.search
        )
          return;
        e.preventDefault();
        e.stopPropagation();
        setPending({ href: url.pathname + url.search + url.hash });
        return;
      }

      const guarded =
        target.closest<HTMLElement>("[data-unsaved-guard]") ??
        (actionsRef.current?.contains(target)
          ? target.closest<HTMLElement>('button[type="button"]')
          : null);
      if (guarded) {
        e.preventDefault();
        e.stopPropagation();
        setPending({ element: guarded });
      }
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      requestLeave = null;
    };
  }, [active, actionsRef]);

  const leave = () => {
    const next = pending;
    setPending(null);
    if (!next) return;
    if ("href" in next) {
      router.push(next.href);
    } else {
      bypass.current = true;
      next.element.click();
      bypass.current = false;
    }
  };

  const shown = sections.slice(0, 4);

  return (
    <Dialog open={!!pending} onOpenChange={(open) => !open && setPending(null)}>
      {/* Neurovanta admin palette: secondary = brown, primary = beige, cream-bg */}
      <DialogContent hideClose className="max-w-[420px] gap-0 overflow-hidden rounded-2xl border border-border-color/50 bg-white p-0 shadow-[0_30px_80px_-20px_rgba(28,23,20,0.55)]">
        <div className="flex flex-col items-center px-7 pb-6 pt-8 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6b5d52] to-secondary text-white shadow-[0_10px_22px_-10px_rgba(81,70,62,0.75),inset_0_1px_0_rgba(255,255,255,0.14)] ring-1 ring-black/5">
            <AlertTriangle className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <DialogTitle className="mt-5 text-[19px] font-semibold tracking-tight text-secondary">
            Leave without saving?
          </DialogTitle>
          <DialogDescription className="mt-2.5 max-w-[32ch] text-[13.5px] leading-relaxed text-secondary/60">
            You have unsaved changes on this page. If you leave now, they will
            be lost.
          </DialogDescription>

          {shown.length > 0 && (
            <div className="mt-5 flex w-full flex-wrap justify-center gap-1.5 rounded-xl border border-border-color/40 bg-cream-bg p-3">
              {shown.map((section) => (
                <span
                  key={section}
                  className="flex items-center gap-1.5 rounded-full border border-border-color/70 bg-white px-2.5 py-1.5 text-[12px] font-medium text-secondary"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  {section}
                </span>
              ))}
              {sections.length > shown.length && (
                <span className="flex items-center rounded-full px-2 py-1.5 text-[12px] text-secondary/60">
                  +{sections.length - shown.length} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-border-color/50 bg-[#F4F1EC] px-6 py-4">
          <button
            type="button"
            onClick={leave}
            className="h-11 cursor-pointer rounded-full border border-border-color bg-white text-[14px] font-medium text-secondary transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary/10"
          >
            Leave anyway
          </button>
          <button
            type="button"
            autoFocus
            onClick={() => setPending(null)}
            className="h-11 cursor-pointer rounded-full bg-secondary text-[14px] font-medium text-white shadow-[0_8px_20px_-10px_rgba(81,70,62,0.8)] transition-colors hover:bg-[#3f3630] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary/20"
          >
            Stay on page
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
