"use client";

import CareersForm from "../sections/CareerForm";
import { careersFormData } from "../data";
import { AnimatedHeading } from "../../animations/AnimateHeading";
import { SectionDescription } from "../../animations/SectionDescription";

export default function CareersApply() {
  const { title, subtitle, description } = careersFormData;

  return (
    <section className="mt-200 xl:mt-[230px] 3xl:mt-[290px] pb-120 3xl:pb-150 border-b border-border-color">
      <div className="w-full flex flex-col xl:flex-row gap-100 3xl:gap-[85px] container justify-between">
        {/* Left: Text content */}
        <div className="flex flex-col">
          <AnimatedHeading
            title={title}
            className="text-heading mb-50 max-w-[14ch]"
          />
          <SectionDescription
            text={subtitle}
            className="text-subHeading tracking-[-0.03em] text-secondary mb-20 max-w-[25ch]"
          />
          <SectionDescription
            text={description}
            className="text-description text-secondary tracking-[-0.03em] max-w-[43ch]"
          />
        </div>

        {/* Right: Form */}
        <div className="flex-1 max-w-[1021px]">
          <CareersForm />
        </div>
      </div>
    </section>
  );
}
