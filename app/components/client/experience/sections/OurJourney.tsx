"use client";

import Image from "next/image";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import { SectionDescription } from "../../animations/SectionDescription";

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

  return (
    <section className="relative w-full overflow-hidden py-120">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
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
          <div className="flex gap-100 3xl:gap-[104px]">
            {/* Col 1 — Title */}
            <div className="flex items-center pl-90 3xl:pl-[98px]">
              <AnimatedHeading title={title} className="text-heading font-dm-regular text-white" />
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
                <p className="!text-subHeading text-white max-w-[45ch] whitespace-pre-line">
                    {subtitle}
                </p>
              <SectionDescription
                className="text-description text-white max-w-[64ch]"
                text={description}
              />
            </div>
          </div>
      </div>
    </section>
  );
};

export default OurJourney;
