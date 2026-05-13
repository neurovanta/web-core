import Image from "next/image";
import { introData } from "../data";
import { AnimatedHeading } from "@/app/components/client/animations/AnimateHeading";
import { SectionDescription } from "../../animations/SectionDescription";

export default function Intro() {
  const { title, description, image, imageAlt } = introData;

  return (
    <section className="bg-white overflow-hidden">
      <div className="container flex flex-col lg:flex-row py-120 3xl:py-150">
        {/* Left — text */}
        <div className="w-full lg:w-1/2 flex items-center">
          <div className="lg:pr-60 3xl:pr-80">
            <AnimatedHeading
              title={title}
              mode="reveal"
              className="text-secondary mb-20 max-w-[629px]"
            />
            <SectionDescription
              text={description}
              className="text-description text-secondary tracking-[-0.03em] max-w-[629px] whitespace-pre-line"
            />
          </div>
        </div>

        {/* Right — image */}
        <div className="w-full lg:w-1/2 aspect-[4/3] lg:aspect-auto lg:h-[500px] 3xl:h-[575px] relative">
          <Image src={image} alt={imageAlt} fill className="object-cover" />
        </div>
      </div>
    </section>
  );
}
