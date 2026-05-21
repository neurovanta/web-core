"use client";

import { useRef, useEffect, useCallback } from "react";
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

const GAP = 10;
const SPEED = 0.5;
const SLIDE_W = 449;
const SLIDE_H = 748;

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
  const totalWidth = (SLIDE_W + GAP) * images.length;

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
    rafRef.current = requestAnimationFrame(tick);
  };

  const slides = [...images, ...images, ...images];

  return (
    <section className="relative w-full overflow-hidden border-b pb-20 3xl:pb-150 border-border-color">
      {button && (
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={moveUp(0.2)}
          className="absolute left-0 bottom-100 3xl:bottom-[205px] right-0 z-20 w-full flex justify-center"
        >
          <CustomButton label="Apply Now" href="/careers/form" variant={2} />
        </motion.div>
      )}
      <div className="absolute top-3 3xl:top-0 left-0 right-0 z-20 text-center">
        <AnimatedHeading title={title} className="mb-20" />
        <SectionDescription
          text={description}
          className="text-description tracking-[-0.03em]"
        />
      </div>

      {/* Carousel */}
      <div
        className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none 3xl:mt-[13px]"
        style={{ height: SLIDE_H }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <ElasticEffect />
        {/* Top ellipse */}
        <div className="absolute top-0 left-0 right-0 h-[180px] 3xl:h-[165px] z-10 pointer-events-none">
          <EllipseMask />
        </div>

        {/* Bottom ellipse */}
        <div className="absolute bottom-0 left-0 right-0 h-[180px] 3xl:h-[165px] z-10 pointer-events-none">
          <EllipseMask flip />
        </div>

        <div
          ref={trackRef}
          className="absolute top-0 left-0 flex will-change-transform"
          style={{ gap: GAP }}
        >
          {slides.map((src, i) => (
            <div
              key={i}
              className={`relative shrink-0 overflow-hidden w-[449px] h-[748px]`}
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
