"use client";

import Image from "next/image";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import { SectionDescription } from "../../animations/SectionDescription";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface OurJourneyProps {
  data: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
  };
}

const OurJourney = ({ data }: OurJourneyProps) => {
  const { title, subtitle, description, image } = data;
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
      className="relative w-full overflow-hidden py-[90px] lg:py-120"
    >
      {/* Background Image */}
      <div ref={imageRef} className="absolute inset-0 -z-10">
        <Image
          src={image}
          alt="our-journey-background"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Grid */}
      <div className="container">
        <div className="flex md:flex-row flex-col md:gap-100 3xl:gap-[104px] justify-center">
          {/* Title */}
          <div className="flex items-center">
            <AnimatedHeading
              title={title}
              className="text-heading text-white mb-[15px] sm:mb-20 md:mb-0"
            />
          </div>

          <div className="flex justify-center items-stretch md:hidden mb-[15px] sm:mb-20 md:mb-0">
            <div
              className="h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(215,215,215,0) 0%, #D7D7D7 50%, rgba(215,215,215,0) 100%)",
              }}
            />
          </div>
          {/* Vertical Divider */}
          <div className="flex justify-center items-stretch">
            <div
              className="w-px h-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(215,215,215,0) 0%, #D7D7D7 50%, rgba(215,215,215,0) 100%)",
              }}
            />
          </div>
          {/* Subtitle + Description */}
          <div className="md:py-80 flex flex-col md:gap-6 gap-[10px]">
            <SectionDescription
              className="!text-subHeading text-white max-w-[45ch] whitespace-pre-line tracking-[-0.03em]"
              text={subtitle}
            />
            <SectionDescription
              className="text-description text-white max-w-[64ch]"
              text={description}
              delay={1}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurJourney;
