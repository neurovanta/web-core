"use client";

export interface AdminTab<K extends string> {
  key: K;
  label: string;
  count?: number;
}

interface AdminTabsProps<K extends string> {
  tabs: AdminTab<K>[];
  active: K;
  onChange: (key: K) => void;
}

/**
 * Sticky tab bar pinned to the top of the admin scroll area.
 * The negative top/margins cancel the scroll container's padding
 * (px-8 / pt-15 in the admin layout) so the bar sits flush.
 */
export default function AdminTabs<K extends string>({
  tabs,
  active,
  onChange,
}: AdminTabsProps<K>) {
  return (
    <div className="sticky -top-15 z-40 -mx-8 -mt-15 px-8 pt-4 pb-4 bg-[#F4F1EC]/85 backdrop-blur-md border-b border-black/[0.06]">
      <div
        role="tablist"
        className="inline-flex items-center gap-1 rounded-xl bg-white p-1 shadow-sm border border-black/10"
      >
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-secondary text-white shadow-sm"
                  : "text-gray-600 hover:bg-cream-bg hover:text-secondary"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-cream-bg text-secondary/60"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
