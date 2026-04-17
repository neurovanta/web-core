"use client";

import Image from "next/image";
import { brandsData } from "../data";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Brand = {
  id: string;
  logo: string;
};

gsap.registerPlugin(ScrollTrigger);

type CardWithHandlers = HTMLElement & {
  _enter?: () => void;
  _leave?: () => void;
};

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <div
      className=" brand-card
        flex items-center justify-center border border-border-color 
        w-full h-[136px]
        sm:w-[300px] sm:h-[205px]
        xl:w-[270px] xl:h-[185px]
        2xl:w-[280px] 2xl:h-[190px]
        3xl:w-[366px] 3xl:h-[250px]
        flex-shrink-0
      "
    >
      <Image
        src={brand.logo}
        alt={brand.id}
        width={220}
        height={91}
        className="object-contain h-[80px] 3xl:h-[91px] w-auto pointer-events-none"
      />
    </div>
  );
}

export default function WorldClassClients() {
  const { heading, rows } = brandsData;
  const sectionRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  const ctx = gsap.context(() => {
    const row1 = gsap.utils.toArray<HTMLElement>(".logo-wrap > div:nth-child(1) .brand-card");
    const row2 = gsap.utils.toArray<HTMLElement>(".logo-wrap > div:nth-child(2) .brand-card");
    const row3Left = gsap.utils.toArray<HTMLElement>(".logo-wrap > div:nth-child(3) > div:first-child .brand-card");
    const row3Right = gsap.utils.toArray<HTMLElement>(".logo-wrap > div:nth-child(3) > div:last-child .brand-card");

    const allCards = gsap.utils.toArray<HTMLElement>(".brand-card");

    // Initial state
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

    // Row 1 — from RIGHT
    tl.fromTo(
      row1,
      { x: 120 },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
      }
    )

      // Row 2 — from LEFT
      .fromTo(
        row2,
        { x: -120 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
        },
        "-=0.4"
      )

      // Row 3 LEFT — from LEFT
      .fromTo(
        row3Left,
        { x: -120 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.3"
      )

      // Row 3 RIGHT — from RIGHT
      .fromTo(
        row3Right,
        { x: 120 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
        },
        "-=0.6"
      );

    // ✅ Hover animation (GSAP-safe)
allCards.forEach((card) => {
  const el = card as CardWithHandlers;

  const enter = () => {
    gsap.to(el, {
      scale: 1.04,
      duration: 0.5, // smoother
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
  }, sectionRef);

  return () => {
    // cleanup GSAP context
    ctx.revert();

    // cleanup event listeners
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
      className="container pt-90 3xl:pt-[94px] pb-120 3xl:pb-150"
    >
      <div className="mb-20 md:mb-50">
        <AnimatedHeading
          title={heading}
          className="text-heading text-secondary max-w-[21ch]"
        />
      </div>

      <div className="logo-wrap flex flex-col gap-5 3xl:mt-[5px]">
        {/* Row 1 */}
        <div className="grid grid-cols-2 md:flex flex-wrap w-full justify-end gap-20">
          {rows.row1.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 md:flex flex-wrap w-full justify-start gap-20 justify-content-end">
          {rows.row2.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-2 gap-20 sm:flex w-full md:justify-between">
          <div className="order-2 md:order-1">
            <BrandCard brand={rows.row3.left} />
          </div>
          <div className="flex gap-20 flex-wrap order-1 md:order-2">
            {rows.row3.right.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}