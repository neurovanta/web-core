"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Lets an editor page tell the page header which website URL it edits
// (e.g. a solution's /solutions/<slug>), for the header's "View on website" link.
type VisitLinkState = {
  href: string | null;
  setHref: (href: string | null) => void;
};

const VisitLinkContext = createContext<VisitLinkState>({
  href: null,
  setHref: () => {},
});

export const useAdminVisitLink = () => useContext(VisitLinkContext).href;

export function AdminVisitLinkProvider({ children }: { children: React.ReactNode }) {
  const [href, setHref] = useState<string | null>(null);
  return (
    <VisitLinkContext.Provider value={{ href, setHref }}>
      {children}
    </VisitLinkContext.Provider>
  );
}

export default function AdminVisitLink({ href }: { href: string | null }) {
  const { setHref } = useContext(VisitLinkContext);
  useEffect(() => {
    setHref(href);
    return () => setHref(null);
  }, [href, setHref]);
  return null;
}
