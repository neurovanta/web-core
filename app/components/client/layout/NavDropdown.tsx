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
}

export const NavDropdown = forwardRef<NavDropdownHandle, NavDropdownProps>(
  ({ onOpenChange, navData }, ref) => {
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
    const pathname = usePathname();

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
        { opacity: 0.2, y: 28, filter: "blur(1px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.75,
          stagger: { each: 0.05, ease: "power2.out" },
        },
        contentStart + 0.01,
      );

      tl.progress(fromProgress);
      tlRef.current = tl;
      return tl;
    }, []);

    const buildCloseTl = useCallback((fromProgress: number) => {
      tlRef.current?.kill();

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
          document.body.style.overflow = "";
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
      document.body.style.overflow = "hidden";
      buildOpenTl(progressRef.current).play();
    }, [buildOpenTl, onOpenChange]);

    const closeMenu = useCallback(() => {
      const s = stateRef.current;
      if (s === "closed" || s === "closing") return;

      stateRef.current = "closing";
      onOpenChange?.(false);
      buildCloseTl(progressRef.current).play();
    }, [buildCloseTl, onOpenChange]);

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
    const menuBg = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("${menuBgImage}") center / cover no-repeat, #000`;

    return (
      <div
        ref={wrapperRef}
        className="fixed inset-0 z-999 pointer-events-none"
        aria-hidden={!menuOpen}
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
              willChange: "transform",
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
              willChange: "transform",
              transform: "translateY(-100%)",
            }}
          />
          <div
            ref={(el) => {
              layerRefs.current[0] = el;
            }}
            className="relative flex flex-col overflow-hidden"
            style={{
              background: menuBg,
              willChange: "transform",
              transform: "translateY(-100%)",
            }}
          >
            <div
              ref={contentRef}
              className="flex flex-col w-full text-white"
              style={{ opacity: 0 }}
            >
              {/* Header spacer */}
              <div className="h-[100px] sm:h-[110px] lg:h-[160px] shrink-0" />

              {/* Body */}
              <div
                className="flex-1 container"
                onMouseLeave={() => {
                  setHoveredItem(null);
                  setActiveItem(null);
                }}
              >
                <div className="border-t border-white/20">
                <div className="flex items-stretch md:gap-x-120 py-[30px] md:py-50 lg:py-120">
                  {/* ── Col 1: Nav items ── */}
                  <div className="flex flex-col flex-1 md:flex-none md:w-fit min-w-0">
                    <nav>
                      <ul className="flex flex-col gap-[30px] 3xl:gap-[35px]">
                        {navItems.map((item, i) => {
                          const hasSubs = !!item.subItems?.length;
                          const isHovered = hoveredItem === item.label;

                          const NavLabel = (
                            <span className="inline-flex items-center gap-20 3xl:gap-[30px] relative w-fit">
                              <span
                                className={`text-50 leading-[1.2] uppercase transition-colors duration-300 ${
                                  anySubHovered && !isHovered
                                    ? "text-white/20"
                                    : "text-white"
                                }`}
                              >
                                {item.label}
                              </span>

                              {hasSubs && (
                                <span
                                  aria-hidden
                                  className={`hidden 2xl:flex items-center justify-center shrink-0 rounded-full bg-primary text-secondary w-[32px] h-[32px] 3xl:w-[44px] 3xl:h-[44px] transition-all duration-300 ${
                                    isHovered
                                      ? "opacity-100 translate-x-0"
                                      : "opacity-0 -translate-x-2"
                                  }`}
                                >
                                  <ChevronRight className="w-4 h-4 3xl:w-5 3xl:h-5" strokeWidth={1.5} />
                                </span>
                              )}

                              {!hasSubs && (
                                <span
                                  className={`hidden lg:block absolute bottom-[2px] md:bottom-[5px] left-0 h-[3px] bg-white transition-all duration-500 ease-out ${
                                    isHovered ? "w-full" : "w-0"
                                  }`}
                                />
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
                                    className="2xl:hidden flex items-center justify-between w-full text-left"
                                    onClick={() => {
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
                            style={{ background: menuBg, zIndex: 10 }}
                          >
                            {/* Back / title header */}
                            <div className="h-[100px] sm:h-[110px] shrink-0" />
                            <div className="container">
                              <div className="w-full h-px bg-white/20 mb-[30px]" />
                              <div
                                className="flex items-center gap-20 mb-[10px]"
                                onClick={() => {
                                  setMobileSubOpen(false);
                                  setMobileActiveItem(null);
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
                              <div className="flex flex-col pl-[36px]">
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
                  <div className="hidden md:flex flex-col flex-1 min-w-0 self-start">
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
                          <span className="text-[13px] sm:text-19 3xl:text-[20px] leading-[2.5] tracking-[-0.03em] text-white/50 group-hover:text-white transition-colors duration-300">
                            Overview
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
                            <span className="text-[13px] sm:text-19 3xl:text-[20px] leading-[2.5] tracking-[-0.03em] text-white/50 group-hover:text-white transition-colors duration-300 capitalize">
                              {sub.label.toLowerCase()}
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
