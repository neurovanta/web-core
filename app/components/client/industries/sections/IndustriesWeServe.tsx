"use client";

import Image from "next/image";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomButton from "../../common/CustomButton";
import SliderNavButton from "../../common/SliderButton";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import { IndividualIndustry } from "@/app/types/industry";

interface IndustriesWeServeProps {
  title: string;
  items: IndividualIndustry[];
}

const COLLAPSED_W = 184;
const EXPANDED_W = 554;
const CARD_HEIGHT = 480;
const GAP = 10;

interface IndustryItem {
  id: number;
  image: string;
  title: string;
  description: string;
  btnTitle: string;
  href: string;
}

// ─── Desktop Card (unchanged) ─────────────────────────────────────────────────

const IndustryCard = ({
  item,
  isActive,
  onActivate,
}: {
  item: IndustryItem;
  isActive: boolean;
  onActivate: () => void;
}) => (
  <motion.div
    animate={{ width: isActive ? EXPANDED_W : COLLAPSED_W }}
    transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
    className="relative shrink-0 cursor-pointer overflow-hidden"
    style={{ height: CARD_HEIGHT }}
    onMouseEnter={onActivate}
    onClick={onActivate}
  >
    <Image
      src={item.image || "/assets/placeholder.png"}
      alt={item.title}
      fill
      className="object-cover object-center"
    />

    <motion.div
      className="absolute inset-0"
      initial={{ backgroundColor: "rgba(0,0,0,0)" }}
      animate={{
        backgroundColor: isActive ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    />

    <AnimatePresence>
      {!isActive && (
        <motion.div
          key="collapsed-gradient"
          className="absolute left-0 right-0 bottom-0 h-[306px] w-full bg-gradient-to-b from-transparent to-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      )}
    </AnimatePresence>

    <AnimatePresence>
      {!isActive && (
        <motion.div
          key="collapsed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute bottom-0 left-0 right-0 pl-20 pr-[15px] py-40"
        >
          <p className="text-white text-description">{item.title}</p>
        </motion.div>
      )}
    </AnimatePresence>

    <AnimatePresence>
      {isActive && (
        <motion.div
          key="expanded"
          initial={{ opacity: 0, y: 18 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, delay: 0.2 },
          }}
          exit={{ opacity: 0, y: 0, transition: { duration: 0.08 } }}
          className="absolute bottom-0 left-0 right-0 p-40 flex flex-col"
        >
          <h3 className="text-white text-subHeading mb-20">{item.title}</h3>
          <p className="text-white text-description mb-50">
            {item.description}
          </p>
          <CustomButton label={item.btnTitle} href={item.href} variant={1} />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

// ─── Mobile Accordion (below md only) ────────────────────────────────────────

const MobileAccordion = ({ items }: { items: IndustryItem[] }) => {
  const [openId, setOpenId] = useState<number>(items[0].id);

  return (
    <div className="w-full">
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <div
            key={item.id}
            className="border-t border-border-color last:border-b"
          >
            {/* Header row */}
            <button
              type="button"
              onClick={() => setOpenId(item.id)}
              className={`flex w-full items-center justify-between pt-20 ${isOpen ? "pb-[15px]" : "pb-20"} text-left`}
            >
              <span
                className={`text-subHeading tracking-[-0.03em] transition-all duration-300 ${
                  isOpen ? "font-semibold" : "font-normal"
                }`}
              >
                {item.title}
              </span>

              <Image
                src="/assets/icons/down-arrow-tip.svg"
                alt="Chevron Down"
                width={13}
                height={13}
                className={`h-[8px] w-[13px] shrink-0 object-fill transition-transform duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {/* Accordion body */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    transition: {
                      height: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
                      opacity: { duration: 0.4, delay: 0.15 },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                      opacity: { duration: 0.2 },
                    },
                  }}
                  className="overflow-hidden"
                >
                  <div className="pb-20 flex flex-col">
                    {/* Image */}
                    <div className="relative w-full aspect-[16/9] h-[181px] min-[500px]:h-auto overflow-hidden mb-[15px]">
                      <Image
                        src={item.image || "/assets/placeholder.png"}
                        alt={item.title}
                        fill
                        className="object-cover object-top"
                      />
                    </div>

                    {/* Description */}
                    <p className="text-description text-secondary mb-20">
                      {item.description}
                    </p>

                    {/* Button */}
                    <div>
                      <CustomButton
                        label={item.btnTitle}
                        href={item.href}
                        variant={2}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const IndustriesWeServe = ({ data }: { data: IndustriesWeServeProps }) => {
  const { title, items } = data;
  const mapped = useMemo(
    () =>
      items
        .filter((i) => !i.isHidden)
        .map((i, index) => ({
          id: index,
          image: i.thumbnailImage,
          title: i.thumbnailTitle,
          description: i.thumbnailDescription,
          btnTitle: "Explore",
          href: `/industries/${i.slug}`,
        })),
    [items],
  );

  const [activeId, setActiveId] = useState<number>(mapped[0].id);
  const [offset, setOffset] = useState(0);
  const [showNav, setShowNav] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null); // true = below md
  const [maxOffset, setMaxOffset] = useState(0);

  const [swiperAtStart, setSwiperAtStart] = useState(true);
  const [swiperAtEnd, setSwiperAtEnd] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const mobileSwiperRef = useRef<SwiperType | null>(null);

  const trackWidth =
    EXPANDED_W + COLLAPSED_W * (mapped.length - 1) + GAP * (mapped.length - 1);

  const getMaxOffset = useCallback(() => {
    if (!viewportRef.current) return 0;
    return Math.max(
      0,
      trackWidth - viewportRef.current.getBoundingClientRect().width,
    );
  }, [trackWidth]);

  useEffect(() => {
    const lgMq = window.matchMedia("(min-width: 1024px)");
    const mdMq = window.matchMedia("(min-width: 768px)");

    const evaluate = () => {
      const desktop = lgMq.matches;
      const tabletOrAbove = mdMq.matches;

      setIsDesktop(desktop);
      setIsMobile(!tabletOrAbove); // below md → accordion

      const viewW =
        viewportRef.current?.getBoundingClientRect().width ?? window.innerWidth;

      if (desktop) {
        const overflows = trackWidth > viewW;
        const max = overflows ? Math.max(0, trackWidth - viewW) : 0;
        setShowNav(overflows);
        setMaxOffset(max);
        setOffset((prev) => (overflows ? -Math.min(Math.abs(prev), max) : 0));
      } else if (tabletOrAbove) {
        // md → lg: Swiper (existing behaviour)
        const slidesVisible = window.innerWidth >= 640 ? 2 : 1;
        setShowNav(items.length > slidesVisible);
        setMaxOffset(0);
        setOffset(0);
      } else {
        // below md: accordion, no nav needed
        setShowNav(false);
        setMaxOffset(0);
        setOffset(0);
      }
    };

    evaluate();
    lgMq.addEventListener("change", evaluate);
    mdMq.addEventListener("change", evaluate);

    const ro = new ResizeObserver(evaluate);
    if (viewportRef.current) ro.observe(viewportRef.current);

    return () => {
      lgMq.removeEventListener("change", evaluate);
      mdMq.removeEventListener("change", evaluate);
      ro.disconnect();
    };
  }, [trackWidth, mapped.length]);

  const activateCard = useCallback(
    (id: number) => {
      setActiveId(id);

      if (!viewportRef.current) return;

      const viewW = viewportRef.current.getBoundingClientRect().width;
      const index = mapped.findIndex((item) => item.id === id);
      if (index === -1) return;

      const cardTrackLeft = index * (COLLAPSED_W + GAP);
      const cardRightInView = cardTrackLeft + EXPANDED_W + offset;
      const overshoot = cardRightInView - viewW;

      if (overshoot > 0) {
        const currentMax = getMaxOffset();
        setOffset((prev) => -Math.min(Math.abs(prev) + overshoot, currentMax));
      }
      const cardLeftInView = cardTrackLeft + offset;
      if (cardLeftInView < 0) {
        setOffset(-cardTrackLeft);
      }
    },
    [mapped, offset, getMaxOffset],
  );

  const slideBy = (direction: "prev" | "next") => {
    if (!isDesktop && mobileSwiperRef.current) {
      direction === "next"
        ? mobileSwiperRef.current.slideNext()
        : mobileSwiperRef.current.slidePrev();
      return;
    }
    const step = COLLAPSED_W + GAP;
    const max = getMaxOffset();
    setOffset((prev) =>
      direction === "next"
        ? -Math.min(Math.abs(prev) + step, max)
        : Math.min(prev + step, 0),
    );
  };

  const prevDisabled = isDesktop ? offset >= 0 : swiperAtStart;
  const nextDisabled = isDesktop ? offset <= -maxOffset : swiperAtEnd;

  // Wait until breakpoints are evaluated before rendering
  if (isDesktop === null || isMobile === null) return null;

  return (
    <section className="w-full py-[60px] lg:py-120 bg-cream-bg">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <AnimatedHeading
            title={title}
            mode="reveal"
            className="text-secondary mb-60"
          />

          {showNav && (
            <div className="flex items-center gap-[10px]">
              <SliderNavButton
                direction="prev"
                onClick={() => slideBy("prev")}
                disabled={prevDisabled}
              />
              <SliderNavButton
                direction="next"
                onClick={() => slideBy("next")}
                disabled={nextDisabled}
              />
            </div>
          )}
        </div>

        <div ref={viewportRef}>
          {isDesktop ? (
            /* ── ≥ 1024px: Desktop expanding cards (100% unchanged) ── */
            <div className="overflow-hidden" style={{ height: CARD_HEIGHT }}>
              <motion.div
                className="flex"
                animate={{ x: offset }}
                transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
                style={{ gap: GAP, height: CARD_HEIGHT }}
              >
                {mapped.map((item) => (
                  <IndustryCard
                    key={item.id}
                    item={item}
                    isActive={activeId === item.id}
                    onActivate={() => activateCard(item.id)}
                  />
                ))}
              </motion.div>
            </div>
          ) : isMobile ? (
            /* ── < 768px: Accordion ── */
            <MobileAccordion items={mapped} />
          ) : (
            /* ── 768px–1023px: Swiper (100% unchanged) ── */
            <Swiper
              onSwiper={(s) => {
                mobileSwiperRef.current = s;
                setSwiperAtStart(s.isBeginning);
                setSwiperAtEnd(s.isEnd);
              }}
              onSlideChange={(s) => {
                setSwiperAtStart(s.isBeginning);
                setSwiperAtEnd(s.isEnd);
              }}
              slidesPerView={1}
              breakpoints={{ 640: { slidesPerView: 2 } }}
              spaceBetween={GAP}
              style={{ height: 360 }}
            >
              {mapped.map((item) => (
                <SwiperSlide key={item.id} style={{ height: 360 }}>
                  <div
                    className="relative overflow-hidden w-full"
                    style={{ height: 360 }}
                  >
                    <Image
                      src={item.image || "/assets/placeholder.png"}
                      alt={item.title}
                      fill
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/65 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-40 flex flex-col">
                      <h3 className="text-white font-light text-subHeading mb-20">
                        {item.title}
                      </h3>
                      <p className="text-white font-light text-description mb-50">
                        {item.description}
                      </p>
                      <CustomButton
                        label={item.btnTitle}
                        href={item.href}
                        variant={1}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
};

export default IndustriesWeServe;
