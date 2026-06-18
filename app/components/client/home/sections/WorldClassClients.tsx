"use client";

import { brandsData } from "../data";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrandCard } from "../../common/BrandCard";
import { ElasticEffect } from "../../animations/ElasticEffect";

gsap.registerPlugin(ScrollTrigger);

type CardWithHandlers = HTMLElement & {
  _enter?: () => void;
  _leave?: () => void;
};

export default function WorldClassClients() {
  const { heading, rows } = brandsData;

  const sectionRef = useRef<HTMLDivElement | null>(null);

  const mobileRowRef = useRef<HTMLDivElement | null>(null);
  const mobileBrands = [...rows.row1, ...rows.row2, ...rows.row3];

  useEffect(() => {
    const marqueeTweens: gsap.core.Tween[] = [];

    const createMarquee = (
      track: HTMLDivElement,
      direction: "left" | "right",
      duration: number,
    ) => {
      const originalItems = Array.from(track.children) as HTMLElement[];

      let contentWidth = originalItems.reduce(
        (acc, el) => acc + el.offsetWidth,
        0,
      );

      while (contentWidth < window.innerWidth * 2.5) {
        originalItems.forEach((item) => {
          const clone = item.cloneNode(true) as HTMLElement;
          clone.dataset.clone = "true";
          track.appendChild(clone);
          contentWidth += item.offsetWidth;
        });
      }

      const moveDistance = contentWidth / 2;

      const wrapX =
        direction === "left"
          ? gsap.utils.wrap(-moveDistance, 0)
          : gsap.utils.wrap(0, moveDistance);

      gsap.set(track, { x: 0 });

      const tween = gsap.to(track, {
        x: direction === "left" ? `-=${moveDistance}` : `+=${moveDistance}`,
        duration,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: (x) => `${wrapX(parseFloat(x))}px`,
        },
      });

      marqueeTweens.push(tween);
    };

    const ctx = gsap.context(() => {
      if (window.innerWidth >= 1280) {
        const row1 = gsap.utils.toArray<HTMLElement>(
          ".logo-wrap > div:nth-child(1) .brand-card",
        );
        const row2 = gsap.utils.toArray<HTMLElement>(
          ".logo-wrap > div:nth-child(2) .brand-card",
        );
        const row3Left = gsap.utils.toArray<HTMLElement>(
          ".logo-wrap > div:nth-child(3) > div:first-child .brand-card",
        );
        const row3Right = gsap.utils.toArray<HTMLElement>(
          ".logo-wrap > div:nth-child(3) > div:last-child .brand-card",
        );

        const allCards = gsap.utils.toArray<HTMLElement>(".brand-card");

        gsap.set(allCards, {
          opacity: 0,
          scale: 0.9,
          filter: "blur(3px)",
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        });

        tl.fromTo(
          row1,
          { x: 120 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.72,
            ease: "power3.out",
            stagger: 0.15,
          },
        )
          .fromTo(
            row2,
            { x: -120 },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.72,
              ease: "power3.out",
              stagger: 0.15,
            },
            "-=0.4",
          )
          .fromTo(
            row3Left,
            { x: -120 },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.72,
              ease: "power3.out",
            },
            "-=0.3",
          )
          .fromTo(
            row3Right,
            { x: 120 },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.72,
              ease: "power3.out",
              stagger: 0.15,
            },
            "-=0.6",
          );

        allCards.forEach((card) => {
          const el = card as CardWithHandlers;

          const enter = () => {
            gsap.to(el, {
              scale: 1.04,
              duration: 0.5,
              ease: "power3.out",
              borderColor: "var(--primary)",
            });
          };

          const leave = () => {
            gsap.to(el, {
              scale: 1,
              duration: 0.5,
              ease: "power3.out",
              borderColor: "var(--border-color)",
            });
          };

          el.addEventListener("mouseenter", enter);
          el.addEventListener("mouseleave", leave);

          el._enter = enter;
          el._leave = leave;
        });
      } else {
        if (window.innerWidth < 1280 && mobileRowRef.current) {
          createMarquee(mobileRowRef.current, "left", 18);
        }
      }
    }, sectionRef);

    return () => {
      ctx.revert();

      marqueeTweens.forEach((tween) => tween.kill());

      const cards = document.querySelectorAll<HTMLElement>(".brand-card");

      cards.forEach((card) => {
        const el = card as CardWithHandlers;

        if (el._enter) {
          el.removeEventListener("mouseenter", el._enter);
        }

        if (el._leave) {
          el.removeEventListener("mouseleave", el._leave);
        }
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="pt-[65px] lg:pt-90 3xl:pt-[94px] pb-[65px] lg:pb-120 3xl:pb-150 overflow-hidden relative"
    >
      <ElasticEffect />

      <div className="mb-[15px] sm:mb-20 md:mb-50 container">
        <AnimatedHeading
          title={heading}
          className="text-heading text-secondary max-w-[21ch]"
        />
      </div>

      {/* Mobile / Tablet */}
      <div className="xl:hidden overflow-hidden">
        <div ref={mobileRowRef} className="flex w-max gap-[10px] sm:gap-20">
          {[...mobileBrands, ...mobileBrands].map((brand, index) => (
            <BrandCard key={`${brand.id}-${index}`} brand={brand} />
          ))}
        </div>
      </div>

      {/* Desktop - unchanged */}
      <div className="hidden xl:flex logo-wrap flex-col gap-5 3xl:mt-[5px] container">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap w-full lg:justify-end gap-20">
          {rows.row1.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap w-full lg:justify-start gap-20">
          {rows.row2.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-20 lg:flex w-full lg:justify-between">
          <div className="order-2 sm:order-1 lg:order-1">
            <BrandCard key={rows.row3[0].id} brand={rows.row3[0]} />
          </div>

          <div className="col-span-1 sm:col-span-2 sm:grid sm:grid-cols-2 flex gap-20 flex-wrap order-1 sm:order-2 lg:order-2 lg:flex lg:flex-wrap">
            {rows.row3.slice(1).map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
