"use client";

import Image from "next/image";
import CircleAnimation from "@/app/components/client/common/CircleAnimation";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import { SectionDescription } from "../../animations/SectionDescription";

const HowItFits = ({title, description, image}: {title: string, description: string, image: string}) => {

  return (
    <section className="relative w-full max-h-[503px] 3xl:h-[503px] py-[90px] lg:py-170 3xl:py-[180px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={image}
          alt="how-it-fits-background"
          fill
          className="object-cover object-center"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Circle Animation — full bleed behind content */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center max-w-[320px] sm:max-w-[600px] lg:max-w-[750px] 2xl:max-w-[925px] mx-auto">
        <CircleAnimation variant={2} />
      </div>

      {/* Text Content */}
      <div className="container mx-auto flex flex-col items-center justify-center text-center h-full">
        <AnimatedHeading
          title={title}
          className="text-heading mb-[15px] sm:mb-20 text-white"
          mode="reveal"
        />
        <SectionDescription
          className="text-description max-w-[61ch] text-white"
          text={description}
        />
      </div>
    </section>
  );
};

export default HowItFits;
