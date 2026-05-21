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
      className="relative w-full overflow-hidden py-120"
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
        <div className="flex gap-100 3xl:gap-[104px] justify-center">
          {/* Col 1 — Title */}
          <div className="flex items-center">
            <AnimatedHeading
              title={title}
              className="text-heading text-white"
            />
          </div>
          {/* Col 2 — Vertical Divider */}
          <div className="flex justify-center items-stretch">
            <div
              className="w-px h-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(215,215,215,0) 0%, #D7D7D7 50%, rgba(215,215,215,0) 100%)",
              }}
            />
          </div>
          {/* Col 3 — Subtitle + Description */}
          <div className="py-80 flex flex-col gap-6">
            <SectionDescription
              className="!text-subHeading text-white max-w-[45ch] whitespace-pre-line"
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
