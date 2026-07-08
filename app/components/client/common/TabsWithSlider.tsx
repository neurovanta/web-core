"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { useContainerInset } from "@/app/hooks/useContainerInset";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedHeading } from "../animations/AnimateHeading";
import Reveal from "../animations/RevealItemsOneByOneAnimation";
import { moveUpV2 } from "../animations/motionVarinats";
import gsap from "gsap";
import { SectionDescription } from "../animations/SectionDescription";
import { ElasticEffect } from "../animations/ElasticEffect";
import SliderNavButton from "./SliderButton";
import { useLenis } from "../layout/LenisProvider";
import { headerScrollLock } from "@/lib/headerScrollLock";

export type TabsWithSliderSlide = {
  image: string;
  title: string;
  href: string;
};

export type TabsWithSliderCategory = {
  label: string;
  slides: TabsWithSliderSlide[];
};

export type TabsWithSliderData = {
  heading: string;
  description?: string;
  categories: TabsWithSliderCategory[];
};

function splitColumns<T>(arr: T[]): [T[], T[]] {
  const mid = Math.ceil(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
}

function preloadImages(srcs: string[]): void {
  srcs.forEach((src) => {
    const img = new window.Image();
    img.src = src;
  });
}

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/\s+/g, "-");
}

// ─── Mobile Category Dropdown (below md only) ────────────────────────────────

