"use client";

import Image from "next/image";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import { SectionDescription } from "../../animations/SectionDescription";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ElasticEffect } from "../../animations/ElasticEffect";
import { Careers } from "@/app/types/career";

gsap.registerPlugin(ScrollTrigger);

export default function CareerIntro({
  data,
}: {
  data: Careers["firstSection"];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !imageRef.current) return;

    gsap.fromTo(
      imageRef.current,
      { yPercent: -15, scale: 1 },
      {
        yPercent: 15,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  }, []);
  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[522px] sm:h-[600px] xl:h-screen 3xl:max-h-[888px] overflow-hidden"
    >
      <ElasticEffect />
      {/* Background Image */}
      <div className="absolute inset-0 -z-10" ref={imageRef}>
        <Image
          src={data.image}
          alt={data.imageAlt}
          fill
          className="object-cover pointer-events-none"
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full container flex items-center">
        <div className="flex flex-col md:flex-row gap-[15px] md:gap-80 w-full justify-center">
          {/* Col 1 — Title */}
          <div className="flex items-center">
            <AnimatedHeading
              title={data.title}
              className="text-heading text-white"
            />
          </div>

          {/* Col 2 — Divider */}
          <div className="hidden md:flex self-stretch">
            <div
              className="w-px h-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(215,215,215,0) 0%, #D7D7D7 50%, rgba(215,215,215,0) 100%)",
              }}
            />
          </div>

          <div className="md:hidden self-stretch">
            <div
              className="h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(215,215,215,0) 0%, #D7D7D7 50%, rgba(215,215,215,0) 100%)",
              }}
            />
          </div>

          {/* Col 3 — Description */}
          <div className="md:py-40 3xl:py-[45px] flex items-center">
            <SectionDescription
              text={data.description}
              className="text-subHeading text-white max-w-[40ch] tracking-[-0.03em]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
