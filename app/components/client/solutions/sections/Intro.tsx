"use client";

import Image from "next/image";
import { introData } from "../data";
import { AnimatedHeading } from "@/app/components/client/animations/AnimateHeading";
import { SectionDescription } from "../../animations/SectionDescription";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { ElasticEffect } from "../../animations/ElasticEffect";

gsap.registerPlugin(ScrollTrigger);

export default function Intro() {
  const { title, description, image, imageAlt } = introData;
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !imageRef.current) return;

    gsap.fromTo(
      imageRef.current,
      { yPercent: -13, scale: 1 },
      {
        yPercent: 13,
        scale: 1.02,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="bg-white overflow-hidden">
      <div className="container flex flex-col lg:flex-row py-120 3xl:py-150">
        {/* Left — text */}
        <div className="w-full lg:w-1/2 flex items-center">
          <div className="lg:pr-60 3xl:pr-80">
            <AnimatedHeading
              title={title}
              mode="reveal"
              className="text-heading text-secondary mb-20 max-w-[629px]"
            />
            <SectionDescription
              text={description}
              className="!text-subHeading text-secondary tracking-[-0.03em] max-w-[629px] whitespace-pre-line"
            />
          </div>
        </div>

        {/* Right — image */}
        <div
          className="w-full lg:w-1/2 aspect-[4/3] lg:aspect-auto lg:h-[500px] 3xl:h-[575px] relative overflow-hidden"
        >
          <div ref={imageRef} className="relative w-full h-full">
            <ElasticEffect />
            <Image src={image} alt={imageAlt} fill className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