function CategoryDropdown({
  categories,
  activeIndex,
  onSelect,
}: {
  categories: TabsWithSliderCategory[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [positionTop, setPositionTop] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !triggerRef.current) return;

    // Use a small delay to ensure dropdown is rendered
    const timer = setTimeout(() => {
      if (!triggerRef.current || !dropdownRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current.offsetHeight;
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      const minSpace = 220; // minimum space needed

      // Position on top if not enough space below
      setPositionTop(
        spaceBelow < dropdownHeight + minSpace &&
          spaceAbove > dropdownHeight + minSpace,
      );
    }, 0);

    return () => clearTimeout(timer);
  }, [open]);

  // Handle outside clicks
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between h-[51px] px-[15px] border-y border-[#D7D7D7]"
        style={{
          background:
            "linear-gradient(90deg, rgba(224, 224, 224, 0) 0%, #E0E0E0 48.56%, rgba(224, 224, 224, 0) 100%)",
        }}
      >
        <span className="text-description text-secondary font-semibold">
          {categories[activeIndex].label}
        </span>
        <Image
          src="/assets/icons/down-arrow-tip.svg"
          alt="Chevron Down"
          width={13}
          height={13}
          className={`h-[8px] w-[13px] shrink-0 object-fill transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={dropdownRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`absolute left-0 right-0 z-50 overflow-hidden border-y border-[#D7D7D7] bg-white max-h-[220px] overflow-y-auto ${
              positionTop ? "bottom-[51px]" : "top-[51px]"
            }`}
          >
            {categories.map((cat, i) => (
              <motion.li
                key={cat.label}
                initial={{ opacity: 0, y: positionTop ? 5 : -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => {
                  onSelect(i);
                  setOpen(false);
                }}
                className={`py-[10px] px-[15px] text-19 tracking-[-0.03em] cursor-pointer select-none border-t border-border-color first:border-t-0 text-secondary ${i === activeIndex ? "font-semibold" : "font-normal"}`}
              >
                {cat.label}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TabsWithSlider({
  data,
  className,
}: {
  data: TabsWithSliderData;
  className?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [pendingSlides, setPendingSlides] = useState<
    TabsWithSliderSlide[] | null
  >(null);
  const [activeSwiperSlide, setActiveSwiperSlide] = useState(0);
  const [prevDisabled, setPrevDisabled] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(false);

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const pendingIndexRef = useRef<number>(0);
  const animKeyRef = useRef<number>(0);
  const swiperRef = useRef<any>(null);

  const overlayWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayTitleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const baseTitleRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollTo, ready } = useLenis();

  const [leftCol, rightCol] = splitColumns(data.categories);

  const containerRef = useRef<HTMLDivElement>(null);
  const inset = useContainerInset(containerRef);

  useEffect(() => {
    const allSrcs = data.categories.flatMap((cat) =>
      cat.slides.map((s) => s.image),
    );
    preloadImages(allSrcs);
  }, [data.categories]);

  const handleCategoryHover = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      preloadImages(data.categories[index].slides.map((s) => s.image));
    },
    [activeIndex, data.categories],
  );

  const handleCategoryClick = useCallback(
    (index: number) => {
      if (index === activeIndex) return;

      setActiveIndex(index);
      swiperRef.current?.slideTo(0, 700);

      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }

      baseTitleRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          opacity: 0,
          y: -40,
          duration: 0.35,
          ease: "power2.in",
          delay: i * 0.06,
        });
      });

      const nextSlides = data.categories[index].slides;

      overlayWrapRefs.current = new Array(nextSlides.length).fill(null);
      overlayTitleRefs.current = new Array(nextSlides.length).fill(null);

      pendingIndexRef.current = index;
      animKeyRef.current += 1;

      setPendingSlides(nextSlides);
    },
    [activeIndex, data.categories],
  );

  const handleCategoryClickRef = useRef(handleCategoryClick);
  useEffect(() => {
    handleCategoryClickRef.current = handleCategoryClick;
  }, [handleCategoryClick]);

  useEffect(() => {
    if (!pendingSlides) return;

    const capturedKey = animKeyRef.current;

    const raf = requestAnimationFrame(() => {
      if (capturedKey !== animKeyRef.current) return;

      const maxLen = pendingSlides.length;
      const mounted = overlayWrapRefs.current.filter(Boolean);
      if (mounted.length === 0) return;

      for (let i = 0; i < maxLen; i++) {
        const wrap = overlayWrapRefs.current[i];
        const titleEl = overlayTitleRefs.current[i];
        if (wrap) {
          gsap.set(wrap, {
            clipPath: "inset(0 100% 0 0)",
            transformOrigin: "left center",
          });
        }
        if (titleEl) {
          gsap.set(titleEl, { opacity: 0, y: 14 });
        }
      }

      const tl = gsap.timeline({
        onComplete: () => {
          if (capturedKey !== animKeyRef.current) return;
          setVisibleIndex(pendingIndexRef.current);
          setPendingSlides(null);
          tlRef.current = null;
        },
      });

      tlRef.current = tl;

      for (let i = 0; i < maxLen; i++) {
        const wrap = overlayWrapRefs.current[i];
        const titleEl = overlayTitleRefs.current[i];

        if (wrap) {
          tl.to(
            wrap,
            { clipPath: "inset(0 0% 0 0)", duration: 0.72, ease: "expo.out" },
            i * 0.1,
          );
        }
        if (titleEl) {
          tl.to(
            titleEl,
            { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
            i * 0.1 + 0.35,
          );
        }
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [pendingSlides]);

  const categoryKey = data.categories.map((c) => c.label).join("|");

  useEffect(() => {
    if (!ready) return;

    const applyHashCategory = () => {
      const hash = decodeURIComponent(window.location.hash.replace("#", ""));
      if (!hash) return;

      const matchedIndex = data.categories.findIndex(
        (cat) => slugify(cat.label) === hash.toLowerCase(),
      );
      if (matchedIndex === -1) return;

      setActiveIndex(matchedIndex);
      swiperRef.current?.slideTo(0, 0);

      handleCategoryClickRef.current(matchedIndex);
      swiperRef.current?.slideTo(0, 0);

      const scrollToSection = () => {
        if (!sectionRef.current) return;
        const top =
          sectionRef.current.getBoundingClientRect().top + window.scrollY;

        headerScrollLock.lockAndHide(1600);
        scrollTo(top + 50, { duration: 1.5 });
      };

      if (document.readyState === "complete") {
        requestAnimationFrame(scrollToSection);
      } else {
        window.addEventListener("load", scrollToSection, { once: true });
      }
    };

    applyHashCategory();

    window.addEventListener("hashchange", applyHashCategory);
    return () => window.removeEventListener("hashchange", applyHashCategory);
  }, [ready, categoryKey]);

  return (
    <section ref={sectionRef} className={`${className} md:overflow-hidden`}>
      <div ref={containerRef} className="container">
        <div className="flex flex-wrap xl:flex-nowrap items-start justify-between gap-y-[15px] sm:gap-y-20 gap-x-8 mb-[30px] sm:mb-60">
          <div className="flex flex-col gap-[15px] sm:gap-20">
            <AnimatedHeading
              title={data.heading}
              className="text-secondary text-heading"
              mode="reveal"
            />
            {data.description && (
              <SectionDescription
                text={data.description}
                className="sm:max-w-[50ch] text-description"
              />
            )}
          </div>

          {/* ── Tabs: dropdown below md, original grid/flex from md up ── */}

          {/* Mobile dropdown — below md only */}
          <div className="w-full md:hidden">
            <CategoryDropdown
              categories={data.categories}
              activeIndex={activeIndex}
              onSelect={handleCategoryClick}
            />
          </div>

          {/* Original tabs — md and above, completely unchanged */}
          <div className="hidden md:grid grid-cols-2 lg:flex gap-[10px] sm:gap-[30px] 3xl:gap-[34px] w-fit lg:ml-auto">
            {[leftCol, rightCol].map((col, colIdx) => (
              <ul
                key={colIdx}
                className="flex flex-col md:w-[320px] lg:w-[380px]"
              >
                {col.map((cat, itemIndex) => {
                  const globalIdx =
                    colIdx === 0
                      ? leftCol.indexOf(cat)
                      : leftCol.length + rightCol.indexOf(cat);
                  const isActive = globalIdx === activeIndex;
                  const rightColLastItem =
                    colIdx === 1 &&
                    rightCol.indexOf(cat) === rightCol.length - 1;
                  const leftColLastItem =
                    colIdx === 0 && globalIdx === leftCol.length - 1;

                  return (
                    <Reveal
                      key={cat.label}
                      variants={moveUpV2}
                      delayRange={itemIndex * 0.14}
                    >
                      <li>
                        <button
                          onClick={() => handleCategoryClick(globalIdx)}
                          onMouseEnter={() => handleCategoryHover(globalIdx)}
                          className="group w-full text-left bg-none border-none cursor-pointer"
                        >
                          <div className="flex items-center gap-[6px] justify-between relative overflow-hidden max-h-[49px]">
                            <AnimatePresence>
                              {isActive && (
                                <motion.span
                                  key={globalIdx}
                                  className="absolute inset-y-0 left-0 pointer-events-none"
                                  style={{
                                    background:
                                      "linear-gradient(90deg, rgba(224, 224, 224, 0) 0%, #E0E0E0 48.56%, rgba(224, 224, 224, 0) 100%)",
                                  }}
                                  initial={{ width: "0%" }}
                                  animate={{ width: "100%" }}
                                  exit={{ width: "0%" }}
                                  transition={{
                                    duration: 0.35,
                                    ease: "easeInOut",
                                  }}
                                />
                              )}
                            </AnimatePresence>

                            <span
                              data-text={cat.label}
                              className={`contact-link relative z-10 text-19 leading-[2.3] 2xl:leading-[2.631578947368421] tracking-[-0.03em] transition-colors duration-300 ${
                                isActive
                                  ? "text-secondary font-semibold"
                                  : "text-secondary hover:text-secondary/80"
                              }`}
                            >
                              {cat.label}
                            </span>

                            <AnimatePresence>
                              {isActive && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  transition={{
                                    duration: 0.2,
                                    ease: "easeOut",
                                  }}
                                  className="relative z-10"
                                >
                                  <Image
                                    src="/assets/icons/top-right-arrow-secondary.svg"
                                    alt="Arrow right tip"
                                    width={250}
                                    height={250}
                                    className="h-[22px] w-auto object-contain pointer-events-none"
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {!rightColLastItem && !leftColLastItem && (
                            <div className="h-px w-full bg-border-color" />
                          )}
                        </button>
                      </li>
                    </Reveal>
                  );
                })}
              </ul>
            ))}
          </div>
        </div>
      </div>

      {/* ── SLIDER — 100% unchanged ── */}
      <div style={{ paddingLeft: inset }} className="overflow-hidden">
        <Swiper
          modules={[Autoplay]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={1.47}
          spaceBetween={15}
          speed={900}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          onSlideChange={(swiper) => {
            setActiveSwiperSlide(swiper.activeIndex);
            setPrevDisabled(swiper.isBeginning);
            setNextDisabled(swiper.isEnd);
          }}
          onReachBeginning={() => setPrevDisabled(true)}
          onReachEnd={() => setNextDisabled(true)}
          breakpoints={{
            1650: { slidesPerView: 3.17, spaceBetween: 30 },
            1284: { slidesPerView: 3.16, spaceBetween: 20 },
            1024: { slidesPerView: 2.8, spaceBetween: 20 },
            768: { slidesPerView: 2.16, spaceBetween: 20 },
            640: { slidesPerView: 2.16, spaceBetween: 20 },
          }}
          className="!overflow-visible"
        >
          {(pendingSlides ?? data.categories[visibleIndex].slides).map(
            (_: any, i: number) => {
              const baseSlide = data.categories[visibleIndex].slides[i];
              const pending = pendingSlides?.[i];

              return (
                <SwiperSlide key={`${visibleIndex}-${i}`}>
                  <div className="relative overflow-hidden">
                    {baseSlide && (
                      <SlideCard
                        slide={baseSlide}
                        index={i}
                        isFirstVisible={i === activeSwiperSlide}
                        titleRef={(el) => {
                          baseTitleRefs.current[i] = el;
                        }}
                      />
                    )}

                    {pending && (
                      <div
                        ref={(el) => {
                          overlayWrapRefs.current[i] = el;
                        }}
                        className="absolute inset-0 z-10 will-change-[clip-path]"
                      >
                        <div className="relative overflow-hidden h-[250px] sm:h-[320px] lg:h-[420px] 3xl:h-[550px]">
                          <Image
                            src={pending.image || "/assets/placeholder.png"}
                            alt={pending.title}
                            fill
                            className="object-cover"
                            priority
                          />
                        </div>

                        <div className="overflow-hidden mt-[10px] md:mt-30">
                          <p
                            ref={(el) => {
                              overlayTitleRefs.current[i] = el;
                            }}
                            className="text-subHeading tracking-[-0.03em] text-secondary"
                          >
                            {pending.title}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              );
            },
          )}
        </Swiper>
      </div>

      <div className="flex items-center gap-[10px] pt-20 w-full justify-center shrink-0 md:hidden">
        <SliderNavButton
          direction="prev"
          disabled={prevDisabled}
          onClick={() => swiperRef.current?.slidePrev()}
        />
        <SliderNavButton
          direction="next"
          disabled={nextDisabled}
          onClick={() => swiperRef.current?.slideNext()}
        />
      </div>
    </section>
  );
}

// ── SlideCard ──
function SlideCard({
  slide,
  index,
  titleRef,
  isFirstVisible,
}: {
  slide: TabsWithSliderSlide;
  index: number;
  isFirstVisible: boolean;
  titleRef?: (el: HTMLParagraphElement | null) => void;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isActive = isMobile && isFirstVisible ? true : hovered;

  return (
    <Link href={slide.href} className="block group">
      <ElasticEffect />
      <div
        className="relative overflow-hidden h-[250px] sm:h-[320px] lg:h-[420px] 3xl:h-[550px]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Image
          src={slide.image || "/assets/placeholder.png"}
          alt={slide.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isActive ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: "#000000B2" }}
        />
        <div
          className={`absolute top-20 right-20 sm:top-30 sm:right-30 3xl:top-[34px] 3xl:right-[34px] transition-all duration-300 ${
            isActive
              ? "opacity-100 translate-y-0 translate-x-0"
              : "opacity-0 translate-y-8 -translate-x-8"
          }`}
        >
          <Image
            src="/assets/icons/top-right-arrow.svg"
            alt="Arrow right tip"
            width={200}
            height={200}
            className="h-[40px] w-[40px] md:h-[50px] xl:h-[80px] sm:w-auto object-contain pointer-events-none hidden xl:block"
          />
          <Image
            src="/assets/icons/top-right-arrow-mobile.svg"
            alt="Arrow right tip"
            width={200}
            height={200}
            className="h-[40px] w-[40px] sm:h-[50px] sm:w-auto object-contain pointer-events-none xl:hidden"
          />
        </div>
      </div>

      <div className="overflow-hidden mt-[10px] md:mt-30">
        <p
          ref={titleRef}
          className={`text-subHeading tracking-[-0.03em] text-secondary contact-link ${isActive ? "active" : ""}`}
          data-text={slide.title}
        >
          {slide.title}
        </p>
      </div>
    </Link>
  );
}
