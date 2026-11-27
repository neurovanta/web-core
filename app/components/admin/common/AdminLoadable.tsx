"use client";

import AdminLoader from "./AdminLoader";

// Shows a spinner until the page's data has loaded. The page stays mounted underneath
// (invisible, not removed) so form fields keep receiving their loaded values, and its
// Save button is hidden too, so a half-loaded form cannot be saved.
export default function AdminLoadable({
  loading,
  label = "Loading page",
  children,
}: {
  loading: boolean;
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-x-0 top-0 z-10">
          <AdminLoader label={label} />
        </div>
      )}
      <div
        className={loading ? "invisible" : undefined}
        aria-hidden={loading || undefined}
      >
        {children}
      </div>
    </div>
  );
}
