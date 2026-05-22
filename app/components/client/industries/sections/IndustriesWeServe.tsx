"use client";

import Image from "next/image";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CustomButton from "../../common/CustomButton";
import SliderNavButton from "../../common/SliderButton";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { AnimatedHeading } from "../../animations/AnimateHeading";

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

interface IndustriesWeServeProps {
  title: string;
  items: IndustryItem[];
}

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
      src={item.image}
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

const IndustriesWeServe = ({ data }: { data: IndustriesWeServeProps }) => {
  const { title, items } = data;

  const [activeId, setActiveId] = useState<number>(items[0].id);
  const [offset, setOffset] = useState(0);
  const [showNav, setShowNav] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [maxOffset, setMaxOffset] = useState(0);

  // ── Bug 2 fix: track Swiper edge state via its own flags ──────────────────
  const [swiperAtStart, setSwiperAtStart] = useState(true);
  const [swiperAtEnd, setSwiperAtEnd] = useState(false);
  // ─────────────────────────────────────────────────────────────────────────

  const viewportRef = useRef<HTMLDivElement>(null);
  const mobileSwiperRef = useRef<SwiperType | null>(null);

  const trackWidth =
    EXPANDED_W + COLLAPSED_W * (items.length - 1) + GAP * (items.length - 1);

  const getMaxOffset = useCallback(() => {
    if (!viewportRef.current) return 0;
    return Math.max(
      0,
      trackWidth - viewportRef.current.getBoundingClientRect().width,
    );
  }, [trackWidth]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");

    const evaluate = () => {
      const desktop = mq.matches;
      setIsDesktop(desktop);

      const viewW =
        viewportRef.current?.getBoundingClientRect().width ?? window.innerWidth;

      if (desktop) {
        const overflows = trackWidth > viewW;
        const max = overflows ? Math.max(0, trackWidth - viewW) : 0;
        setShowNav(overflows);
        setMaxOffset(max);
        setOffset((prev) => (overflows ? -Math.min(Math.abs(prev), max) : 0));
      } else {
        const slidesVisible = window.innerWidth >= 640 ? 2 : 1;
        setShowNav(items.length > slidesVisible);
        setMaxOffset(0);
        setOffset(0);
      }
    };

    evaluate();
    mq.addEventListener("change", evaluate);

    const ro = new ResizeObserver(evaluate);
    if (viewportRef.current) ro.observe(viewportRef.current);

    return () => {
      mq.removeEventListener("change", evaluate);
      ro.disconnect();
    };
  }, [trackWidth, items.length]);

  // ── Bug 1 fix: ensure the newly expanded card is fully visible ────────────
  const activateCard = useCallback(
    (id: number) => {
      setActiveId(id);

      if (!viewportRef.current) return;

      const viewW = viewportRef.current.getBoundingClientRect().width;
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return;

      // Left edge of this card inside the track (all cards collapsed for
      // the purpose of measuring pre-expansion positions)
      const cardTrackLeft =
        index * (COLLAPSED_W + GAP);

      // After expansion the card is EXPANDED_W wide; measure its right edge
      // relative to the viewport, accounting for the current offset
      const cardRightInView = cardTrackLeft + EXPANDED_W + offset;

      const overshoot = cardRightInView - viewW;

      if (overshoot > 0) {
        // Nudge left just enough so the right edge sits flush with the viewport
        const currentMax = getMaxOffset();
        setOffset((prev) => -Math.min(Math.abs(prev) + overshoot, currentMax));
      }

      // Also ensure the card's left edge isn't scrolled off to the left
      const cardLeftInView = cardTrackLeft + offset;
      if (cardLeftInView < 0) {
        setOffset(-cardTrackLeft);
      }
    },
    [items, offset, getMaxOffset],
  );
  // ─────────────────────────────────────────────────────────────────────────

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

  // ── Bug 2 fix: use Swiper's own edge flags, not a derived index ───────────
  const prevDisabled = isDesktop ? offset >= 0 : swiperAtStart;
  const nextDisabled = isDesktop ? offset <= -maxOffset : swiperAtEnd;
  // ─────────────────────────────────────────────────────────────────────────

  if (isDesktop === null) return null;

  return (
    <section className="w-full py-120 bg-cream-bg">
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
            <div className="overflow-hidden" style={{ height: CARD_HEIGHT }}>
              <motion.div
                className="flex"
                animate={{ x: offset }}
                transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
                style={{ gap: GAP, height: CARD_HEIGHT }}
              >
                {items.map((item) => (
                  <IndustryCard
                    key={item.id}
                    item={item}
                    isActive={activeId === item.id}
                    // ── Bug 1 fix: use activateCard instead of bare setActiveId
                    onActivate={() => activateCard(item.id)}
                  />
                ))}
              </motion.div>
            </div>
          ) : (
            <Swiper
              onSwiper={(s) => {
                mobileSwiperRef.current = s;
                // ── Bug 2 fix: seed edge state from initial Swiper instance
                setSwiperAtStart(s.isBeginning);
                setSwiperAtEnd(s.isEnd);
              }}
              onSlideChange={(s) => {
                // ── Bug 2 fix: update on every slide change
                setSwiperAtStart(s.isBeginning);
                setSwiperAtEnd(s.isEnd);
              }}
              slidesPerView={1}
              breakpoints={{ 640: { slidesPerView: 2 } }}
              spaceBetween={GAP}
              style={{ height: 360 }}
            >
              {items.map((item) => (
                <SwiperSlide key={item.id} style={{ height: 360 }}>
                  <div
                    className="relative overflow-hidden w-full"
                    style={{ height: 360 }}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />
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