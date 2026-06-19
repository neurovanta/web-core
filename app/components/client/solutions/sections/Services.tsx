"use client";

import Image from "next/image";
import { useRef } from "react";
// import { serviceCardsData } from "../data";
import CustomButton from "../../common/CustomButton";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import { SectionDescription } from "../../animations/SectionDescription";
import { useContainerInset } from "@/app/hooks/useContainerInset";
import ContainerAnchor from "../../layout/ContainerAnchor";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { moveUpV2 } from "../../animations/motionVarinats";
import { ElasticEffect } from "../../animations/ElasticEffect";
import { SolutionType } from "@/app/types/solution";

export interface ServiceCard {
  thumbnailImage: string;
  thumbnailImageAlt: string;
  thumbnailTitle: string;
  thumbnailDescription: string;
  slug: string;
}

function ServiceCard({
  card,
  paddingLeft,
  tileMaxWidth,
  descriptionMaxWidth,
}: {
  card: ServiceCard;
  paddingLeft: number;
  tileMaxWidth?: string;
  descriptionMaxWidth?: string;
}) {
  return (
    <div className="relative w-full lg:w-1/2 overflow-hidden flex flex-col justify-center">
      <Image
        src={card.thumbnailImage}
        alt={card.thumbnailImageAlt}
        fill
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/70" />

      <div
        className="relative z-10 flex flex-col py-[60px] lg:py-120 md:pr-40 3xl:pr-60"
        style={{ paddingLeft }}
      >
        <AnimatedHeading
          title={card.thumbnailTitle}
          className={`text-heading text-white mb-[15px] sm:mb-20 ${tileMaxWidth ?? ""}`}
        />

        <SectionDescription
          text={card.thumbnailDescription}
          className={`text-description text-white sm:tracking-[-0.03em] mb-[145px] 3xl:mb-[197px] ${descriptionMaxWidth ?? ""}`}
        />

        <div className="flex lg:flex-col gap-[10px] lg:gap-20">
          {/* {card.buttons.map((btn, index) => ( */}
          <Reveal variants={moveUpV2} delayRange={0.12}>
            <CustomButton label="EXPLORE" href={`/solutions/${card.slug}`} />
          </Reveal>
          {/* ))} */}
        </div>
      </div>
    </div>
  );
}

export default function Services({ data }: { data: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftInset = useContainerInset(containerRef);

  return (
    <section className="overflow-hidden relative">
      <ElasticEffect />
      <ContainerAnchor ref={containerRef} />

      <div className="flex flex-col lg:flex-row">
        <ServiceCard
          card={data[0]}
          paddingLeft={leftInset}
          tileMaxWidth="md:max-w-[25ch] lg:max-w-[16ch]"
          descriptionMaxWidth="max-w-[550px] lg:max-w-[701px]"
        />
        <ServiceCard
          card={data[1]}
          paddingLeft={leftInset}
          tileMaxWidth="md:max-w-[12ch]"
          descriptionMaxWidth="max-w-[550px] lg:max-w-[701px]"
        />
      </div>
    </section>
  );
}
