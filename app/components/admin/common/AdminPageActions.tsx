"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminPageActionsProps {
  children: ReactNode;
  // shows an "Unsaved changes" pill next to the buttons
  isDirty?: boolean;
  className?: string;
}

// Page-level actions (save button etc.), pinned to the right of the admin page header row.
export default function AdminPageActions({
  children,
  isDirty = false,
  className,
}: AdminPageActionsProps) {
  return (
    <div className={cn("fixed top-0 right-8 z-50 flex h-[88px] items-center gap-3", className)}>
      {isDirty && (
        <span
          role="status"
          className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 py-1.5 pl-2.5 pr-3 text-[12px] font-medium leading-none text-amber-700"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
          </span>
          Unsaved changes
        </span>
      )}
      {children}
    </div>
  );
}
