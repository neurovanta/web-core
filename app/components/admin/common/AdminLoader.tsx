import { cn } from "@/lib/utils";

// Brand spinner for the CMS: page switches (loading.tsx) and data loading (AdminLoadable).
export default function AdminLoader({
  label = "Loading",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-24",
        className,
      )}
    >
      <span className="relative flex h-12 w-12">
        <span className="absolute inset-0 rounded-full border-[3px] border-primary/70" />
        <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-secondary border-r-[#BFA373]" />
      </span>
      <span className="text-[13px] font-medium tracking-wide text-secondary/70">
        {label}…
      </span>
    </div>
  );
}
