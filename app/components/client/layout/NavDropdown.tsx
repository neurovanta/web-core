"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import Link from "next/link";
import gsap from "gsap";
import { moveUp } from "../animations/motionVarinats";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import {
  NavData,
  NavLink,
  NavSolution,
  NavSystem,
  NavIndustry,
  NavItem,
} from "@/app/types/header";
import { usePathname } from "next/navigation";
import { useLenis } from "./LenisProvider";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/** Dimmed text with a white layer that wipes in left→right on parent `group` hover and fades out on leave. */
function HoverFillText({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      <span className="text-white/50">{children}</span>
      <span
        aria-hidden
        className="absolute inset-0 text-white whitespace-nowrap opacity-0 [clip-path:inset(0_100%_0_0)] [transition:opacity_300ms_ease-out,clip-path_0s_linear_300ms] group-hover:opacity-100 group-hover:[clip-path:inset(0_0_0_0)] group-hover:[transition:opacity_0s,clip-path_380ms_ease-out]"
      >
        {children}
      </span>
    </span>
  );
}

/**
 * Edge-fade cue for a scrollable column: fades the bottom edge while more
 * content sits below, the top edge once scrolled down, and nothing when
 * everything fits. Returns a style object with the matching CSS mask.
 */
const FADE_SIZE = "80px";
const FADE_TOLERANCE = 8;
function useScrollFade(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
): React.CSSProperties {
  const [edges, setEdges] = useState({ top: false, bottom: false });

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;

    const update = () => {
      // Ignore sub-pixel/line-box overflow of a few px — only real overflow counts.
      // Layout height of the children — unlike scrollHeight it ignores
      // transforms, so in-flight enter animations don't read as overflow.
      const contentH = Array.from(el.children).reduce(
        (sum, c) => sum + (c as HTMLElement).offsetHeight,
        0,
      );
      const top = el.scrollTop > FADE_TOLERANCE;
      const bottom =
        el.scrollTop + el.clientHeight < contentH - FADE_TOLERANCE;
      setEdges((prev) =>
        prev.top === top && prev.bottom === bottom ? prev : { top, bottom },
      );
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    Array.from(el.children).forEach((c) => ro.observe(c));
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [ref, active]);

  if (!edges.top && !edges.bottom) return {};
  const mask = `linear-gradient(to bottom, ${
    edges.top ? `transparent 0, #000 ${FADE_SIZE}` : "#000 0"
  }, ${
    edges.bottom
      ? `#000 calc(100% - ${FADE_SIZE}), transparent 100%`
      : "#000 100%"
  })`;
  return { maskImage: mask, WebkitMaskImage: mask };
}

const LAYER_BG = ["#F9F5F0", "#E2D3C3", "#51463E"] as const;
const STAGGER = 0.12;
const DURATION = 0.8;

export interface NavDropdownHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
}

interface NavDropdownProps {
  onOpenChange?: (open: boolean) => void;
  navData: NavData;
  /** Element (the header) that stays keyboard-reachable alongside the menu while it is open. */
  trapWithin?: React.RefObject<HTMLElement | null>;
}

export const NavDropdown = forwardRef<NavDropdownHandle, NavDropdownProps>(
  ({ onOpenChange, navData, trapWithin }, ref) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeItem, setActiveItem] = useState<NavItem | null>(null);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [mobileSubOpen, setMobileSubOpen] = useState(false);
    const [mobileActiveItem, setMobileActiveItem] = useState<NavItem | null>(
      null,
    );

    const wrapperRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const layerRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
    const contentRef = useRef<HTMLDivElement>(null);
    const navItemRefs = useRef<(HTMLLIElement | null)[]>([]);
    const navColRef = useRef<HTMLDivElement>(null);
    const subColRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    // Measured only once the open animation has settled — the nav items'
    // in-flight GSAP offset would otherwise read as overflow.
    const [menuSettled, setMenuSettled] = useState(false);
    const navColFade = useScrollFade(navColRef, menuSettled);
    const subColFade = useScrollFade(subColRef, menuSettled);

    // Lenis keeps scrolling the page on wheel/trackpad unless it is stopped,
    // so the menu locks/unlocks through Lenis instead of body overflow.
    const { lockScroll, unlockScroll } = useLenis();
    const scrollLockRef = useRef({ lockScroll, unlockScroll });
    useEffect(() => {
      scrollLockRef.current = { lockScroll, unlockScroll };
    }, [lockScroll, unlockScroll]);

    const reducedMotionRef = useRef(false);
    useEffect(() => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      reducedMotionRef.current = mq.matches;
      const handler = (e: MediaQueryListEvent) => {
        reducedMotionRef.current = e.matches;
      };
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }, []);

    const handleHashLinkClick = (
      e: React.MouseEvent<HTMLAnchorElement>,
      href: string,
    ) => {
      const [path, hash] = href.split("#");
      if (!hash) return;
      if (path.replace(/\/$/, "") !== pathname) return; // different page, let Link navigate normally

      e.preventDefault();
      if (window.location.hash === `#${hash}`) {
        window.dispatchEvent(new HashChangeEvent("hashchange")); // same hash clicked again
      } else {
        window.location.hash = hash; // native assignment fires hashchange
      }
    };

    const groupBuilders: Record<string, NavItem> = {
      solutions: {
        label: navData.header.solutionsLabel || "Solutions",
        href: "/solutions",
        subItems: navData.header.solutions
          .filter((s: NavSolution) => !s.isHidden)
          .map((s: NavSolution) => ({
            label: s.thumbnailTitle,
            href: `/solutions/${s.slug}`,
          })),
      },
      systems: {
        label: navData.header.systemsLabel || "Longevity Systems",
        href: "/longevity-systems",
        subItems: navData.header.systems
          .filter((sys: NavSystem) => !sys.isHidden)
          .map((sys: NavSystem) => ({
            label: sys.title,
            href: `/longevity-systems/#${sys.title.toLowerCase().replace(/\s+/g, "-")}`,
          })),
      },
      industries: {
        label: navData.header.industriesLabel || "Industries We Serve",
        href: "/industries",
        subItems: navData.header.industries
          .filter((ind: NavIndustry) => !ind.isHidden)
          .map((ind: NavIndustry) => ({
            label: ind.thumbnailTitle,
            href: `/industries/${ind.slug}`,
          })),
      },
    };

    const navItems: NavItem[] = navData.header.menuItems
      .map((m: any) =>
        m.kind === "link"
          ? { label: m.label, href: m.link }
          : groupBuilders[m.groupKey],
      )
      .filter(Boolean);
    // State machine: "closed" | "opening" | "open" | "closing"
    const stateRef = useRef<"closed" | "opening" | "open" | "closing">(
      "closed",
    );
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const progressRef = useRef(0); // 0 = fully closed, 1 = fully open

    useImperativeHandle(ref, () => ({
      open: () => openMenu(),
      close: () => closeMenu(),
      toggle: () => {
        const s = stateRef.current;
        if (s === "closed" || s === "closing") openMenu();
        else closeMenu();
      },
      isOpen: () =>
        stateRef.current === "open" || stateRef.current === "opening",
    }));

    useEffect(() => {
      layerRefs.current.forEach((el) => {
        if (el) gsap.set(el, { yPercent: -100, y: 0 });
      });
      gsap.set(contentRef.current, { opacity: 0 });
      gsap.set(navItemRefs.current.filter(Boolean), { opacity: 0, y: 24 });
      gsap.set(overlayRef.current, { opacity: 0 });
      if (wrapperRef.current) wrapperRef.current.style.pointerEvents = "none";
    }, []);

    const isMobileRef = useRef(false);

    useEffect(() => {
      isMobileRef.current = window.innerWidth < 768;

      const mq = window.matchMedia("(max-width: 767px)");
      const handler = (e: MediaQueryListEvent) => {
        isMobileRef.current = e.matches;
      };
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }, []);

    const buildOpenTl = useCallback((fromProgress: number) => {
      tlRef.current?.kill();
      const mobile = isMobileRef.current;

      const tl = gsap.timeline({
        onUpdate: () => {
          progressRef.current = tl.progress();
        },
        onComplete: () => {
          stateRef.current = "open";
          progressRef.current = 1;
          setMenuSettled(true);
        },
      });

      [2, 1, 0].forEach((idx, i) => {
        const el = layerRefs.current[idx];
        if (!el) return;
        const yStop =
          idx === 0
            ? mobile
              ? -10
              : -20
            : idx === 1
              ? mobile
                ? -5
                : -10
              : 0;
        tl.to(
          el,
          { yPercent: 0, y: yStop, duration: DURATION, ease: "power4.inOut" },
          i * STAGGER,
        );
      });

      tl.to(
        overlayRef.current,
        { opacity: 1, duration: 0.5, ease: "power2.out" },
        2 * STAGGER,
      );

      const contentStart = 2 * STAGGER + DURATION * 0.6;
      tl.set(contentRef.current, { opacity: 1 }, contentStart);

      tl.fromTo(
        navItemRefs.current.filter(Boolean),
        { opacity: 0.2, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: { each: 0.05, ease: "power2.out" },
        },
        contentStart + 0.01,
      );

      tl.progress(fromProgress);
      if (reducedMotionRef.current) tl.timeScale(20);
      tlRef.current = tl;
      return tl;
    }, []);

    const buildCloseTl = useCallback((fromProgress: number) => {
      tlRef.current?.kill();

      setMenuSettled(false);
      const tl = gsap.timeline({
        onUpdate: () => {
          progressRef.current = 1 - tl.progress();
        },
        onComplete: () => {
          stateRef.current = "closed";
          progressRef.current = 0;
          setMenuOpen(false);
          onOpenChange?.(false);
          setActiveItem(null);
          setHoveredItem(null);
          setMobileSubOpen(false);
          setMobileActiveItem(null);
          layerRefs.current[0]?.scrollTo({ top: 0 });
          if (wrapperRef.current)
            wrapperRef.current.style.pointerEvents = "none";
          gsap.set(navItemRefs.current.filter(Boolean), { opacity: 0, y: 24 });
          gsap.set(contentRef.current, { opacity: 0 });
        },
      });

      let frontLayerStart = 0;
      [0, 1, 2].forEach((idx, i) => {
        const el = layerRefs.current[idx];
        if (!el) return;
        const position = i === 0 ? ">" : `-=${DURATION - STAGGER}`;
        tl.to(
          el,
          { yPercent: -100, y: 0, duration: DURATION, ease: "power4.inOut" },
          position,
        );
        if (idx === 0) frontLayerStart = tl.duration() - DURATION;
      });

      tl.to(
        overlayRef.current,
        { opacity: 0, duration: 0.5, ease: "power2.in" },
        frontLayerStart,
      );

      if (fromProgress < 1) tl.progress(1 - fromProgress);
      if (reducedMotionRef.current) tl.timeScale(20);
      tlRef.current = tl;
      return tl;
    }, []);

    const openMenu = useCallback(() => {
      const s = stateRef.current;
      if (s === "open" || s === "opening") return;

      stateRef.current = "opening";
      setMenuOpen(true);
      onOpenChange?.(true); // ← must be here — fires immediately when open starts
      if (wrapperRef.current) wrapperRef.current.style.pointerEvents = "auto";
      scrollLockRef.current.lockScroll();
      buildOpenTl(progressRef.current).play();
    }, [buildOpenTl, onOpenChange]);

    const closeMenu = useCallback(() => {
      const s = stateRef.current;
      if (s === "closed" || s === "closing") return;

      stateRef.current = "closing";
      onOpenChange?.(false);
      // Unlock right away (not on animation end): Lenis ignores scrollTo while
      // stopped, which would break route scroll-reset and #hash scrolling.
      scrollLockRef.current.unlockScroll();
      // Focus would be lost when the menu becomes inert — return it to the toggle.
      if (wrapperRef.current?.contains(document.activeElement)) {
        trapWithin?.current
          ?.querySelector<HTMLElement>("button[aria-expanded]")
          ?.focus();
      }
      buildCloseTl(progressRef.current).play();
    }, [buildCloseTl, onOpenChange, trapWithin]);

    // Close when the route changes by any means (back/forward, programmatic).
    const prevPathRef = useRef(pathname);
    useEffect(() => {
      if (prevPathRef.current === pathname) return;
      prevPathRef.current = pathname;
      closeMenu();
    }, [pathname, closeMenu]);

    // Keep Tab focus cycling within header + menu while open.
    useEffect(() => {
      if (!menuOpen) return;
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;
        const roots = [trapWithin?.current, wrapperRef.current].filter(
          Boolean,
        ) as HTMLElement[];
        const items = roots
          .flatMap((r) => Array.from(r.querySelectorAll<HTMLElement>(FOCUSABLE)))
          .filter((el) => el.getClientRects().length > 0);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement as HTMLElement | null;
        const inside = !!active && items.includes(active);
        if (e.shiftKey && (active === first || !inside)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !inside)) {
          e.preventDefault();
          first.focus();
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [menuOpen, trapWithin]);

    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeMenu();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [closeMenu]);

    // True when a sub-nav item is currently hovered
    const anySubHovered =
      hoveredItem !== null &&
      !!navItems.find((it) => it.label === hoveredItem)?.subItems?.length;

    const menuBgImage =
      navData.header.image ||
      navData.footer.image ||
      "/assets/images/footer/footer-bg.jpg";
    const menuBg = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("${menuBgImage}") center / cover no-repeat`;

    return (
      <div
        ref={wrapperRef}
        className="fixed inset-0 z-999 pointer-events-none"
        inert={!menuOpen}
      >
        {/* Curtain */}
        <div className="absolute left-0 right-0 top-0 overflow-hidden z-2">
          <div
            ref={(el) => {
              layerRefs.current[2] = el;
            }}
            className="absolute inset-0"
            style={{
              background: LAYER_BG[2],
              transform: "translateY(-100%)",
            }}
          />
          <div
            ref={(el) => {
              layerRefs.current[1] = el;
            }}
            className="absolute inset-0"
            style={{
              background: LAYER_BG[1],
              transform: "translateY(-100%)",
            }}
          />
          <div
            ref={(el) => {
              layerRefs.current[0] = el;
            }}
            data-lenis-prevent
            className="relative flex flex-col overflow-x-hidden overflow-y-auto overscroll-contain max-h-dvh max-md:min-h-[75svh] md:[@media(height<750px)]:h-[95svh]"
            style={{
              background: "#000",
              transform: "translateY(-100%)",
            }}
          >
            {/* Drifting background: pinned to the top of the scroll area (sticky, zero height)
                and one screen tall, so it stays put while the menu scrolls. Runs only while open. */}
            <div aria-hidden className="sticky top-0 h-0 shrink-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-dvh overflow-hidden">
                <div
                  className={`bg-drift ${menuOpen ? "is-playing" : ""} absolute inset-0`}
                  style={{ background: menuBg }}
                />
              </div>
            </div>
            <div
              ref={contentRef}
              className="relative flex flex-col flex-1 w-full text-white min-h-0"
              style={{ opacity: 0 }}
            >
              {/* Header spacer */}
              <div className="h-[100px] sm:h-[110px] lg:h-[160px] shrink-0" />

              {/* Body */}
              <div
                className="flex-1 container min-h-0 flex flex-col"
                onMouseLeave={() => {
                  setHoveredItem(null);
                  setActiveItem(null);
                }}
              >
                <div className="border-t border-white/20 flex flex-col min-h-0">
                <div className="flex items-stretch md:gap-x-120 py-[30px] md:py-50 lg:py-80 3xl:py-120 min-h-0">
                  {/* ── Col 1: Nav items ── */}
                  <div
                    ref={navColRef}
                    className="flex flex-col flex-1 md:flex-none md:w-fit min-w-0 min-h-0 overflow-y-auto overscroll-contain"
                    style={mobileSubOpen ? undefined : navColFade}
                  >
                    <nav>
                      <ul className="flex flex-col gap-[22px] sm:gap-[30px] 3xl:gap-[35px]">
                        {navItems.map((item, i) => {
                          const hasSubs = !!item.subItems?.length;
                          const isHovered = hoveredItem === item.label;

                          const NavLabel = (
                            <span className="inline-flex items-center gap-[clamp(20px,5vw,95px)] relative w-fit">
                              <span className="relative text-[length:clamp(20px,0.77vw_+_17.11px,25px)] lg:text-50 [@media(width>1440px)_and_(height<750px)]:text-[40px] leading-[1.2] uppercase">
                                {/* Dimmed base */}
                                <span className="text-white/20">{item.label}</span>
                                {/* White layer: wipes in left→right, fades out */}
                                <span
                                  aria-hidden
                                  className="absolute inset-0 text-white whitespace-nowrap"
                                  style={
                                    anySubHovered && !isHovered
                                      ? {
                                          opacity: 0,
                                          clipPath: "inset(0 100% 0 0)",
                                          transition:
                                            "opacity 300ms ease-out, clip-path 0s linear 300ms",
                                        }
                                      : {
                                          opacity: 1,
                                          clipPath: "inset(0 0 0 0)",
                                          transition:
                                            "opacity 0s, clip-path 380ms ease-out",
                                        }
                                  }
                                >
                                  {item.label}
                                </span>
                              </span>

                              {hasSubs && (
                                <span
                                  aria-hidden
                                  className={`hidden 2xl:flex items-center justify-center shrink-0 rounded-full bg-primary text-secondary size-[clamp(32px,2.632vw,50px)] transition-all duration-300 ${
                                    isHovered
                                      ? "opacity-100 translate-x-0"
                                      : "opacity-0 -translate-x-2"
                                  }`}
                                >
                                  <ChevronRight className="size-[clamp(22px,1.895vw,36px)]" strokeWidth={1.5} />
                                </span>
                              )}

                            </span>
                          );

                          return (
                            <li
                              key={item.label}
                              ref={(el) => {
                                navItemRefs.current[i] = el;
                              }}
                              onMouseEnter={() => {
                                setHoveredItem(item.label);
                                setActiveItem(hasSubs ? item : null);
                              }}
                              // onClick={() => {
                              //   if (hasSubs) {
                              //     setMobileSubOpen(true);
                              //     setMobileActiveItem(item);
                              //   }
                              // }}
                            >
                              {hasSubs ? (
                                <>
                                  {/* Below 2xl: button triggers mobile slide */}
                                  <button
                                    className="2xl:hidden flex items-center justify-between gap-[20px] md:gap-[30px] w-full text-left"
                                    onClick={() => {
                                      layerRefs.current[0]?.scrollTo({ top: 0 });
                                      setMobileSubOpen(true);
                                      setMobileActiveItem(item);
                                    }}
                                  >
                                    {NavLabel}
                                    <Image
                                      src="/assets/icons/down-arrow-tip.svg"
                                      alt="Chevron"
                                      width={13}
                                      height={13}
                                      className="lg:hidden h-[8px] md:h-[10px] w-auto object-fill -rotate-90 opacity-60 brightness-0 invert"
                                    />
                                  </button>

                                  {/* 2xl+: clickable link that navigates, hover shows sub-nav */}
                                  <Link
                                    href={item.href ?? "#"}
                                    onClick={closeMenu}
                                    className="hidden 2xl:flex flex-col items-start w-full cursor-pointer"
                                  >
                                    {NavLabel}
                                  </Link>
                                </>
                              ) : (
                                <Link
                                  href={item.href ?? "#"}
                                  onClick={closeMenu}
                                  className="flex flex-col items-start w-full"
                                >
                                  {NavLabel}
                                </Link>
                              )}
                            </li>
                          );
                        })}
                      </ul>

                      {/* ── Mobile sub-nav slide (below lg only) ── */}
                      <AnimatePresence>
                        {mobileSubOpen && mobileActiveItem?.subItems && (
                          <motion.div
                            key="mobile-subnav"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{
                              ease: [0.77, 0, 0.175, 1],
                              duration: 0.55,
                            }}
                            className="md:hidden absolute inset-0 flex flex-col"
                            style={{ background: `${menuBg}, #000`, zIndex: 10 }}
                          >
                            {/* Back / title header */}
                            <div className="h-[100px] sm:h-[110px] shrink-0" />
                            <div className="container flex-1 min-h-0 flex flex-col">
                              <div className="w-full h-px bg-white/20 mb-[30px] shrink-0" />
                              <div
                                className="flex items-center gap-20 mb-[10px] shrink-0"
                                onClick={() => {
                                  setMobileSubOpen(false);
                                  setMobileActiveItem(null);
                                  // A tap fires mouseenter on touch devices, so the
                                  // tapped item would stay highlighted after going back.
                                  setHoveredItem(null);
                                  setActiveItem(null);
                                }}
                              >
                                <span className="">
                                  <Image
                                    src="/assets/icons/down-arrow-tip.svg"
                                    alt="Chevron"
                                    width={13}
                                    height={13}
                                    className="md:hidden h-[8px] w-auto object-fill rotate-90 opacity-60 brightness-0 invert"
                                  />
                                </span>
                                <span className="text-subHeading text-white">
                                  {mobileActiveItem.label}
                                </span>
                              </div>

                              {/* Sub items */}
                              <div className="flex flex-col pl-[36px] flex-1 min-h-0 overflow-y-auto overscroll-contain pb-[30px]">
                                <motion.div
                                  initial={{ opacity: 0, y: 14 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    delay: 0.18,
                                    duration: 0.35,
                                    ease: "easeOut",
                                  }}
                                >
                                  <Link
                                    href={mobileActiveItem.href ?? "#"}
                                    onClick={() => {
                                      setMobileSubOpen(false);
                                      setMobileActiveItem(null);
                                      closeMenu();
                                    }}
                                    className="group flex items-center py-[8px] relative"
                                  >
                                    <span className="text-description text-white/80 capitalize">
                                      Overview
                                    </span>
                                  </Link>
                                </motion.div>

                                {mobileActiveItem.subItems.map((sub, i) => (
                                  <motion.div
                                    key={sub.label}
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                      delay: 0.23 + i * 0.05,
                                      duration: 0.35,
                                      ease: "easeOut",
                                    }}
                                  >
                                    <Link
                                      href={sub.href}
                                      onClick={(e) => {
                                        setMobileSubOpen(false);
                                        setMobileActiveItem(null);
                                        closeMenu();
                                        handleHashLinkClick(e, sub.href);
                                      }}
                                      className="group flex items-center py-[8px] relative"
                                    >
                                      <div className="flex gap-[10px] sm:gap-20 items-center">
                                        <Image
                                          src="/assets/icons/down-arrow-tip.svg"
                                          alt="Chevron"
                                          width={13}
                                          height={13}
                                          className="md:hidden h-[6px] w-auto object-fill -rotate-90 opacity-60 brightness-0 invert"
                                        />
                                        <span className="text-description text-white/80 capitalize">
                                          {sub.label.toLowerCase()}
                                        </span>
                                      </div>
                                    </Link>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </nav>
                  </div>

                  {/* ── Vertical divider (same height as col 1) ── */}
                  <div className="hidden md:block w-px shrink-0 self-stretch bg-white/20" />

                  {/* ── Col 2: Sub-nav (top-aligned with col 1) ── */}
                  <div
                    ref={subColRef}
                    className="hidden md:flex flex-col flex-1 min-w-0 self-start md:max-h-full md:overflow-y-auto md:overscroll-contain"
                    style={subColFade}
                  >
                    <div
                      className="flex flex-col"
                      style={{
                        opacity: activeItem?.subItems ? 1 : 0,
                        transform: activeItem?.subItems
                          ? "translateY(0)"
                          : "translateY(10px)",
                        transition: "opacity 0.35s ease, transform 0.35s ease",
                        pointerEvents: activeItem?.subItems ? "auto" : "none",
                      }}
                    >
                      {/* Overview — only md to 2xl, no hover on these devices so need direct page link */}
                      {activeItem?.href && (
                        <Link
                          href={activeItem.href}
                          onClick={closeMenu}
                          className="group inline-flex flex-col w-fit relative md:block 2xl:hidden"
                        >
                          <span className="text-[13px] sm:text-19 3xl:text-[20px] leading-[2.5] tracking-[-0.03em]">
                            <HoverFillText>Overview</HoverFillText>
                          </span>
                        </Link>
                      )}

                      {activeItem?.subItems?.map((sub, i) => (
                        <motion.div
                          initial="hidden"
                          animate="show"
                          variants={moveUp(i * 0.04)}
                          key={sub.label}
                        >
                          <Link
                            href={sub.href}
                            onClick={(e) => {
                              closeMenu();
                              handleHashLinkClick(e, sub.href);
                            }}
                            className="group inline-flex flex-col w-fit relative"
                          >
                            <span className="text-[13px] sm:text-19 3xl:text-[20px] leading-[2.5] tracking-[-0.03em]">
                              <HoverFillText>
                                {sub.label
                                  .toLowerCase()
                                  .replace(/(^|\s)\S/g, (c) => c.toUpperCase())}
                              </HoverFillText>
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* overlay */}
        <div
          ref={overlayRef}
          style={{ opacity: 0 }}
          className="absolute bg-black/71 inset-0 z-1 cursor-pointer"
          onClick={closeMenu}
        />
      </div>
    );
  },
);
