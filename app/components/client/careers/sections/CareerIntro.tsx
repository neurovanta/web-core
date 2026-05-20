"use client";

import Image from "next/image";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import { SectionDescription } from "../../animations/SectionDescription";

interface CareerIntroProps {
  title: string;
  description: string;
  bgImage: string;
}

export default function CareerIntro({
  title,
  description,
  bgImage,
}: CareerIntroProps) {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={bgImage}
          alt="Why work with us background"
          fill
          className="object-cover pointer-events-none"
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full container flex items-center">
        <div className="flex gap-80 w-full justify-center">
          {/* Col 1 — Title */}
          <div className="flex items-center">
            <AnimatedHeading
              title={title}
              className="text-heading text-white"
            />
          </div>

          {/* Col 2 — Divider */}
          <div className="self-stretch flex">
            <div
              className="w-px h-full"
              style={{
                background:
                  "linear-gradient(180deg, rgba(215,215,215,0) 0%, #D7D7D7 50%, rgba(215,215,215,0) 100%)",
              }}
            />
          </div>

          {/* Col 3 — Description */}
          <div className="py-40 3xl:py-[45px] flex items-center">
            <SectionDescription text={description} className="text-subHeading text-white max-w-[40ch] tracking-[-0.03em]" />
          </div>
        </div>
      </div>
    </section>
  );
}
