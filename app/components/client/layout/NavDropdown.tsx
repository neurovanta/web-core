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
import { NAV_ITEMS, SOCIAL_LINKS, CONTACT_INFO, NavItem } from "./data";
import { motion } from "framer-motion";
import { moveLeft, moveUp } from "../animations/motionVarinats";

const LAYER_BG = ["#F9F5F0", "#E2D3C3", "#51463E"] as const;
const STAGGER = 0.12;
const DURATION = 0.8;

export interface NavDropdownHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
}

export const NavDropdown = forwardRef<NavDropdownHandle>((_, ref) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<NavItem | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const contentRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // State machine: "closed" | "opening" | "open" | "closing"
  const stateRef = useRef<"closed" | "opening" | "open" | "closing">("closed");
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
    isOpen: () => stateRef.current === "open" || stateRef.current === "opening",
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

  const buildOpenTl = useCallback((fromProgress: number) => {
    tlRef.current?.kill();

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
      const yStop = idx === 0 ? -20 : idx === 1 ? -10 : 0;
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
        setActiveItem(null);
        setHoveredItem(null);
        document.body.style.overflow = "";
        if (wrapperRef.current) wrapperRef.current.style.pointerEvents = "none";
        gsap.set(navItemRefs.current.filter(Boolean), { opacity: 0, y: 24 });
        gsap.set(contentRef.current, { opacity: 0 });
      },
    });

    // tl.to(navItemRefs.current.filter(Boolean), {
    //   opacity: 0,
    //   y: -8,
    //   duration: 0.16,
    //   ease: "power2.in",
    //   stagger: 0.025,
    // });
    // tl.set(contentRef.current, { opacity: 0 }, "<+=0.16");

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
    if (wrapperRef.current) wrapperRef.current.style.pointerEvents = "auto";
    document.body.style.overflow = "hidden";
    buildOpenTl(progressRef.current).play();
  }, [buildOpenTl]);

  const closeMenu = useCallback(() => {
    const s = stateRef.current;
    if (s === "closed" || s === "closing") return;

    stateRef.current = "closing";
    buildCloseTl(progressRef.current).play();
  }, [buildCloseTl]);

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
    !!NAV_ITEMS.find((it) => it.label === hoveredItem)?.subItems?.length;

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-999 pointer-events-none"
      aria-hidden={!menuOpen}
    >
      {/* Curtain */}
      <div className="absolute left-0 right-0 top-0 h-[calc(88vh+2px)] overflow-hidden z-2">
        <div
          ref={(el) => {
            layerRefs.current[2] = el;
          }}
          className="absolute inset-0"
          style={{ background: LAYER_BG[2], willChange: "transform" }}
        />
        <div
          ref={(el) => {
            layerRefs.current[1] = el;
          }}
          className="absolute inset-0 overflow-hidden"
          style={{ background: LAYER_BG[1], willChange: "transform" }}
        />
        <div
          ref={(el) => {
            layerRefs.current[0] = el;
          }}
          className="absolute inset-0 flex flex-col overflow-hidden"
          style={{ background: LAYER_BG[0], willChange: "transform" }}
        >
          <div ref={contentRef} className="flex flex-col w-full min-h-[88vh]">
            {/* Header spacer */}
            <div className="h-[160px] shrink-0" />

            {/* Body */}
            <div
              className="flex-1 container"
              onMouseLeave={() => {
                setHoveredItem(null);
                setActiveItem(null);
              }}
            >
              <div className="flex h-full border-t border-black/20">
                {/* ── Col 1: Social ── */}
                <div className="hidden lg:flex flex-col shrink-0 pb-50">
                  <div className="mt-auto flex flex-col gap-20">
                    {SOCIAL_LINKS.map((s, i) => (
                      <motion.div 
                      initial="hidden"
                      whileInView="show"
                      variants={moveLeft((i+1) * 0.2)}
                      key={i}>
                        <a
                          data-text={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-19 leading-[1.42] tracking-[-0.03em] contact-link hover:scale-105 transition-all duration-300"
                          style={
                            s.label === "Instagram"
                              ? {
                                  background:
                                    "linear-gradient(90deg, #4C66C7 0%, #F04D5A 35.1%, #FAD85C 66.83%, #C92AAA 100%)",
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                  backgroundClip: "text",
                                }
                              : s.label === "LinkedIn"
                                ? { color: "#2671AD" }
                                : s.label === "Youtube"
                                  ? { color: "#D92935" }
                                  : s.label === "Facebook"
                                    ? { color: "#416FF0" }
                                    : { color: "rgba(81,70,62,0.5)" }
                          }
                        >
                          {s.label}
                        </a>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* ── Col 2: Nav items ── */}
                <div className="flex flex-col flex-1 min-w-0 pb-50 pl-225 3xl:pl-[264px]">
                  <nav className="pt-50">
                    <ul className="flex flex-col gap-30 3xl:gap-40">
                      {NAV_ITEMS.map((item, i) => {
                        const hasSubs = !!item.subItems?.length;
                        const isHovered = hoveredItem === item.label;

                        const NavLabel = (
                          <span className="inline-flex flex-col relative w-fit">
                            <span
                              className={`text-heading uppercase transition-colors duration-300 ${
                                anySubHovered && !isHovered
                                  ? "text-secondary/40"
                                  : "text-secondary"
                              }`}
                            >
                              {item.label}
                            </span>

                            <span
                              className={`absolute bottom-[5px] left-0 h-[3px] bg-secondary transition-all duration-500 ease-out ${
                                isHovered ? "w-full" : "w-0"
                              }`}
                            />
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
                          >
                            {hasSubs ? (
                              <button className="flex flex-col items-start w-full text-left">
                                {NavLabel}
                              </button>
                            ) : (
                              <Link
                                href={item.href ?? "#"}
                                onClick={closeMenu}
                                className="flex flex-col items-start w-full"
                              >
                                {NavLabel}
                              </Link>
                            )}

                            {/* Mobile: inline sub-item expand */}
                            <div
                              className="lg:hidden overflow-hidden transition-all duration-500"
                              style={{
                                maxHeight:
                                  isHovered && hasSubs ? "400px" : "0px",
                                opacity: isHovered ? 1 : 0,
                              }}
                            >
                              <ul className="pl-4 pt-2 pb-4 flex flex-col gap-30">
                                {item.subItems?.map((sub) => (
                                  <li key={sub.label}>
                                    <Link
                                      href={sub.href}
                                      onClick={closeMenu}
                                      className="text-description tracking-[-0.02em] font-medium block"
                                      style={{ color: "rgba(81,70,62,0.55)" }}
                                    >
                                      {sub.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>

                {/* ── Vertical divider ── */}
                <div className="hidden lg:block w-px shrink-0 self-stretch border-l border-black/20" />

                {/* ── Col 3: Sub-nav + Contact ── */}
                <div className="hidden lg:flex flex-col min-w-[380px] 3xl:w-[674px] shrink-0 pl-50 3xl:pl-80">
                  {/* Sub-nav */}
                  <div
                    className="pt-10 flex flex-col gap-20 3xl:gap-30"
                    style={{
                      opacity: activeItem?.subItems ? 1 : 0,
                      transform: activeItem?.subItems
                        ? "translateY(0)"
                        : "translateY(10px)",
                      transition: "opacity 0.35s ease, transform 0.35s ease",
                      pointerEvents: activeItem?.subItems ? "auto" : "none",
                    }}
                  >
                    {activeItem?.subItems?.map((sub, i) => (
                      <motion.div
                        initial="hidden"
                        animate="show"
                        variants={moveUp(i * 0.04)}
                        key={sub.label}
                      >
                        <Link
                          href={sub.href}
                          onClick={closeMenu}
                          className="group inline-flex flex-col w-fit relative"
                        >
                          <span className="text-description tracking-[-0.03em] text-secondary/50 group-hover:text-secondary transition-colors duration-300">
                            {sub.label}
                          </span>
                          <span className="absolute bottom-[2px] left-0 h-px w-0 bg-secondary transition-all duration-500 ease-out group-hover:w-full" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Contact — bottom-right */}
                  <div className="mt-auto flex flex-col items-end pb-50">
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="text-subHeading tracking-[-0.03em]"
                    >
                      {CONTACT_INFO.email}
                    </a>
                    <a
                      href={`tel:${CONTACT_INFO.phone}`}
                      className="text-subHeading tracking-[-0.03em]"
                    >
                      {CONTACT_INFO.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile footer: contact + social */}
            <div
              className="lg:hidden container flex items-center justify-between py-6"
              style={{ borderTop: "1px solid rgba(81,70,62,0.1)" }}
            >
              <div className="flex flex-col gap-1">
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-description tracking-[-0.03em]"
                >
                  {CONTACT_INFO.email}
                </a>
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="text-description tracking-[-0.03em]"
                >
                  {CONTACT_INFO.phone}
                </a>
              </div>
              <div className="flex gap-4">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-description"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* overlay — click closes menu */}
      <div
        ref={overlayRef}
        className="absolute bg-black/71 inset-0 z-1"
      />
    </div>
  );
});
