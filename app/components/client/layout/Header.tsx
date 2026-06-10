"use client";

import { IoSearch } from "react-icons/io5";
import { PiPhoneLight } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useAppShell } from "./AppShell";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { NavDropdown, NavDropdownHandle } from "./NavDropdown";
import Image from "next/image";
import MenuIcon from "./HamburgerAniamtion";
import { usePathname } from "next/navigation";

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

const MOCK_RESULTS = [
  { label: "About Neuro Vanta", href: "/about-us" },
  { label: "Our Systems", href: "/systems" },
  { label: "Industries", href: "/industries" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Solutions", href: "/solutions" },
];

const getHeaderPadding = () => {
  return window.innerWidth < 1024 ? "30px" : "50px";
};

export default function Header() {
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

  const pathname = usePathname();
  const isCareerPage = pathname.startsWith("/careers/");

  const filteredResults = useMemo(
    () =>
      MOCK_RESULTS.filter(
        (r) =>
          searchQuery.trim().length > 0 &&
          r.label.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  );

  const openSearch = () => {
    setSearchOpen(true);
    // focus the right input depending on viewport
    setTimeout(() => {
      if (window.innerWidth >= 1280) {
        searchInputRef.current?.focus();
      } else {
        mobileSearchInputRef.current?.focus();
      }
    }, 350);
  };

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!searchOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        closeSearch();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [searchOpen]);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
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
      setTimeout(() => {
        if (window.scrollY > 10) {
          el.style.background =
            // "linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.03) 52.69%, rgba(0,0,0,0.3) 100%)";
            "linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 52.69%, rgba(0,0,0,0.5) 100%)";
          el.style.backdropFilter = "blur(30px)";
        }
      }, 400);
    }
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;
      lastScrollY.current = currentY;

      const el = headerRef.current;
      if (!el) return;

      if (currentY <= 10) {
        setIsScrolled(false);
        el.style.background = "transparent";
        el.style.backdropFilter = "blur(0px)";
        const padding = getHeaderPadding();
        el.style.paddingTop = padding;
        el.style.paddingBottom = padding;
        if (isHidden.current) {
          isHidden.current = false;
          el.style.transform = "translateY(0%)";
          el.style.opacity = "1";
          el.style.pointerEvents = "auto";
        }
      } else if (diff > 0) {
        if (!menuOpenRef.current && !isHidden.current) {
          isHidden.current = true;
          el.style.transform = "translateY(-130%)";
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
        }
      } else {
        setIsScrolled(true);
        if (isHidden.current) {
          isHidden.current = false;
          el.style.transform = "translateY(0%)";
          el.style.opacity = "1";
          el.style.pointerEvents = "auto";
        }
        if (!menuOpenRef.current) {
          el.style.background =
            "linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 52.69%, rgba(0,0,0,0.5) 100%)";
          el.style.backdropFilter = "blur(30px)";
        }
        const padding = getHeaderPadding();
        el.style.paddingTop = padding;
        el.style.paddingBottom = padding;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          el.style.transition = "all 0.6s cubic-bezier(0.77,0,0.175,1)";
        });
      });
    }
  }, []);

  const handleToggle = () => {
    dropdownRef.current?.toggle();
  };

  const iconColorClass =
    menuOpen || (!isScrolled && isCareerPage)
      ? "text-secondary border-secondary"
      : "text-primary border-primary";

  const iconTextClass =
    menuOpen || (!isScrolled && isCareerPage)
      ? "text-secondary"
      : "text-primary";

  return (
    <>
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
          transition: "all 0.6s cubic-bezier(0.77,0,0.175,1)",
          pointerEvents: "auto",
        }}
      >
        {/* ── Main header row ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between w-full container">
          {/* ── Left — Hamburger ────────────────────────────────────────────── */}
          <motion.div
            className="w-[30%] flex items-center"
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
            className="w-[40%] flex justify-center items-center cursor-pointer"
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
                className="max-w-[158px] sm:max-w-[200px] md:max-w-[220px] lg:max-w-none h-[20px] sm:h-[40px]"
              />
            </Link>
          </motion.div>

          {/* ── Right — Contact + Search ─────────────────────────────────────── */}
          <motion.div
            className="w-[30%] flex items-center justify-end gap-[11px] md:gap-[6px]"
            initial="hidden"
            animate={animateIn ? "visible" : "hidden"}
            variants={dropDown(0.18)}
          >
            {/* Contact — hidden when xl search is open */}
            <AnimatePresence>
              {/* {!searchOpen && ( */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/contact-us">
                  <button className="hidden md:flex justify-center items-center bg-primary text-secondary text-center leading-1 rounded-[50px] text-15 uppercase px-20 py-[3px] cursor-pointer 3xl:w-[109px] h-[30px] sm:h-8">
                    Contact
                  </button>
                </Link>
              </motion.div>
              {/* )} */}
            </AnimatePresence>

            {/* Phone icon — hidden when xl search is open */}
            <AnimatePresence>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className={`flex md:hidden items-center justify-center w-[30px] h-[30px] sm:w-8 sm:h-8 rounded-full border ${iconColorClass} cursor-pointer transition-colors duration-500`}
              >
                <PiPhoneLight
                  strokeWidth={6}
                  className="w-auto h-[15px] sm:h-[20px]"
                />
              </motion.button>
            </AnimatePresence>

            {/* ── Search ────────────────────────────────────────────────────── */}
            <div
              ref={searchContainerRef}
              className="relative flex items-center justify-end"
            >
              {/* ── BELOW xl: icon toggles between search & close ────────────── */}
              <button
                onClick={searchOpen ? closeSearch : openSearch}
                className={`xl:hidden flex items-center justify-center w-[30px] h-[30px] sm:w-8 sm:h-8 rounded-full border ${iconColorClass} cursor-pointer transition-colors duration-500`}
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
                      onKeyDown={(e) => e.key === "Escape" && closeSearch()}
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
                {searchOpen && filteredResults.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                    className="hidden xl:block border border-white/20 absolute top-full mt-2 right-0 max-w-[370px] 2xl:max-w-[500px] min-w-[280px] overflow-hidden rounded-[12px]"
                    style={{ zIndex: 1001 }}
                  >
                    <div className="bg-black/90 backdrop-blur-[20px] rounded-[12px] py-2">
                      {filteredResults.map((result, i) => (
                        <motion.div
                          key={result.href}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.2 }}
                        >
                          <Link
                            href={result.href}
                            onClick={closeSearch}
                            className="flex items-center gap-3 px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors duration-200 rounded-lg mx-1 group"
                          >
                            <IoSearch className="w-3.5 h-3.5 opacity-80 shrink-0" />
                            <span data-text={result.label} className="contact-link">{result.label}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
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
              initial={{ opacity: 0, }}
              animate={{ opacity: 1}}
              exit={{ opacity: 0}}
              // transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            >
              <div className="container pb-4 pt-3 flex flex-col items-end gap-2">
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
                    onKeyDown={(e) => e.key === "Escape" && closeSearch()}
                    placeholder="Search..."
                    className={`flex-1 bg-transparent text-sm outline-none placeholder-current min-w-0 ${iconTextClass}`}
                  />
                </motion.div>

                {/* Results — in normal flow, same 300px width, shutter down */}
                <AnimatePresence>
                  {filteredResults.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                      className="w-[300px] overflow-hidden rounded-[12px]"
                      style={{ zIndex: 1001 }}
                    >
                      <div className="bg-black/90 backdrop-blur-[20px] rounded-[12px] py-2">
                        {filteredResults.map((result, i) => (
                          <motion.div
                            key={result.href}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04, duration: 0.2 }}
                          >
                            <Link
                              href={result.href}
                              onClick={closeSearch}
                              className="flex items-center gap-3 px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors duration-200 rounded-[12px] mx-1"
                            >
                              <IoSearch className="w-3.5 h-3.5 opacity-80 shrink-0" />
                              <span>{result.label}</span>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <NavDropdown ref={dropdownRef} onOpenChange={setMenuOpen} />
    </>
  );
}
