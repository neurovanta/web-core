import Image from "next/image";
import { AnimatedHeading } from "@/app/components/client/animations/AnimateHeading";
import { SectionDescription } from "../animations/SectionDescription";

interface DescImageIntroProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export default function DescImageIntro({ data }: { data: DescImageIntroProps }) {
  const { title, description, image, imageAlt } = data;
  return (
    <section className="bg-white overflow-hidden">
      <div className="container flex flex-col lg:flex-row py-120 3xl:py-150">
        {/* Left — text */}
        <div className="w-full lg:w-[67.485%] flex items-center">
          <div className="lg:pr-60 3xl:pr-80">
            <AnimatedHeading
              title={title}
              mode="reveal"
              className="text-heading text-secondary mb-20 max-w-[22ch]"
            />
            <SectionDescription
              text={description}
              className="!text-subHeading text-secondary tracking-[-0.03em] max-w-[40ch]"
            />
          </div>
        </div>

        {/* Right — image */}
        <div className="w-full lg:w-1/2 aspect-[4/3] lg:aspect-auto lg:h-[460px] 3xl:h-[524px] relative">
          <Image src={image} alt={imageAlt} fill className="object-cover" />
        </div>
      </div>
    </section>
  );
}
