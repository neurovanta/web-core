"use client";

import Image from "next/image";
import { AnimatedHeading } from "@/app/components/client/animations/AnimateHeading";
import { SectionDescription } from "../animations/SectionDescription";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface DescImageIntroProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export default function DescImageIntro({
  data,
}: {
  data: DescImageIntroProps;
}) {
  const { title, description, image, imageAlt } = data;
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !imageRef.current) return;

    gsap.fromTo(
      imageRef.current,
      { yPercent: -15, scale: 1 },
      {
        yPercent: 15,
        scale: 1.12,
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
    <section ref={sectionRef} className="bg-white overflow-hidden">
      <div className="container flex flex-col lg:flex-row py-[65px] lg:py-120 3xl:py-150">
        {/* Left — text */}
        <div className="w-full lg:w-[67.485%] flex items-center">
          <div className="lg:pr-60 3xl:pr-80">
            <AnimatedHeading
              title={title}
              mode="reveal"
              className="text-heading text-secondary mb-[15px] sm:mb-20 max-w-[27ch] lg:max-w-[22ch]"
            />
            <SectionDescription
              text={description}
              className="!text-subHeading text-secondary tracking-[-0.03em] max-w-[45ch] lg:max-w-[40ch] mb-[30px] lg:mb-0"
            />
          </div>
        </div>

        {/* Right — image */}
        <div className="w-full lg:w-1/2 aspect-[4/3] max-[430px]:max-h-[201px] min-[431px]:h-[400px] sm:max-h-auto lg:aspect-auto lg:h-[460px] 3xl:h-[524px] relative overflow-hidden">
          <div ref={imageRef} className="relative w-full h-full">
            <Image
              src={image || "/assets/placeholder.png"}
              alt={imageAlt}
              fill
              className="object-cover object-top pointer-events-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
