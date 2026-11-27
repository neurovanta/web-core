"use client";

import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSubmitButtonProps {
  // form is submitting: spinner, disabled (prevents double saves)
  saving?: boolean;
  label?: string;
  savingLabel?: string;
  className?: string;
}

// Page save button, shown on the right of the admin page header (see AdminPageActions).
export default function AdminSubmitButton({
  saving = false,
  label = "Save Changes",
  savingLabel = "Saving",
  className,
}: AdminSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={saving}
      aria-busy={saving}
      className={cn(
        "group/submit flex h-11 cursor-pointer items-center gap-2.5 rounded-full bg-secondary pl-2 pr-5 text-[14px] font-medium tracking-[0.02em] text-white shadow-[0_8px_20px_-10px_rgba(81,70,62,0.8)] transition-[background-color,box-shadow,transform] duration-200 hover:bg-[#3f3630] hover:shadow-[0_12px_24px_-10px_rgba(81,70,62,0.85)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary/20 disabled:cursor-not-allowed disabled:opacity-80 disabled:active:scale-100",
        className,
      )}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-colors duration-200 group-hover/submit:bg-primary group-hover/submit:text-secondary">
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" strokeWidth={2.5} />
        )}
      </span>
      <span>{saving ? savingLabel : label}</span>
    </button>
  );
}
