import Image from "next/image";
import CustomButton from "@/app/components/client/common/CustomButton";
import { AnimatedHeading } from "../animations/AnimateHeading";

interface InnerCtaProps {
  data: {
    bgImage: string;
    title: string;
    btn: {
      label: string;
      href: string;
    };
  };
  maxW?: string;
}

export default function InnerCta({ data, maxW = "" }: InnerCtaProps) {
  return (
    <section className="relative w-full h-[420px] md:h-[520px] xl:h-[580px] 3xl:h-[757px] overflow-hidden">
      {/* Background Image */}
      <Image
        src={data.bgImage}
        alt={data.title}
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full container">
        <AnimatedHeading
          title={data.title}
          className={`text-white text-heading font-dm-regular mb-50 ${maxW}`}
        />

        <div>
          <CustomButton
            label={data.btn.label}
            href={data.btn.href}
            variant={1}
          />
        </div>
      </div>
    </section>
  );
}
