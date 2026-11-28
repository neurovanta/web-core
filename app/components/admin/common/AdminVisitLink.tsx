"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Lets an editor page tell the page header which website URL it edits
// (e.g. a solution's /solutions/<slug>), for the header's "View on website" link,
// and the name of the item being edited, shown as the header title.
type PageInfo = { href: string | null; title: string | null };

type VisitLinkState = PageInfo & {
  set: (info: PageInfo) => void;
};

const VisitLinkContext = createContext<VisitLinkState>({
  href: null,
  title: null,
  set: () => {},
});

export const useAdminVisitLink = () => useContext(VisitLinkContext).href;
export const useAdminPageTitle = () => useContext(VisitLinkContext).title;

export function AdminVisitLinkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [info, setInfo] = useState<PageInfo>({ href: null, title: null });
  return (
    <VisitLinkContext.Provider value={{ ...info, set: setInfo }}>
      {children}
    </VisitLinkContext.Provider>
  );
}

export default function AdminVisitLink({
  href,
  title = null,
}: {
  href: string | null;
  // item name for the header title (e.g. the solution being edited)
  title?: string | null;
}) {
  const { set } = useContext(VisitLinkContext);
  useEffect(() => {
    set({ href, title: title?.trim() || null });
    return () => set({ href: null, title: null });
  }, [href, title, set]);
  return null;
}
