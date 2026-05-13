"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { brandsData } from "../data";
import { BrandCard } from "@/app/components/client/common/BrandCard";
import { AnimatedHeading } from "@/app/components/client/animations/AnimateHeading";
import { useContainerInset } from "@/app/hooks/useContainerInset";

export default function InfiniteClients() {
  const { title, brands } = brandsData;

  const isDesktopRef = useRef(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const paddingInset = useContainerInset(containerRef);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    isDesktopRef.current = window.innerWidth >= 1024;
    const duration = isDesktopRef.current ? 30 : 15;

    // cleanup old clones
    track.querySelectorAll("[data-clone='true']").forEach((n) => n.remove());

    const originalItems = Array.from(track.children) as HTMLElement[];
    let contentWidth = originalItems.reduce(
      (acc, el) => acc + el.offsetWidth,
      0,
    );

    while (contentWidth < viewport.offsetWidth * 2.5) {
      originalItems.forEach((item) => {
        const clone = item.cloneNode(true) as HTMLElement;
        clone.dataset.clone = "true";
        track.appendChild(clone);
        contentWidth += item.offsetWidth;
      });
    }

    const wrapX = gsap.utils.wrap(-contentWidth / 2, 0);
    gsap.set(track, { x: 0 });

    const tween = gsap.to(track, {
      x: `-=${contentWidth / 2}`,
      duration,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: (x) => `${wrapX(parseFloat(x))}px`,
      },
    });

    tweenRef.current = tween;

    return () => {
      tween.kill();
      tweenRef.current = null;
    };
  }, []);

  return (
    <section className="overflow-hidden py-120 3xl:py-150">
      <div ref={containerRef} className="container">
        <AnimatedHeading
          title={title}
          mode="reveal"
          className="text-secondary mb-60 max-w-[20ch]"
        />
      </div>

      {/* Full-width marquee — no container constraint */}
      <div
        ref={viewportRef}
        style={{ marginLeft: paddingInset }}
        className="relative w-full overflow-hidden"
        onMouseEnter={() => {
          if (isDesktopRef.current) tweenRef.current?.pause();
        }}
        onMouseLeave={() => {
          if (isDesktopRef.current) tweenRef.current?.resume();
        }}
      >
        <div
          ref={trackRef}
          className="flex w-max items-center gap-[10px] lg:gap-[20px] 3xl:gap-[24px]"
        >
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}
