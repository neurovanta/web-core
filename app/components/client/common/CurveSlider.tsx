"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { AnimatedHeading } from "../animations/AnimateHeading";
import { SectionDescription } from "../animations/SectionDescription";
import CustomButton from "./CustomButton";
import { ElasticEffect } from "../animations/ElasticEffect";
import { moveUp } from "../animations/motionVarinats";
import { motion } from "framer-motion";

interface CurveSliderProps {
  button?: boolean;
  title: string;
  description: string;
  images: string[];
}

const SPEED = 0.5;

// ── Ellipse mask image ────────────────────────────────────────────────────────
function EllipseMask({ flip = false }: { flip?: boolean }) {
  return (
    <Image
      src="/assets/images/system-details/innovation/curve.svg"
      alt=""
      fill
      className={`object-cover pointer-events-none z-10 ${flip ? "scale-y-[-1]" : ""}`}
    />
  );
}

export default function CurveSlider({
  button = false,
  title,
  description,
  images,
}: CurveSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const rafRef = useRef<number>(0);
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0 });
  const slideRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const gap = slideWidth < 300 ? 3.26 : 10;
  const totalWidth = slideWidth > 0 ? (slideWidth + gap) * images.length : 1;

  useEffect(() => {
    const el = slideRef.current;
    if (!el) return;

    const update = () => {
      setSlideWidth(el.offsetWidth);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (totalWidth > 0) {
      xRef.current = xRef.current % totalWidth;
    }
  }, [totalWidth]);

  const tick = useCallback(() => {
    xRef.current += SPEED;
    if (xRef.current >= totalWidth) xRef.current -= totalWidth;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-xRef.current}px)`;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [totalWidth]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startScroll: xRef.current,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    cancelAnimationFrame(rafRef.current);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const delta = dragRef.current.startX - e.clientX;
    xRef.current =
      (((dragRef.current.startScroll + delta) % totalWidth) + totalWidth) %
      totalWidth;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-xRef.current}px)`;
    }
  };

  const onPointerUp = () => {
    dragRef.current.active = false;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };

  const slides = [...images, ...images, ...images];

  return (
    <section className="relative w-full overflow-hidden border-b md:pb-20 3xl:pb-150 border-border-color">
      {button && (
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={moveUp(0.2)}
          className="hidden xl:flex absolute left-0 bottom-100 3xl:bottom-[205px] right-0 z-20 w-full justify-center"
        >
          <CustomButton label="Apply Now" href="/careers/form" variant={2} />
        </motion.div>
      )}
      <div className="absolute md:top-3 3xl:top-0 left-0 right-0 z-20 text-center">
        <AnimatedHeading title={title} className="mb-[15px] md:mb-20" />
        <SectionDescription
          text={description}
          className="text-description md:tracking-[-0.03em]"
        />
      </div>

      {/* Carousel */}
      <div
        className="
relative
overflow-hidden
cursor-grab
active:cursor-grabbing
select-none
h-[244px] sm:h-[380px] md:h-[500px] lg:h-[620px]
xl:h-[748px]
mt-[30px] md:mt-0
3xl:mt-[13px]
"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <ElasticEffect />
        {/* Top ellipse */}
        <div className="absolute top-0 left-0 right-0 h-[65px] sm:h-[100px] md:h-[160px] lg:h-[180px] xl:h-[200px] 3xl:h-[165px] z-10 pointer-events-none">
          <EllipseMask />
        </div>

        {/* Bottom ellipse */}
        <div className="absolute bottom-0 left-0 right-0 h-[65px] sm:h-[100px] md:h-[160px] lg:h-[180px] xl:h-[200px] 3xl:h-[165px] z-10 pointer-events-none">
          <EllipseMask flip />
        </div>

        <div
          ref={trackRef}
          className="absolute top-0 left-0 flex will-change-transform"
          style={{ gap: gap }}
        >
          {slides.map((src, i) => (
            <div
              ref={i === 0 ? slideRef : undefined}
              key={i}
              className={`relative shrink-0 overflow-hidden w-[146.47px] h-[244px] sm:h-[380px] md:h-[500px] lg:h-[620px] sm:w-[200px] md:w-[230px] lg:w-[300px] xl:w-[449px] xl:h-[748px]`}
            >
              <Image
                src={src}
                alt={`Slide ${(i % images.length) + 1}`}
                fill
                className="object-cover object-top pointer-events-none"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
