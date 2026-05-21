"use client";

import { useRef } from "react";
import Image from "next/image";
import CustomButton from "@/app/components/client/common/CustomButton";
import { AnimatedHeading } from "../animations/AnimateHeading";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface InnerCtaProps {
  data: {
    bgImage: string;
    title: string;
    btn: {
      label: string;
      href: string;
    };
  };
  maxW?: string;
}

export default function InnerCta({ data, maxW = "" }: InnerCtaProps) {
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
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[420px] md:h-[520px] xl:h-[590px] 3xl:h-[757px] overflow-hidden"
    >
      {/* Background Image */}
      <div ref={imageRef} className="absolute inset-0 will-change-transform">
        <Image
          src={data.bgImage}
          alt={data.title}
          fill
          priority
          className="object-cover pointer-events-none"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full container">
        <AnimatedHeading
          title={data.title}
          className={`text-white text-heading mb-50 ${maxW}`}
        />

        <div>
          <CustomButton
            label={data.btn.label}
            href={data.btn.href}
            variant={1}
          />
        </div>
      </div>
    </section>
  );
}