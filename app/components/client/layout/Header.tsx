"use client";

import { IoSearch } from "react-icons/io5";
import { PiPhoneLight } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { useAppShell } from "./AppShell";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NavDropdown, NavDropdownHandle } from "./NavDropdown";
import Image from "next/image";
import MenuIcon from "./HamburgerAniamtion";
import { usePathname, useRouter } from "next/navigation";
import { NavData } from "@/app/types/header";
import { headerScrollLock } from "@/lib/headerScrollLock";
import { useSiteSearch } from "@/app/hooks/useSiteSearch";
import { SearchItem } from "@/app/types/search";

const dropDown = (delay: number) => ({
  hidden: { y: -22, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay,
      duration: 0.7,
      ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
    },
  },
});

// Shared result rows for the xl+ dropdown and the below-xl panel.
function SearchResults({
  results,
  emptyText,
  onSelect,
  desktop = false,
}: {
  results: SearchItem[];
  emptyText: string | null;
  onSelect: () => void;
  desktop?: boolean;
}) {
  return (
    <div className="bg-black/90 backdrop-blur-[20px] rounded-[12px] py-2">
      {results.length === 0 && emptyText && (
        <p className="px-5 py-3 text-white/70 text-sm">{emptyText}</p>
      )}
      {results.map((result, i) => (
        <motion.div
          key={result.href}
          initial={{ opacity: 0, y: desktop ? -6 : -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.2 }}
        >
          <Link
            href={result.href}
            onClick={onSelect}
            className={`flex items-center gap-3 px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors duration-200 mx-1 ${desktop ? "rounded-lg group" : "rounded-[12px]"}`}
          >
            <IoSearch className="w-3.5 h-3.5 opacity-80 shrink-0" />
            <span
              data-text={desktop ? result.title : undefined}
              className={`min-w-0 flex-1 truncate ${desktop ? "contact-link" : ""}`}
            >
              {result.title}
            </span>
            <span className="shrink-0 text-[11px] uppercase tracking-[0.06em] text-white/50">
              {result.type}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

const getHeaderPadding = () => {
  return window.innerWidth < 1024 ? "30px" : "50px";
};

// Only compositor-friendly properties animate; padding/backdrop-filter changes apply instantly.
const HEADER_TRANSITION =
  "transform 0.6s cubic-bezier(0.77,0,0.175,1), opacity 0.6s cubic-bezier(0.77,0,0.175,1)";
const SCROLLED_BG =
  "linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 52.69%, rgba(0,0,0,0.5) 100%)";
const SCROLLED_BLUR = "blur(16px)";

export default function Header({ navData }: { navData: NavData }) {
  const { animateIn } = useAppShell();

  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const isHidden = useRef(false);
  const dropdownRef = useRef<NavDropdownHandle>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuOpenRef = useRef(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchPanelRef = useRef<HTMLDivElement>(null);
  const searchFocusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bgRestoreTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (searchFocusTimer.current) clearTimeout(searchFocusTimer.current);
      if (bgRestoreTimer.current) clearTimeout(bgRestoreTimer.current);
    },
    [],
  );

  const pathname = usePathname();
  const router = useRouter();
  const isCareerPage = pathname.startsWith("/careers/");

  const {
    results: filteredResults,
    status: searchStatus,
    load: loadSearch,
  } = useSiteSearch(searchQuery);

  // Message for a typed query with nothing to list; null keeps the panel closed.
  const searchEmptyText =
    searchQuery.trim().length < 2
      ? null
      : searchStatus === "ready"
        ? "No results found"
        : searchStatus === "error"
          ? "Search is unavailable right now"
          : null;
  const showSearchResults = filteredResults.length > 0 || searchEmptyText !== null;

  const openSearch = () => {
    setSearchOpen(true);
    loadSearch();
    // focus the right input depending on viewport
    if (searchFocusTimer.current) clearTimeout(searchFocusTimer.current);
    searchFocusTimer.current = setTimeout(() => {
      if (window.innerWidth >= 1280) {
        searchInputRef.current?.focus();
      } else {
        mobileSearchInputRef.current?.focus();
      }
    }, 350);
  };

  const closeSearch = useCallback(() => {
    if (searchFocusTimer.current) clearTimeout(searchFocusTimer.current);
    setSearchOpen(false);
    setSearchQuery("");
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") closeSearch();
    if (e.key === "Enter" && filteredResults[0]) {
      router.push(filteredResults[0].href);
      closeSearch();
    }
  };

  // Close on outside click
  useEffect(() => {
    if (!searchOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target) &&
        !mobileSearchPanelRef.current?.contains(target)
      ) {
        closeSearch();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [searchOpen, closeSearch]);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
    if (bgRestoreTimer.current) {
      clearTimeout(bgRestoreTimer.current);
      bgRestoreTimer.current = null;
    }
    const el = headerRef.current;
    if (!el) return;
    if (menuOpen) {
      el.style.background = "transparent";
      el.style.backdropFilter = "blur(0px)";
      if (isHidden.current) {
        isHidden.current = false;
        el.style.transform = "translateY(0%)";
        el.style.opacity = "1";
        el.style.pointerEvents = "auto";
      }
    } else {
      bgRestoreTimer.current = setTimeout(() => {
        bgRestoreTimer.current = null;
        // Menu may have been reopened within the delay — never paint over it.
        if (menuOpenRef.current) return;
        if (window.scrollY > 10) {
          el.style.background = SCROLLED_BG;
          el.style.backdropFilter = SCROLLED_BLUR;
        }
      }, 400);
    }
  }, [menuOpen]);

  const hideHeader = useCallback(() => {
    const el = headerRef.current;
    if (!el || menuOpenRef.current || isHidden.current) return;
    isHidden.current = true;
    el.style.transform = "translateY(-130%)";
    el.style.opacity = "0";
    el.style.pointerEvents = "none";
  }, []);

  const showHeader = useCallback(() => {
    const el = headerRef.current;
    if (!el || !isHidden.current) return;
    isHidden.current = false;
    el.style.transform = "translateY(0%)";
    el.style.opacity = "1";
    el.style.pointerEvents = "auto";
  }, []);

  useEffect(() => {
    headerScrollLock.registerHeader({ hide: hideHeader, show: showHeader });
    return () => headerScrollLock.unregisterHeader();
  }, [hideHeader, showHeader]);

  useEffect(() => {
    const setPadding = (el: HTMLElement) => {
      const padding = getHeaderPadding();
      if (el.style.paddingTop !== padding) el.style.paddingTop = padding;
      if (el.style.paddingBottom !== padding) el.style.paddingBottom = padding;
    };

    // Distance scrolled in the current direction; small jitters (Safari toolbar resize,
    // smooth-scroll settling) must not flip the header, so hide/show need a little travel.
    let travel = 0;
    const HIDE_AFTER = 8; // px down
    const SHOW_AFTER = 4; // px up

    const update = () => {
      if (headerScrollLock.active) return;
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;
      lastScrollY.current = currentY;
      if (diff === 0) return;
      travel = Math.sign(diff) === Math.sign(travel) ? travel + diff : diff;

      const el = headerRef.current;
      if (!el) return;

      if (currentY <= 10) {
        setIsScrolled(false);
        el.style.background = "transparent";
        el.style.backdropFilter = "blur(0px)";
        setPadding(el);
        showHeader();
      } else if (travel > 0) {
        if (travel >= HIDE_AFTER) hideHeader();
      } else if (travel <= -SHOW_AFTER) {
        setIsScrolled(true);
        showHeader();
        if (!menuOpenRef.current) {
          el.style.background = SCROLLED_BG;
          el.style.backdropFilter = SCROLLED_BLUR;
        }
        setPadding(el);
      }
    };

    // Coalesce scroll events to one update per frame. A pending frame that never runs
    // (Safari / background tabs can drop requestAnimationFrame callbacks) must not block
    // scrolling forever - that left the header stuck hidden after a page was open a while.
    let rafId = 0;
    let rafAt = 0;
    const onScroll = () => {
      const now = performance.now();
      if (rafId && now - rafAt < 100) return;
      if (rafId) cancelAnimationFrame(rafId); // stale frame: drop it and schedule a new one
      rafAt = now;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        update();
      });
    };

    // Back from another tab / app, or restored from the back-forward cache:
    // forget any pending frame and re-sync, showing the header near the top.
    const resync = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      travel = 0;
      lastScrollY.current = window.scrollY;
      if (window.scrollY <= 10) showHeader();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") resync();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pageshow", resync);
    window.addEventListener("focus", resync);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pageshow", resync);
      window.removeEventListener("focus", resync);
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [hideHeader, showHeader]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const currentY = window.scrollY;
    lastScrollY.current = currentY;

    if (currentY > 10) {
      isHidden.current = true;
      el.style.transition = "none";
      el.style.transform = "translateY(-130%)";
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = HEADER_TRANSITION;
        });
      });
    }
  }, []);

  const handleToggle = () => {
    dropdownRef.current?.toggle();
  };

  // Menu overlay is dark, so icons go light while it's open.
  const iconColorClass = menuOpen
    ? "text-white border-white"
    : !isScrolled && isCareerPage
      ? "text-secondary border-secondary"
      : "text-primary border-primary";

  const iconTextClass = menuOpen
    ? "text-white"
    : !isScrolled && isCareerPage
      ? "text-secondary"
      : "text-primary";

  return (
    <MotionConfig reducedMotion="user">
      <header
        ref={headerRef}
        className="pt-[30px] lg:pt-[50px]"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          transform: "translateY(0%)",
          opacity: 1,
          transition: HEADER_TRANSITION,
          pointerEvents: "auto",
        }}
      >
        {/* ── Main header row ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between w-full container">
          {/* ── Left — Hamburger ────────────────────────────────────────────── */}
          <motion.div
            className="w-[30%] max-[359px]:w-auto max-[359px]:shrink-0 flex items-center"
            initial="hidden"
            animate={animateIn ? "visible" : "hidden"}
            variants={dropDown(0.18)}
          >
            <button
              onClick={handleToggle}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex items-center justify-center cursor-pointer"
            >
              <MenuIcon open={menuOpen} dark={isCareerPage} />
            </button>
          </motion.div>

          {/* ── Centre — Logo ───────────────────────────────────────────────── */}
          <motion.div
            className="w-[40%] max-[359px]:w-auto max-[359px]:flex-1 max-[359px]:min-w-0 max-[359px]:px-3 flex justify-center items-center cursor-pointer"
            initial="hidden"
            animate={animateIn ? "visible" : "hidden"}
            variants={dropDown(0)}
          >
            <Link href="/">
              <Image
                src="/assets/logos/header-logo-full.svg"
                alt="Logo"
                width={500}
                height={150}
                className="max-w-[158px] max-[359px]:max-w-[128px] sm:max-w-[200px] md:max-w-[220px] lg:max-w-none h-[20px] max-[359px]:h-[16px] sm:h-[40px] pointer-events-none select-none"
              />
            </Link>
          </motion.div>

          {/* ── Right — Contact + Search ─────────────────────────────────────── */}
          <motion.div
            className="w-[30%] max-[359px]:w-auto max-[359px]:shrink-0 flex items-center justify-end gap-[11px] max-[359px]:gap-[7px] md:gap-[6px]"
            initial="hidden"
            animate={animateIn ? "visible" : "hidden"}
            variants={dropDown(0.18)}
          >
            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                onClick={() => dropdownRef.current?.close()}
                href="/contact-us"
              >
                <button className="hidden md:flex justify-center items-center bg-primary text-secondary text-center leading-1 rounded-[50px] text-15 uppercase px-20 py-[3px] cursor-pointer 3xl:w-[109px] h-[30px] sm:h-8">
                  Contact
                </button>
              </Link>
            </motion.div>

            {/* Phone icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex md:hidden"
            >
              <Link
                href="/contact-us"
                aria-label="Contact us"
                onClick={() => dropdownRef.current?.close()}
                className={`flex items-center justify-center w-[30px] h-[30px] max-[359px]:w-[27px] max-[359px]:h-[27px] sm:w-8 sm:h-8 rounded-full border ${iconColorClass} cursor-pointer transition-colors duration-500`}
              >
                <PiPhoneLight
                  strokeWidth={6}
                  className="w-auto h-[15px] max-[359px]:h-[13px] sm:h-[20px]"
                />
              </Link>
            </motion.div>

            {/* ── Search ────────────────────────────────────────────────────── */}
            <div
              ref={searchContainerRef}
              className="relative flex items-center justify-end"
            >
              {/* ── BELOW xl: icon toggles between search & close ────────────── */}
              <button
                onClick={searchOpen ? closeSearch : openSearch}
                className={`xl:hidden flex items-center justify-center w-[30px] h-[30px] max-[359px]:w-[27px] max-[359px]:h-[27px] sm:w-8 sm:h-8 rounded-full border ${iconColorClass} cursor-pointer transition-colors duration-500`}
                aria-label={searchOpen ? "Close search" : "Open search"}
              >
                <AnimatePresence mode="wait">
                  {searchOpen ? (
                    <motion.span
                      key="close"
                      initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-center"
                    >
                      <IoClose
                        className={`w-auto h-[17px] sm:h-[18px] ${iconTextClass}`}
                      />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="search"
                      initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-center"
                    >
                      <IoSearch
                        className={`w-auto h-[15px] sm:h-[20px] ${iconTextClass}`}
                      />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* ── ABOVE xl: inline expanding bar (unchanged) ───────────────── */}
              <motion.div
                animate={{ width: searchOpen ? 280 : 32 }}
                transition={{ type: "spring", stiffness: 280, damping: 25 }}
                className={`hidden xl:flex items-center overflow-hidden rounded-full border ${iconColorClass} h-[30px] sm:h-8 transition-colors duration-500`}
                style={{ minWidth: 32 }}
              >
                <button
                  onClick={searchOpen ? undefined : openSearch}
                  className="shrink-0 flex items-center justify-center w-[30px] sm:w-8 h-full cursor-pointer"
                  aria-label="Open search"
                >
                  <IoSearch className="w-auto h-[15px] sm:h-[18px]" />
                </button>

                <AnimatePresence>
                  {searchOpen && (
                    <motion.input
                      ref={searchInputRef}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: 0.15 }}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      placeholder="Search..."
                      className="flex-1 bg-transparent text-sm outline-none placeholder-current min-w-0 pr-1"
                    />
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {searchOpen && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2, delay: 0.2 }}
                      onClick={closeSearch}
                      className="shrink-0 flex items-center justify-center w-7 h-full cursor-pointer text-current opacity-70 hover:opacity-100 transition-opacity"
                      aria-label="Close search"
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      >
                        <path d="M1 1l8 8M9 1l-8 8" />
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* ── xl+ results dropdown (anchored to inline bar) ─────────────── */}
              <AnimatePresence>
                {searchOpen && showSearchResults && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                    className="hidden xl:block border border-white/20 absolute top-full mt-2 right-0 max-w-[370px] 2xl:max-w-[500px] min-w-[280px] overflow-hidden rounded-[12px]"
                    style={{ zIndex: 1001 }}
                  >
                    <SearchResults
                      desktop
                      results={filteredResults}
                      emptyText={searchEmptyText}
                      onSelect={closeSearch}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* ── BELOW xl: 300px pill + results, stacked in flow (no overflow-hidden wrapper) ── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className="xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              // transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            >
              <div
                ref={mobileSearchPanelRef}
                className="container pb-4 pt-3 flex flex-col items-end gap-2"
              >
                {/* Pill — width: 0 → 300 spring from right */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  exit={{ scaleX: 0, opacity: 0 }}
                  transition={{
                    scaleX: { type: "spring", stiffness: 280, damping: 25 },
                    opacity: { duration: 0.15 },
                  }}
                  className={`flex items-center overflow-hidden rounded-full border ${iconColorClass} h-[30px] sm:h-8`}
                  style={{
                    width: 300,
                    minWidth: 0,
                    transformOrigin: "right center",
                  }}
                >
                  <span className="shrink-0 flex items-center justify-center w-8 h-full">
                    <IoSearch
                      className={`w-auto h-[15px] sm:h-[18px] ${iconTextClass}`}
                    />
                  </span>
                  <motion.input
                    ref={mobileSearchInputRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, delay: 0.25 }}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search..."
                    className={`flex-1 bg-transparent text-sm outline-none placeholder-current min-w-0 ${iconTextClass}`}
                  />
                </motion.div>

                {/* Results — in normal flow, same 300px width, shutter down */}
                <AnimatePresence>
                  {showSearchResults && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                      className="w-[300px] overflow-hidden rounded-[12px]"
                      style={{ zIndex: 1001 }}
                    >
                      <SearchResults
                        results={filteredResults}
                        emptyText={searchEmptyText}
                        onSelect={closeSearch}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <NavDropdown
        ref={dropdownRef}
        onOpenChange={setMenuOpen}
        navData={navData}
        trapWithin={headerRef}
      />
    </MotionConfig>
  );
}
