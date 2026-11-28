"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type Fuse from "fuse.js";
import { SearchItem } from "@/app/types/search";

const MAX_RESULTS = 8;

// Index + Fuse are fetched on the first open only, so pages that never use search pay nothing.
// Shared by the website header ("/api/search-index") and the CMS palette ("/api/admin/search-index").
export function useSiteSearch(
  query: string,
  { endpoint = "/api/search-index", limit = MAX_RESULTS }: { endpoint?: string; limit?: number } = {},
) {
  const [fuse, setFuse] = useState<Fuse<SearchItem> | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const loading = useRef<Promise<void> | null>(null);

  // `refresh` refetches the index (the CMS palette does this on every open so new
  // items show up); results from the previous index stay visible meanwhile.
  const load = useCallback((refresh = false) => {
    if (loading.current && !refresh) return loading.current;
    setStatus((prev) => (prev === "ready" ? prev : "loading"));
    loading.current = Promise.all([
      import("fuse.js"),
      fetch(endpoint).then((res) => {
        if (!res.ok) throw new Error(`Search index ${res.status}`);
        return res.json() as Promise<SearchItem[]>;
      }),
    ])
      .then(([{ default: FuseCtor }, items]) => {
        setFuse(
          new FuseCtor(items, {
            keys: [
              { name: "title", weight: 0.6 },
              { name: "keywords", weight: 0.2 },
              { name: "description", weight: 0.15 },
              { name: "type", weight: 0.05 },
            ],
            threshold: 0.35,
            ignoreLocation: true,
            minMatchCharLength: 2,
          }),
        );
        setStatus("ready");
      })
      .catch(() => {
        // allow a retry on the next open
        loading.current = null;
        setStatus("error");
      });
    return loading.current;
  }, [endpoint]);

  const results = useMemo(() => {
    const q = query.trim();
    if (!fuse || q.length < 2) return [];
    return fuse.search(q, { limit }).map((r) => r.item);
  }, [fuse, query, limit]);

  return { results, status, load };
}
